
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

@router.get("/", response_model=schemas.ReadManyMeetingsResponse)
def read_meetings(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    skip = (page - 1) * limit
    return service.get_meetings(db=db, skip=skip, limit=limit)