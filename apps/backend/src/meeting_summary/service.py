from fastapi import Request
from sqlalchemy.orm import Session, joinedload
from .models import (
    MeetingSummaryModel,
    SummaryModel,
    KeyPointModel,
    DecisionModel,
    ActionItemModel,
)
from src.meeting.models import Meeting


def create_meeting_summaries(db: Session, meeting_id: str, section_type: str, data):
    meeting = (
        db.query(MeetingSummaryModel)
        .filter(MeetingSummaryModel.meeting_id == meeting_id)
        .first()
    )

    if not meeting:
        meeting = MeetingSummaryModel(id=meeting_id, meeting_id=meeting_id)
        db.add(meeting)
        db.commit()
        db.refresh(meeting)

    if section_type == "summary" and "summary" in data:
        if meeting.summary:
            db.delete(meeting.summary)
            db.commit()

        s = data["summary"]["summary"]
        sm = SummaryModel(summary=s, meeting_id=meeting.meeting_id)
        db.add(sm)
        db.commit()
        db.refresh(sm)

        for point in data["summary"].get("key_points", []):
            if point.strip() and point != ",":
                db.add(KeyPointModel(text=point, summary=sm))
        db.commit()

    elif section_type == "decisions" and "decisions" in data:
        for d in meeting.decisions:
            db.delete(d)
        db.commit()

        for d in data["decisions"]:
            db.add(
                DecisionModel(
                    description=d["description"],
                    decided_by=d.get("decided_by"),
                    meeting_id=meeting.meeting_id,
                )
            )
        db.commit()

    elif section_type == "actions" and "actions" in data:
        for a in meeting.actions:
            db.delete(a)
        db.commit()

        for a in data["actions"]:
            db.add(
                ActionItemModel(
                    description=a["description"],
                    owner=a.get("owner"),
                    deadline=a.get("deadline"),
                    meeting_id=meeting.meeting_id,
                )
            )
        db.commit()

    return {"success": True, "meeting_id": meeting_id, "section": section_type}


async def read_meeting_summaries(db: Session,  meeting_id: str):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()

    if not meeting:
        return {"data": {"empty": True}, "success": True}

    meeting_summaries = (
        db.query(MeetingSummaryModel)
        .options(
            joinedload(MeetingSummaryModel.summary).joinedload(SummaryModel.key_points),
            joinedload(MeetingSummaryModel.decisions),
            joinedload(MeetingSummaryModel.actions),
        )
        .filter(MeetingSummaryModel.id == meeting_id)
        .first()
    )
    
    is_generating = meeting.is_generating
    
    if meeting_summaries == None and not is_generating:
        return {"data": {"empty": True}, "success": True}

    summary_data = None
    if meeting_summaries and meeting_summaries.summary:
        summary_data = {
            "summary": meeting_summaries.summary.summary,
            "key_points": [kp.text for kp in meeting_summaries.summary.key_points]
            if meeting_summaries.summary.key_points
            else [],
        }
        
    decisions_data = None
    if meeting_summaries and meeting_summaries.decisions:
        decisions_data = (
            [
                {"description": d.description, "decided_by": d.decided_by}
                for d in meeting_summaries.decisions
            ]
            if meeting_summaries.decisions
            else []
        )
        
    actions_data = None
    if meeting_summaries and meeting_summaries.actions:
        actions_data = (
            [
                {"description": a.description, "owner": a.owner, "deadline": a.deadline}
                for a in meeting_summaries.actions
            ]
            if meeting_summaries.actions
            else []
        )

    if is_generating:
        return {
            "data": {
                "isGenerating": True,
                "summary": summary_data,
                "decisions": decisions_data,
                "actions": actions_data,
            },
            "success": True,
        }

    return {
        "success": True,
        "data": {
            "summary": summary_data,
            "decisions": decisions_data,
            "actions": actions_data,
        },
    }


async def delete_all_summaries(db: Session, meeting_id: int):
    meeting_summary = (
        db.query(MeetingSummaryModel)
        .filter(MeetingSummaryModel.meeting_id == meeting_id)
        .first()
    )

    if not meeting_summary:
        return

    summary = meeting_summary.summary
    if summary:
        db.query(KeyPointModel).filter(KeyPointModel.summary_id == summary.id).delete()
        db.query(SummaryModel).filter(SummaryModel.id == summary.id).delete()

    db.query(DecisionModel).filter(DecisionModel.meeting_id == meeting_id).delete()
    db.query(ActionItemModel).filter(ActionItemModel.meeting_id == meeting_id).delete()

    db.query(MeetingSummaryModel).filter(
        MeetingSummaryModel.meeting_id == meeting_id
    ).delete()

    db.commit()
