from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from src.database import get_db
from src.dashboard import service
router = APIRouter()


@router.get("/statistics")
async def read_dashboard_statistics(request: Request, db: Session = Depends(get_db)):
    return service.read_dashboard_statistics(db, request)


@router.get("/meeting-schedules/{candidate_date}")
async def get_dashboard_schedules(
    request: Request,
    candidate_date: str = "",
    db: Session = Depends(get_db)
):
    return service.read_dashboard_meeting_schedules(db, request, candidate_date)


@router.get("/top-employees")
async def get_dashboard_top_employees(request: Request, db: Session = Depends(get_db)):
    return service.read_dashboard_top_players(db, request)


@router.get("/timeline")
async def get_dashboard_timeline(request: Request, db: Session = Depends(get_db)):
    return service.read_dashboard_timeline(db, request)
