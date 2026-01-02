import asyncio
from typing import List, Optional

from fastapi import HTTPException
from openai import OpenAI
from sqlalchemy.orm import Session, joinedload

from src.auth import models as auth_models
from src.auth import utils as auth_utils
from src.audio import models as audio_models
from src.chroma.chroma import chroma_collection
from src.config import settings
from src.database import SessionLocal
from src.employee.models import Employee
from src.meeting import models as meeting_models
from src.meeting_chat.models import (
    MeetingChatJob,
    MeetingChatJobStatus,
    MeetingChatMessage,
)
from src.speaker_profile.models import SpeakerProfile
from src.websocket.websocket import manager

SYSTEM_PROMPT = (
    "You are an AI assistant helping answer questions about a specific meeting. "
    "Use only the provided meeting context and recent conversation to respond concisely. "
    "If the information is missing in the context, say you do not have that information yet."
)

NO_INFO_MESSAGE = "There is no information for this meeting yet. Please upload/update it."
NO_INFO_CODE = "no_meeting_info"
PROCESSING_ERROR_CODE = "processing_error"
GENERIC_ERROR_MESSAGE = "We could not generate a response right now. Please try again."

client = OpenAI(
    base_url=settings.BASE_URL,
    api_key=settings.API_KEY,
)


def get_user_by_token(db: Session, token: str) -> auth_models.User:
    payload = auth_utils.decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user_email = payload.get("sub")
    if not user_email:
        raise HTTPException(status_code=401, detail="Invalid user in token")
    user = (
        db.query(auth_models.User)
        .filter(auth_models.User.email == user_email)
        .first()
    )
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


def assert_meeting_owner(db: Session, meeting_id: int, user_id: int):
    meeting = (
        db.query(meeting_models.Meeting)
        .filter(meeting_models.Meeting.id == meeting_id)
        .first()
    )
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    if meeting.user_id != user_id:
        raise HTTPException(status_code=403, detail="Permission denied")
    return meeting


def get_meeting_audio_ids(db: Session, meeting_id: int) -> List[str]:
    audios = (
        db.query(audio_models.Audio)
        .filter(
            audio_models.Audio.meeting_id == meeting_id,
            audio_models.Audio.status == audio_models.AudioStatus.SUCCESS,
        )
        .all()
    )
    return [str(audio.id) for audio in audios]


def has_processing_job(db: Session, meeting_id: int) -> bool:
    return (
        db.query(MeetingChatJob)
        .filter(
            MeetingChatJob.meeting_id == meeting_id,
            MeetingChatJob.status == MeetingChatJobStatus.PROCESSING,
        )
        .first()
        is not None
    )


def create_message(
    db: Session,
    meeting_id: int,
    user_id: int,
    role: str,
    content: str,
    message_code: str | None = None,
) -> MeetingChatMessage:
    message = MeetingChatMessage(
        meeting_id=meeting_id,
        user_id=user_id,
        role=role,
        content=content,
        message_code=message_code,
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


def create_job(
    db: Session,
    meeting_id: int,
    user_id: int,
    user_message_id: int,
) -> MeetingChatJob:
    job = MeetingChatJob(
        meeting_id=meeting_id,
        user_id=user_id,
        user_message_id=user_message_id,
        status=MeetingChatJobStatus.PROCESSING,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def read_history(db: Session, meeting_id: int, user_id: int):
    assert_meeting_owner(db, meeting_id, user_id)
    messages = (
        db.query(MeetingChatMessage)
        .filter(MeetingChatMessage.meeting_id == meeting_id)
        .order_by(MeetingChatMessage.created_at.asc())
        .all()
    )
    return {
        "success": True,
        "messages": messages,
        "isProcessing": has_processing_job(db, meeting_id),
    }


def get_recent_history(
    db: Session, meeting_id: int, exclude_message_id: Optional[int] = None
) -> List[MeetingChatMessage]:
    query = (
        db.query(MeetingChatMessage)
        .filter(MeetingChatMessage.meeting_id == meeting_id)
        .order_by(MeetingChatMessage.created_at.desc())
    )
    if exclude_message_id:
        query = query.filter(MeetingChatMessage.id != exclude_message_id)
    messages = query.limit(8).all()
    messages.reverse()
    return messages


def build_context(db: Session, question: str, audio_ids: List[str]) -> Optional[str]:
    if not audio_ids:
        return None
    try:
        documents_list = chroma_collection.query(
            query_texts=[question],
            where={"audio_id": {"$in": audio_ids}},
            n_results=8,
        )
    except Exception:
        return None

    documents = documents_list.get("documents") or []
    metadatas = documents_list.get("metadatas") or []

    if not documents or not documents[0]:
        return None

    speaker_profile_ids = {
        int(meta["speaker_profile_id"])
        for meta in metadatas[0]
        if meta.get("speaker_profile_id")
    }

    employee_ids = {
        int(meta["employee_id"])
        for meta in metadatas[0]
        if meta.get("employee_id")
    }
    employee_ids.update(
        int(meta["speaker_id"]) for meta in metadatas[0] if meta.get("speaker_id")
    )

    speaker_profiles = (
        db.query(SpeakerProfile)
        .filter(SpeakerProfile.id.in_(speaker_profile_ids))
        .options(
            joinedload(SpeakerProfile.employee).joinedload(Employee.position)
        )
        .all()
    )

    speaker_map = {sp.id: sp for sp in speaker_profiles}

    employees = (
        db.query(Employee)
        .options(joinedload(Employee.position))
        .filter(Employee.id.in_(employee_ids))
        .all()
        if employee_ids
        else []
    )
    employee_map = {employee.id: employee for employee in employees}

    context_chunks = []
    for doc, metadata in zip(documents[0], metadatas[0]):
        prefix = "[Unknown Speaker]"

        sp_id = metadata.get("speaker_profile_id")
        speaker_profile = speaker_map.get(int(sp_id)) if sp_id else None

        if speaker_profile and speaker_profile.employee:
            employee_name = speaker_profile.employee.fullName
            position = (
                speaker_profile.employee.position.title
                if speaker_profile.employee.position
                else "Unknown Position"
            )
            prefix = f"[{employee_name} | {position}]"
        else:
            employee_id = metadata.get("employee_id") or metadata.get("speaker_id")
            employee = employee_map.get(int(employee_id)) if employee_id else None
            if employee:
                position = (
                    employee.position.title if employee.position else "Unknown Position"
                )
                prefix = f"[{employee.fullName} | {position}]"

        if prefix == "[Unknown Speaker]" and metadata.get("speaker_label"):
            prefix = f"[{metadata['speaker_label']}]"

        context_chunks.append(f"{prefix}:\n{doc}")
    print(context_chunks)
    return "\n\n".join(context_chunks)


async def call_llm(
    context: str,
    history: List[MeetingChatMessage],
    user_text: str,
) -> str:
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    if context:
        messages.append(
            {"role": "system", "content": f"Meeting context:\n{context}"}
        )

    for message in history:
        if message.role in {"user", "assistant"}:
            messages.append({"role": message.role, "content": message.content})

    messages.append({"role": "user", "content": user_text})

    loop = asyncio.get_running_loop()
    response = await loop.run_in_executor(
        None,
        lambda: client.chat.completions.create(
            model=settings.MODEL_ID,
            messages=messages,
            temperature=0.4,
            top_p=0.9,
        ),
    )
    content = response.choices[0].message.content if response else None
    return content.strip() if content else ""


async def process_chat_job(job_id: int, manager_key: str | None = None):
    db = SessionLocal()
    try:
        job = (
            db.query(MeetingChatJob)
            .filter(MeetingChatJob.id == job_id)
            .first()
        )
        if not job:
            return

        user_message = (
            db.query(MeetingChatMessage)
            .filter(MeetingChatMessage.id == job.user_message_id)
            .first()
        )
        if not user_message:
            return

        audio_ids = get_meeting_audio_ids(db, job.meeting_id)
        context = build_context(db, user_message.content, audio_ids)

        if not context:
            assistant_text = NO_INFO_MESSAGE
            assistant_message = create_message(
                db=db,
                meeting_id=job.meeting_id,
                user_id=job.user_id,
                role="assistant",
                content=assistant_text,
                message_code=NO_INFO_CODE,
            )
            job.assistant_message_id = assistant_message.id
            job.status = MeetingChatJobStatus.DONE
            job.error = None
            db.commit()
            if manager_key:
                await manager.send_personal_message(
                    manager_key,
                    {
                        "type": "assistant_message",
                        "text": assistant_text,
                        "code": NO_INFO_CODE,
                    },
                )
                await manager.send_personal_message(
                    manager_key, {"type": "status", "state": "idle"}
                )
            return

        history = get_recent_history(
            db, meeting_id=job.meeting_id, exclude_message_id=user_message.id
        )
        assistant_response = await call_llm(context, history, user_message.content)
        if not assistant_response:
            assistant_response = GENERIC_ERROR_MESSAGE
            code = PROCESSING_ERROR_CODE
        else:
            code = None

        assistant_message = create_message(
            db=db,
            meeting_id=job.meeting_id,
            user_id=job.user_id,
            role="assistant",
            content=assistant_response,
            message_code=code,
        )

        job.assistant_message_id = assistant_message.id
        job.status = MeetingChatJobStatus.DONE
        job.error = None
        db.commit()

        if manager_key:
            await manager.send_personal_message(
                manager_key,
                {
                    "type": "assistant_message",
                    "text": assistant_response,
                    "code": code,
                },
            )
            await manager.send_personal_message(
                manager_key, {"type": "status", "state": "idle"}
            )
    except Exception as e:
        job = (
            db.query(MeetingChatJob)
            .filter(MeetingChatJob.id == job_id)
            .first()
        )
        if job:
            job.status = MeetingChatJobStatus.FAILED
            job.error = str(e)
            db.commit()
        if manager_key:
            await manager.send_personal_message(
                manager_key,
                {"type": "error", "message": PROCESSING_ERROR_CODE},
            )
            await manager.send_personal_message(
                manager_key, {"type": "status", "state": "idle"}
            )
    finally:
        db.close()


def start_chat_job(
    db: Session, meeting_id: int, user_id: int, text: str
) -> MeetingChatJob:
    assert_meeting_owner(db, meeting_id, user_id)
    if has_processing_job(db, meeting_id):
        raise HTTPException(status_code=409, detail="Meeting chat is processing")

    user_message = create_message(
        db=db,
        meeting_id=meeting_id,
        user_id=user_id,
        role="user",
        content=text,
    )
    job = create_job(
        db=db,
        meeting_id=meeting_id,
        user_id=user_id,
        user_message_id=user_message.id,
    )
    return job
