from ollama import AsyncClient
from src.ollama.schema import MeetingSummary, MeetingActionItem, MeetingDecision
from src.chroma.chroma import chroma_collection
from jsonriver import parse
from src.meeting_summary import service as meeting_summary_service
from src.notification import service as notification_service
from src.meeting.models import Meeting
from src.redis.redis import publisher
from src.database import SessionLocal

system_prompt = """
    You are a professional meeting assistant.
"""


async def stream_generator(stream):
    async for chunk in stream:
        yield chunk["message"]["content"]


async def stream_section(
    key, client, section_type, query_text, audio_ids, format, meeting_id, db
):
    try:
        partial_results = {}
        documents_list = chroma_collection.query(
            query_texts=[query_text],
            where={"audio_id": {"$in": audio_ids}},
            n_results=1 if section_type == "summary" else 1,
        )
        content = " ".join(documents_list["documents"][0])
        message = f"Processing {section_type} for the transcript:\n{content}"
        stream = await client.chat(
            model="llama3.1",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
            format=format,
            stream=True,
        )
        async for item in parse(stream_generator(stream)):
            partial_results = item
            await publisher(key, {"type": section_type, "data": item})
        meeting_summary_service.create_meeting_summuries(
            db=db,
            section_type=section_type,
            meeting_id=meeting_id,
            data=partial_results,
        )

    except Exception as e:
        print(f"Error in {section_type} stream:", e)
        raise


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
        client = AsyncClient()
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
                client,
                "summary",
                queries["summary"],
                audio_ids,
                MeetingSummary.model_json_schema(),
                meeting_id,
                db,
            )
            await stream_section(
                key,
                client,
                "decisions",
                queries["decisions"],
                audio_ids,
                MeetingDecision.model_json_schema(),
                meeting_id,
                db,
            )
            await stream_section(
                key,
                client,
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
