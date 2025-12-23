from . import schemas, service
from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session
from src.database import get_db
from . import schemas, service
from src.meeting_summary import service as meeting_summary_service
from src import utils
router = APIRouter()


@router.post("/", response_model=schemas.CreateMeetingResponse)
async def create_meeting(
    request: Request,
    body: schemas.MeetingBody, db: Session = Depends(get_db)
):
    user_id = utils.get_user_id(request, db)
    service.create_meeting(db, body, user_id)
    return {
        "success": True,
    }

@router.get("/candidates", response_model=schemas.ReadMeetingCandidatesResponse)
def read_meeting_candidates(
    request: Request,
    db: Session = Depends(get_db),
):
    return service.read_meeting_candidates(db, request)


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
async def read_meeting_summaries(
    meeting_id,
    db: Session = Depends(get_db),
):
    return await meeting_summary_service.read_meeting_summaries(db=db,  meeting_id=meeting_id)


@router.get("/{meeting_id}", response_model=schemas.ReadOneMeetingResponse)
def read_one_meeting(
    meeting_id,
    db: Session = Depends(get_db),
):
    return service.read_meeting(db, meeting_id)



@router.put("/{meeting_id}", response_model=schemas.UpdateMeetingResponse)
async def create_meeting(
    meeting_id,
    body: schemas.MeetingBody, db: Session = Depends(get_db)
):
    return service.update_meeting(db, body, meeting_id)
    

@router.delete("/{meeting_id}", response_model=schemas.DeleteMeetingResponse)
async def delete_meeting(
    meeting_id,
    db: Session = Depends(get_db)
):
    return service.delete_meeting(db, meeting_id)
    