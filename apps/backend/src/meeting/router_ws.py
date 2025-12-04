from fastapi import APIRouter, Query, WebSocket, Depends, WebSocketDisconnect
from src.ollama import service as ollama_service
import asyncio
from src.database import get_db
from src.audio import models as audio_models
from sqlalchemy.orm import Session
from src.meeting import models
from src.notification import service as notification_service

router = APIRouter()


@router.websocket("/generate-summary")
async def websocket_endpoint(
    websocket: WebSocket, meeting_id: str = Query(...), db: Session = Depends(get_db)
):
    await websocket.accept()

    await websocket.send_json({"type": "status", "message": "connection-opened"})

    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()

    if not meeting:
        await websocket.send_json({"error": "Meeting not found"})
        return

    audios = (
        db.query(audio_models.Audio)
        .filter(
            audio_models.Audio.meeting_id == meeting_id,
            audio_models.Audio.status == audio_models.AudioStatus.SUCCESS,
        )
        .all()
    )
    audio_ids = [str(audio.id) for audio in audios]

    await notification_service.create_notification(
        db=db,
        user_id=meeting.user_id,
        title="Generating Summary",
        message="We are summarizing the conversation. This may take a moment.",
        type="summary-generating",
        meeting_id=meeting_id,
    )
    summary_task = asyncio.create_task(
        ollama_service.generate_meeting_summary(websocket, audio_ids, meeting_id, db)
    )
    await asyncio.sleep(0)

    try:
        await summary_task
        await websocket.send_json({"type": "done", "status": "completed"})
        await notification_service.create_notification(
                db=db,
                user_id=meeting.user_id,
                title="Summary generated",
                message="We are generated the meeting conversation",
                type="summary-generated",
                meeting_id=meeting_id,
            )
    except WebSocketDisconnect:
        await notification_service.create_notification(
            db=db,
            user_id=meeting.user_id,
            title="Generating summary failed",
            message="Generating meeting summary failed, please try again",
            type="generate-summary-failed",
            meeting_id=meeting_id,
        )
        summary_task.cancel()
        try:
            await summary_task
        except asyncio.CancelledError:
            print("Summary task cancelled due to WebSocket disconnect")
        except Exception as e:
            print("Error during summary generation:", e)
            await websocket.send_json(
                {"type": "done", "status": "error", "message": str(e)}
            )
    finally:
        await websocket.close()

