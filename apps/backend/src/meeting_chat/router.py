from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from src import utils
from src.database import get_db
from src.meeting_chat import schemas, service

router = APIRouter()


@router.get(
    "/{meeting_id}/chat/history", response_model=schemas.ChatHistoryResponse
)
def read_chat_history(
    meeting_id: int, request: Request, db: Session = Depends(get_db)
):
    user_id = utils.get_user_id(request, db)
    history = service.read_history(db, meeting_id, user_id)
    return history
