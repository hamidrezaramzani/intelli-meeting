from sqlalchemy.orm import Session, joinedload
from . import models, schemas
from src.employee import models as employee_models
from src.audio import models as audio_models
from src.speaker_profile import models as speaker_profile_models
from src.ollama import service as ollama_service


def create_meeting(db: Session, body: schemas.CreateMeetingBody, user_id):
    meeting = models.Meeting(
        title=body.title,
        description=body.description,
        date=body.date,
        start_time=body.startTime,
        end_time=body.endTime,
        meeting_link=body.meetingLink,
        user_id=user_id
    )
    if body.employees:
        employees = (
            db.query(employee_models.Employee)
            .filter(employee_models.Employee.id.in_(body.employees))
            .all()
        )
        meeting.employees = employees
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting


def read_meetings(db: Session, skip: int = 0, limit: int = 10):
    total = db.query(models.Meeting).count()
    meetings = (
        db.query(models.Meeting)
        .options(joinedload(models.Meeting.employees))
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


def read_meeting_candidates(db: Session):
    meetings = db.query(models.Meeting).all()
    return {
        "success": True,
        "meetings": meetings,
    }


def read_meeting(db: Session, meeting_id):
    meeting = (
        db.query(models.Meeting)
        .options(
            joinedload(models.Meeting.audios)
            .joinedload(audio_models.Audio.speaker_profiles)
            .load_only(
                speaker_profile_models.SpeakerProfile.id,
                speaker_profile_models.SpeakerProfile.initial_speaker_label,
                speaker_profile_models.SpeakerProfile.audio_id,
                speaker_profile_models.SpeakerProfile.text,
            )
            .joinedload(speaker_profile_models.SpeakerProfile.employee)
            .load_only(
                employee_models.Employee.id,
                employee_models.Employee.fullName,
            )
        )
        .filter(models.Meeting.id == meeting_id)
        .first()
    )

    if not meeting:
        return {"error": "Meeting not found"}

    return {
        "success": True,
        "meeting": meeting,
    }


def generate_meeting_summary(db: Session, meeting_id: int):
    try:
        meeting = (
            db.query(models.Meeting).filter(models.Meeting.id == meeting_id).first()
        )
        if not meeting:
            return {"error": "Meeting not found"}

        audios = (
            db.query(audio_models.Audio)
            .filter(
                audio_models.Audio.meeting_id == meeting_id,
                audio_models.Audio.status == audio_models.AudioStatus.SUCCESS,
            )
            .all()
        )

        return ollama_service.generate_meeting_summary(audios)
    except Exception as e:
        print(e)
        return {"success": False}
