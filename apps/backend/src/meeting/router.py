
from . import schemas, service
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from src.database import get_db
from . import schemas, service

router = APIRouter()
@router.post("/", response_model=schemas.CreateMeetingResponse)
async def create_meeting(
    body: schemas.CreateMeetingBody,
    db: Session = Depends(get_db)
): 
    service.create_meeting(db, body)
    return {
        "success": True,
    }

@router.get("/", response_model=schemas.ReadMeetingCandidatesResponse)
def read_meeting_candidates(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    skip = (page - 1) * limit
    return service.get_meetings(db=db, skip=skip, limit=limit)


@router.get("/candidates", response_model=schemas.ReadMeetingCandidatesResponse)
def read_meeting_candidates(
    db: Session = Depends(get_db),
):
    return service.get_meeting_candidates(db=db)

@router.get("/start-audio-transcript-processing/{meeting_id}", response_model=schemas.ConvertTranscriptToSummary)
def read_meeting_candidates(
    meeting_id,
    db: Session = Depends(get_db),
):
    return service.start_transcript_processing(db=db, meeting_id=meeting_id)