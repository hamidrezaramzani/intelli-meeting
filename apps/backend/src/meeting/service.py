import os
from sqlalchemy.orm import Session
from . import models, schemas


def create_meeting(db: Session, body: schemas.CreateMeetingBody):
    meeting = models.Meeting(
    title = body.title,
    description = body.description,
    date = body.date,
    start_time = body.startTime,
    end_time = body.endTime,
    meeting_link = body.meetingLink,
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting

def get_meetings(db: Session, skip: int = 0, limit: int = 10):
    total = db.query(models.Meeting).count()
    meetings = (
        db.query(models.Meeting)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return {
        "success": True,
        "total": total,
        "page": (skip // limit) + 1,
        "limit": limit,
        "meetings": meetings,
    }