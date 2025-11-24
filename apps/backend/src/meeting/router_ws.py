from fastapi import APIRouter, Query, WebSocket, Depends, WebSocketDisconnect
from src.ollama import service as ollama_service
import asyncio
from src.database import get_db
from src.audio import models as audio_models
from sqlalchemy.orm import Session
from src.meeting import models

router = APIRouter()

@router.websocket("/generate-summary")
async def websocket_endpoint(websocket: WebSocket, meeting_id: str = Query(...), db: Session = Depends(get_db)):
    await websocket.accept()

    await websocket.send_json({"type": "status", "message": "connection-opened"})

    meeting = (
        db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    )
    
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

    asyncio.create_task(ollama_service.generate_meeting_summary(websocket, audio_ids))
    await asyncio.sleep(0)

    try:
        while True:
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        print("WebSocket disconnected")
