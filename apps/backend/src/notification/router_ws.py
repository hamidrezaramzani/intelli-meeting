from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from src.websocket.websocket import manager
import asyncio

router = APIRouter()

@router.websocket("/{user_id}")
async def websocket_notifications(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        manager.disconnect(user_id)
