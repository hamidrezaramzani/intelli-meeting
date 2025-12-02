from fastapi import Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from src.meeting.models import Meeting
from src.speaker_profile.models import SpeakerProfile
from datetime import datetime, date, timezone, time
from src.audio.models import Audio
from src.employee.models import Employee
from src.notification.models import Notification
from src import utils


def read_dashboard_statistics(db: Session, request: Request):
    user_id = utils.get_user_id(request, db)
    all_meetings_count = db.query(Meeting).filter(Meeting.user_id == user_id).count()
    processed_audios_count = db.query(Audio).filter(Audio.status == "SUCCESS").count()
    
    future_meetings_count = db.query(Meeting).filter(
            Meeting.date > datetime.utcnow(),
            Meeting.user_id == user_id
        ).count()


    return { 
            "allMeetingsCount": str(all_meetings_count),
            "processedAudiosCount": str(processed_audios_count),
            "futureMeetingsCount": str(future_meetings_count),
            }
    
def read_dashboard_meeting_schedules(
    db: Session, request: Request, candidate_date: str
):
    user_id = utils.get_user_id(request, db)
    if candidate_date.endswith("Z"):
        candidate_date = candidate_date[:-1]

    dt = datetime.fromisoformat(candidate_date)
    candidate_date_obj = dt.date() 
    
    meetings = db.query(Meeting).filter(
        Meeting.user_id == user_id,
        Meeting.date == candidate_date_obj
    ).all()
    
    response = [
        {
            "id": meeting.id,
            "title": meeting.title,
            "date": meeting.date.isoformat(),
            "startTime": meeting.start_time,
            "endTime": meeting.end_time,
        }
        for meeting in meetings
    ]
    
    return response

def read_dashboard_top_players(db: Session, request: Request):
    user_id = utils.get_user_id(request, db)

    top_employees = (
        db.query(
            SpeakerProfile.employee_id,
            (func.sum(SpeakerProfile.start) + func.sum(SpeakerProfile.end)).label("total_time")
        )
        .join(Employee, Employee.id == SpeakerProfile.employee_id)
        .filter(SpeakerProfile.user_id == user_id) 
        .group_by(SpeakerProfile.employee_id)
        .order_by((func.sum(SpeakerProfile.start) + func.sum(SpeakerProfile.end)).desc())
        .limit(3)
        .all()
    )
    response = []
    for employee_id, total_time in top_employees:
        employee = db.query(Employee).filter(Employee.id == employee_id).first()
        response.append({
            "id": employee_id,
            "employeeName": employee.fullName if employee else None,
            "totalTime": total_time,
            "position": employee.position
        })

    return response

def read_dashboard_timeline(db: Session, request: Request):
    user_id = utils.get_user_id(request, db)

    today = datetime.utcnow().date()
    start_date = datetime.combine(today, datetime.min.time())
    end_date = datetime.combine(today, datetime.max.time())  
    notifications = (
        db.query(Notification)
        .filter(
            Notification.user_id == user_id,
            Notification.created_at >= start_date,
            Notification.created_at <= end_date,
        )
        .order_by(Notification.created_at.desc())
        .limit(10)
        .all()
    )

    response = [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "timeAgo": utils.time_ago(n.created_at)
        }
        for n in notifications
    ]

    return response