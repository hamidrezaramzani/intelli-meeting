import os
from sqlalchemy.orm import Session
from . import models, schemas
from typing import Dict



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
        .order_by(models.Meeting.id.desc())
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

def get_meeting_candidates(db: Session):
    meetings = (
        db.query(models.Meeting)
        .all()
    )
    return {
        "success": True,
        "meetings": meetings,
    }

def start_transcript_processing(db: Session, meeting_id: int) -> Dict:
    try:
        meeting = db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
        if not meeting:
            return {"error": "Meeting not found"}

        transcript = ""
        audios = getattr(meeting, "audios", [])
        for audio in audios:
            transcript += getattr(audio, "transcript", "") + "\n"

        meeting_info = {
            "title": getattr(meeting, "title", "Unknown Meeting"),
            "date": getattr(meeting, "date", "Unknown Date"),
            "participants": [p.name for p in getattr(meeting, "participants", [])]
        }

        prompt = f"""
        You are an AI meeting assistant. 
        Meeting information:
        Title: {meeting_info['title']}
        Date: {meeting_info['date']}
        
        Transcript:
        {transcript}
        
        Please provide:
        1. A concise summary of the meeting
        2. Decisions made
        3. Action items for participants
        """
        return { "success": True }
    except Exception as e:
        print(e)
        return { "success": False}