from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from src.database import get_db
from . import service
router = APIRouter()


@router.get("/")
async def read_notifications(
    request: Request,
    db: Session = Depends(get_db)
):
    return service.read_notifications(db, request)


@router.patch("/marks-all-as-read")
async def read_notifications(
    request: Request,
    db: Session = Depends(get_db)
):
    return service.marks_all_as_read(db, request)