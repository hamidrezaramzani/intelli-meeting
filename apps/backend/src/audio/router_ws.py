from fastapi import APIRouter, Query, WebSocket, Depends, WebSocketDisconnect
import asyncio
from src.database import get_db
from sqlalchemy.orm import Session
from src.redis.redis import redis_client
from src.audio import service, models
from src.meeting import models as meeting_models
import json

router = APIRouter()

@router.websocket("/process-audio")
async def process_audio_ws(
    websocket: WebSocket,
    audio_id: str = Query(...),
    reconnect: str = Query(...),
    db: Session = Depends(get_db)
):
    await websocket.accept()
    
    print("CALLED AGAIN", audio_id)

    if reconnect == "false" and not audio_id:
        raise "Audio id is required for start audio processing"
    
    audio = db.query(models.Audio).filter(models.Audio.id == audio_id).first()
    

    if not audio:
        raise "Audio not found"
    
    meeting = db.query(meeting_models.Meeting).filter(meeting_models.Meeting.id == audio.meeting_id).first()
    
    if not meeting:
        raise "Meeting not found"
    
    user_id = meeting.user_id
    
    key = f"user-audio-processing:{audio_id}"

    pubsub = redis_client.pubsub()
    await pubsub.subscribe(key)

    if reconnect == "false":
        asyncio.create_task(service.process_audio_to_text(db, audio_id, user_id, key))


    try:
        while True:
            async for message in pubsub.listen():
                if message['type'] == 'message':
                    data = json.loads(message['data'])
                    await websocket.send_json(data)
            await asyncio.sleep(0.01)
    except Exception as e:
        print("WebSocket disconnected, unsubscribed from Redis", e)
    finally:
        await pubsub.unsubscribe(key)
        await pubsub.close()