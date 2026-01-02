import asyncio
import json

from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from src.database import get_db
from src.meeting_chat import service
from src.websocket.websocket import manager

router = APIRouter()


@router.websocket("/{meeting_id}/chat")
async def meeting_chat_ws(
    websocket: WebSocket,
    meeting_id: int,
    token: str = Query(...),
    db: Session = Depends(get_db),
):
    key = None
    try:
        user = service.get_user_by_token(db, token)
        service.assert_meeting_owner(db, meeting_id, user.id)
    except HTTPException as exc:
        await websocket.accept()
        await websocket.send_json(
            {
                "type": "error",
                "message": "permission_denied"
                if exc.status_code == 403
                else "unauthorized",
            }
        )
        await websocket.close(code=4401)
        return

    try:
        key = f"{user.id}:meeting-chat:{meeting_id}"
        await manager.connect(websocket, key)

        if service.has_processing_job(db, meeting_id):
            await manager.send_personal_message(
                key, {"type": "status", "state": "processing"}
            )

        while True:
            raw_message = await websocket.receive_text()
            try:
                payload = json.loads(raw_message)
            except json.JSONDecodeError:
                await websocket.send_json(
                    {"type": "error", "message": "invalid_payload"}
                )
                continue

            if payload.get("type") != "user_message":
                await websocket.send_json(
                    {"type": "error", "message": "unsupported_message"}
                )
                continue

            text = (payload.get("text") or "").strip()
            if not text:
                await websocket.send_json(
                    {"type": "error", "message": "empty_message"}
                )
                continue

            if service.has_processing_job(db, meeting_id):
                await websocket.send_json(
                    {"type": "status", "state": "processing"}
                )
                continue

            job = service.start_chat_job(
                db=db, meeting_id=meeting_id, user_id=user.id, text=text
            )
            await websocket.send_json(
                {"type": "status", "state": "processing"}
            )
            asyncio.create_task(
                service.process_chat_job(job_id=job.id, manager_key=key)
            )

    except WebSocketDisconnect:
        if key:
            manager.disconnect(key)
    except Exception:
        if key:
            await manager.send_personal_message(
                key, {"type": "error", "message": "permission_denied"}
            )
    finally:
        if key:
            manager.disconnect(key)
