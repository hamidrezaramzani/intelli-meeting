from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from fastapi import Request
from . import models, schemas
from src.employee import models as employee_models
from src.audio import models as audio_models
from src.speaker_profile import models as speaker_profile_models
from src.notification import models as notification_models
from src.meeting_summary import models as meeting_summary_models
import os
from src import utils
from sqlalchemy import delete, select

def create_meeting(db: Session, body: schemas.MeetingBody, user_id):
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


def read_meeting_candidates(db: Session, request: Request):
    user_id = utils.get_user_id(request, db)
    meetings = db.query(models.Meeting).filter(models.Meeting.user_id == user_id).all()
    return {
        "success": True,
        "meetings": meetings,
    }


def read_meeting(db: Session, meeting_id,):
    meeting = (
        db.query(models.Meeting)
        .options(
            # Load audios with speaker profiles and their employees
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
            ),
            # Also load employees directly related to the meeting
            joinedload(models.Meeting.employees).load_only(
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


def update_meeting(db: Session, body: schemas.MeetingBody, meeting_id):
    meeting = (
        db.query(models.Meeting)
        .filter(models.Meeting.id == meeting_id)
        .first()
    )

    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")


    meeting.title = body.title
    meeting.description = body.description
    meeting.date = body.date
    meeting.start_time = body.startTime
    meeting.end_time = body.endTime
    meeting.meeting_link = body.meetingLink

    if body.employees:
        employees = (
            db.query(employee_models.Employee)
            .filter(employee_models.Employee.id.in_(body.employees))
            .all()
        )
        meeting.employees = employees

    db.commit()
    return { "success": True }



def delete_meeting(db: Session, meeting_id: int):
    with db.begin():

        db.execute(
            delete(notification_models.Notification)
            .where(notification_models.Notification.meeting_id == meeting_id)
        )

        audio_ids = db.scalars(
            select(audio_models.Audio.id)
            .where(audio_models.Audio.meeting_id == meeting_id)
        ).all()

        if audio_ids:
            db.execute(
                delete(speaker_profile_models.SpeakerProfile)
                .where(speaker_profile_models.SpeakerProfile.audio_id.in_(audio_ids))
            )

            db.execute(
                delete(notification_models.Notification)
                .where(notification_models.Notification.audio_id.in_(audio_ids))
            )

            db.execute(
                delete(audio_models.Audio)
                .where(audio_models.Audio.id.in_(audio_ids))
            )

        summary_id = db.scalar(
            select(meeting_summary_models.MeetingSummaryModel.id)
            .where(meeting_summary_models.MeetingSummaryModel.meeting_id == meeting_id)
        )

        if summary_id:
            summary_text_id = db.scalar(
                select(meeting_summary_models.SummaryModel.id)
                .where(meeting_summary_models.SummaryModel.meeting_id == summary_id)
            )

            if summary_text_id:
                db.execute(
                    delete(meeting_summary_models.KeyPointModel)
                    .where(meeting_summary_models.KeyPointModel.summary_id == summary_text_id)
                )

                db.execute(
                    delete(meeting_summary_models.SummaryModel)
                    .where(meeting_summary_models.SummaryModel.id == summary_text_id)
                )

            db.execute(
                delete(meeting_summary_models.DecisionModel)
                .where(meeting_summary_models.DecisionModel.meeting_id == summary_id)
            )

            db.execute(
                delete(meeting_summary_models.ActionItemModel)
                .where(meeting_summary_models.ActionItemModel.meeting_id == summary_id)
            )

            db.execute(
                delete(meeting_summary_models.MeetingSummaryModel)
                .where(meeting_summary_models.MeetingSummaryModel.id == summary_id)
            )

        db.execute(
            delete(models.meeting_employee)
            .where(models.meeting_employee.c.meeting_id == meeting_id)
        )

        db.execute(
            delete(models.Meeting)
            .where(models.Meeting.id == meeting_id)
        )
    return { "success": True }