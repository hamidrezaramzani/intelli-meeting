from ollama import AsyncClient
from src.ollama.schema import MeetingSummary, MeetingActionItem, MeetingDecision
from src.chroma.chroma import chroma_collection
from jsonriver import parse
import asyncio

system_prompt = """
    You are a professional meeting assistant.
"""


async def stream_generator(stream):
    async for chunk in stream:
        yield chunk["message"]["content"]


async def stream_section(
    websocket, client, section_type, query_text, audio_ids, format
):
    try:
        documents_list = chroma_collection.query(
            query_texts=[query_text],
            where={"audio_id": {"$in": audio_ids}},
            n_results=4 if section_type == "summary" else 3,
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
            await websocket.send_json({"type": section_type, "data": item})

    except Exception as e:
        print(f"Error in {section_type} stream:", e)


async def generate_meeting_summary(websocket, audio_ids):
    client = AsyncClient()

    queries = {
        "summary": "Extract the four most important points and key discussions from this meeting transcript. Focus on concise, high-level insights that summarize the overall meeting, avoiding repetition or irrelevant details.",
        "decisions": "Identify the three most critical decisions made during this meeting. Include final agreements, approvals, resolutions, and conclusions, specifying what was decided and any relevant context, without adding invented information.",
        "actions": "List the three most important action items from this meeting. Include who is responsible for each task, the deadline if mentioned, and a brief description of the task. Focus on actionable points and avoid duplicates.",
    }

    asyncio.create_task(
        stream_section(
            audio_ids=audio_ids,
            client=client,
            websocket=websocket,
            section_type="summary",
            query_text=queries["summary"],
            format=MeetingSummary.model_json_schema(),
        )
    )

    asyncio.create_task(
        stream_section(
            audio_ids=audio_ids,
            client=client,
            websocket=websocket,
            section_type="decisions",
            query_text=queries["decisions"],
            format=MeetingDecision.model_json_schema(),
        )
    )

    asyncio.create_task(
        stream_section(
            audio_ids=audio_ids,
            client=client,
            websocket=websocket,
            section_type="actions",
            query_text=queries["actions"],
            format=MeetingActionItem.model_json_schema(),
        )
    )

