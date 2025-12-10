from fastapi import APIRouter, Depends, Request, Query
from sqlalchemy.orm import Session
from src.database import get_db
from . import service
router = APIRouter()



@router.get("/")
async def read_notifications(
    request: Request,
    limit: int = Query(...),
    page: int = Query(...),
    db: Session = Depends(get_db)
):
    skip = (page - 1) * limit
    return service.read_notifications(db, request, skip, limit)



@router.get("/dashboard")
async def read_dashboard_notifications(
    request: Request,
    limit: int = Query(...),
    db: Session = Depends(get_db)
):
    return service.read_dashboard_notifications(db, request, limit)


@router.patch("/marks-all-as-read")
async def marks_all_as_read(
    request: Request,
    db: Session = Depends(get_db)
):
    return service.marks_all_as_read(db, request)