from sqlalchemy.orm import joinedload
from src.llm.schema import MeetingSummary, MeetingActionItem, MeetingDecision
from src.chroma.chroma import chroma_collection
import json
from src.meeting_summary import service as meeting_summary_service
from src.notification import service as notification_service
from src.meeting.models import Meeting
from src.redis.redis import publisher
from src.database import SessionLocal
from openai import OpenAI
import os
from src.speaker_profile.models import SpeakerProfile
from src.employee.models import Employee
import asyncio
from src.config import settings

os.environ["TOKENIZERS_PARALLELISM"] = "false"

system_prompt = """
You are an AI meeting assistant. Your task is to analyze organizational meeting transcripts and output structured results strictly in JSON format. 
You must not output plain text, explanations, or commentary. Always follow this JSON schema:
"""
 

client = OpenAI(
    base_url=settings.BASE_URL,
    api_key=settings.API_KEY,
)

def get_system_prompt(section_type):
    base = """
        You are an AI meeting assistant. Your task is to analyze organizational meeting transcripts and output structured results strictly in JSON format. 
        You must not output plain text, explanations, or commentary. Always follow this JSON schema:
        """
    if section_type == "summary":
        return base + """
        {
            "summary": {
                "summary": "Concise high-level summary of the meeting.",
                "key_points": ["Key point 1", "Key point 2", "Key point 3", "Key point 4"]
            }
        }

        Instructions:
        1. Capture the four most important discussion points and insights, avoiding repetition.
        2. Output must always be valid JSON and parsable. Never add extra text outside the JSON structure.
        """
    elif section_type == "decisions":
        return base + """
        {
        "decisions": [
            {
                "description": "Description test"
                "decided_by": "Who decide"
            }
        ]
        }

        Instructions:
        1. List the three most critical decisions made in the meeting, with relevant context, but without inventing information.
        2. Output must always be valid JSON and parsable. Never add extra text outside the JSON structure.
        """
    elif section_type == "actions":
        return base + """
        {
        "actions": [
            {
                "description": "description about this action"
                owner: "owner of this action"
                deadline: "deadline of this action"
            }
        ]
        }

        Instructions:
        1. List the three most important action items, specifying owner and deadline if mentioned.
        2. Output must always be valid JSON and parsable. Never add extra text outside the JSON structure.
"""


async def get_user_prompt(db, query_text, audio_ids, ):
    documents_list = chroma_collection.query(
        query_texts=[query_text],
        where={"audio_id": {"$in": audio_ids}},
        n_results=8,
    )
    documents = documents_list["documents"][0]
    metadatas = documents_list["metadatas"][0]

    speaker_profile_ids = {
        int(m["speaker_profile_id"])
        for m in metadatas
        if m.get("speaker_profile_id")
    }

    speaker_profiles = (
        db.query(SpeakerProfile)
        .filter(SpeakerProfile.id.in_(speaker_profile_ids))
        .options(
            joinedload(SpeakerProfile.employee)
            .joinedload(Employee.position)
        )
        .all()
    )

    speaker_map = {sp.id: sp for sp in speaker_profiles}

    enriched_chunks = []

    for doc, meta in zip(documents, metadatas):
        prefix = "[Unknown Speaker]"

        sp_id = meta.get("speaker_profile_id")
        sp = speaker_map.get(int(sp_id)) if sp_id else None

        if sp and sp.employee:
            employee_name = sp.employee.fullName
            position = (
                sp.employee.position.title
                if sp.employee.position
                else "Unknown Position"
            )
            prefix = f"[{employee_name} | {position}]"

        elif meta.get("speaker_label"):
            prefix = f"[{meta['speaker_label']}]"

        enriched_chunks.append(f"{prefix}:\n{doc}")

    content = "\n\n".join(enriched_chunks)
    
    return content


def llm_sync_call(query_text, section_type, user_prompt, format, system_prompt):
    response = client.chat.completions.create(
            model=settings.MODEL_ID,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.8,
            top_p=0.9,
            seed=42,
            tool_choice="auto",
            tools=[
                {
                    "type": "function",
                    "function": {
                        "name": section_type,
                        "description": query_text,
                        "parameters": format
                    }
                }
            ],
        )
    return response

async def stream_section(
    key, section_type, query_text, audio_ids, format, meeting_id, db
):
    try:
        content = await get_user_prompt(db=db, query_text=query_text, audio_ids=audio_ids)
        system_prompt = get_system_prompt(section_type)
        user_prompt = f"Processing {section_type} for the transcript:\n{content}"

        loop = asyncio.get_running_loop()
        response = await loop.run_in_executor(None, llm_sync_call, query_text, section_type, user_prompt, format, system_prompt)
        msg = response.choices[0].message
        tool_calls = msg.tool_calls
        parsed_response = {}
        if tool_calls and len(tool_calls) > 0:
            function_args = tool_calls[0].function.arguments
            parsed_response = json.loads(function_args)
        else:
            content = msg.content
            if content:
                try:
                    parsed_response = json.loads(content)
                except json.JSONDecodeError:
                    parsed_response = {"error": "invalid JSON in content"}
            else:
                parsed_response = {}

        await publisher(key, {"type": section_type, "data": parsed_response})
        meeting_summary_service.create_meeting_summaries(
            db=db,
            section_type=section_type,
            meeting_id=meeting_id,
            data=parsed_response,
        )
    except Exception as e:

        raise e

async def generate_meeting_summary(key, user_id, audio_ids, meeting_id):
    db = SessionLocal()
    try:
        await notification_service.create_notification(
            db=db,
            user_id=user_id,
            title="Summary Generation Started",
            message="Creating a summary from your meeting transcript",
            type="summary-generation-started",
            meeting_id=meeting_id,
        )
        await meeting_summary_service.delete_all_summaries(db, meeting_id)

        queries = {
            "summary": "Extract the four most important points and key discussions from this meeting transcript. Focus on concise, high-level insights that summarize the overall meeting, avoiding repetition or irrelevant details.",
            "decisions": "Identify the three most critical decisions made during this meeting. Include final agreements, approvals, resolutions, and conclusions, specifying what was decided and any relevant context, without adding invented information.",
            "actions": "List the three most important action items from this meeting. Include who is responsible for each task, the deadline if mentioned, and a brief description of the task. Focus on actionable points and avoid duplicates.",
        }

        meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
        try:
            meeting.is_generating = True
            db.commit()
            await stream_section(
                key,
                "summary",
                queries["summary"],
                audio_ids,
                MeetingSummary.model_json_schema(),
                meeting_id,
                db,
            )
            await stream_section(
                key,
                "decisions",
                queries["decisions"],
                audio_ids,
                MeetingDecision.model_json_schema(),
                meeting_id,
                db,
            )
            await stream_section(
                key,
                "actions",
                queries["actions"],
                audio_ids,
                MeetingActionItem.model_json_schema(),
                meeting_id,
                db,
            )
            meeting.is_generating = False
            db.commit()
        except:
            meeting.is_generating = False
            db.commit()
            await notification_service.create_notification(
                db=db,
                user_id=user_id,
                title="Summary Generation Failed",
                message="Unable to generate summary. Please try again",
                type="generate-summary-failed",
                meeting_id=meeting_id,
            )

        try:
            await publisher(key, {"type": "done", "data": "success"})
            await notification_service.create_notification(
                db=db,
                user_id=user_id,
                title="Summary Ready",
                message="The meeting summary has been generated",
                type="summary-ready",
                meeting_id=meeting_id,
            )
        except:
            meeting.is_generating = False
            db.commit()
            await notification_service.create_notification(
                db=db,
                user_id=user_id,
                title="Summary Generation Failed",
                message="Unable to generate summary. Please try again",
                type="generate-summary-failed",
                meeting_id=meeting_id,
            )

    except Exception as e:
        print(f"Error generating meeting summary: {e}")
        return
