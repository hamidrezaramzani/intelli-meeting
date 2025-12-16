from fastapi import APIRouter, Query, WebSocket, Depends, WebSocketDisconnect
from src.llm import service as llm_service
import asyncio
from src.database import get_db
from src.audio import models as audio_models
from sqlalchemy.orm import Session
from src.meeting import models
from src.websocket.websocket import manager
from src.redis.redis import redis_client
import json

router = APIRouter()


@router.websocket("/generate-summary")
async def websocket_endpoint(
    websocket: WebSocket,
    meeting_id: str = Query(...),
    reconnect: str = Query(...),
    db: Session = Depends(get_db)
):
    await websocket.accept()
    meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
    user_id = meeting.user_id
    key = f"{user_id}:generate-summary:{meeting_id}"
    
    pubsub = redis_client.pubsub()
    await pubsub.subscribe(key)

    if reconnect == "false":
        audios = (
            db.query(audio_models.Audio)
            .filter(
                audio_models.Audio.meeting_id == meeting_id,
                audio_models.Audio.status == audio_models.AudioStatus.SUCCESS,
            )
            .all()
        )
        audio_ids = [str(audio.id) for audio in audios]
        asyncio.create_task(
            llm_service.generate_meeting_summary(key, user_id ,audio_ids, meeting_id)
        )
        
    try:
        while True:
            message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=0.01)
            if message:
                if message['type'] == 'message':
                    data = json.loads(message['data'])
                    await websocket.send_json(data)
            await asyncio.sleep(0.01)
    except WebSocketDisconnect:
        print("WebSocket disconnected, unsubscribed from Redis")
    finally:
        await pubsub.unsubscribe(key)        
        await pubsub.close()