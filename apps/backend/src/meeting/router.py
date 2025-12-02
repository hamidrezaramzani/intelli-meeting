from . import schemas, service
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from src.database import get_db
from . import schemas, service
from src.meeting_summary import service as meeting_summary_service

router = APIRouter()


@router.post("/", response_model=schemas.CreateMeetingResponse)
async def create_meeting(
    body: schemas.CreateMeetingBody, db: Session = Depends(get_db)
):
    service.create_meeting(db, body)
    return {
        "success": True,
    }


@router.get("/", response_model=schemas.ReadManyMeetingsResponse)
def read_many_meetings(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    skip = (page - 1) * limit
    return service.read_meetings(db=db, skip=skip, limit=limit)


@router.get(
    "/summaries/{meeting_id}", response_model=schemas.ReadMeetingSummaryResponse
)
def read_meeting_summaries(
    meeting_id,
    db: Session = Depends(get_db),
):
    return meeting_summary_service.read_meeting_summaries(db=db, meeting_id=meeting_id)


@router.get("/{meeting_id}", response_model=schemas.ReadOneMeetingResponse)
def read_one_meeting(
    meeting_id,
    db: Session = Depends(get_db),
):
    return service.read_meeting(db, meeting_id)


@router.get("/candidates", response_model=schemas.ReadMeetingCandidatesResponse)
def read_meeting_candidates(
    db: Session = Depends(get_db),
):
    return service.read_meeting_candidates(db=db)
