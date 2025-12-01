from sqlalchemy.orm import Session, joinedload
from .models import (
    MeetingSummaryModel, SummaryModel, KeyPointModel,
    DecisionModel, ActionItemModel
)


def create_meeting_summuries(db: Session, meeting_id: str, section_type: str, data):
    meeting = db.query(MeetingSummaryModel).filter(MeetingSummaryModel.meeting_id == meeting_id).first()

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
            db.add(DecisionModel(
                description=d["description"],
                decided_by=d.get("decided_by"),
                meeting_id=meeting.meeting_id
            ))
        db.commit()

    elif section_type == "actions" and "actions" in data:
        for a in meeting.actions:
            db.delete(a)
        db.commit()

        for a in data["actions"]:
            db.add(ActionItemModel(
                description=a["description"],
                owner=a.get("owner"),
                deadline=a.get("deadline"),
                meeting_id=meeting.meeting_id
            ))
        db.commit()

    return {"success": True, "meeting_id": meeting_id, "section": section_type}


def read_meeting_summaries(db: Session, meeting_id: str):
    meeting = (
        db.query(MeetingSummaryModel)
        .options(
            joinedload(MeetingSummaryModel.summary)
            .joinedload(SummaryModel.key_points),
            joinedload(MeetingSummaryModel.decisions),
            joinedload(MeetingSummaryModel.actions)
        )
        .filter(MeetingSummaryModel.id == meeting_id)
        .first()
    )

    if not meeting:
        return { "data": { "empty": True}, "success": False }

    summary_data = None
    if meeting.summary:
        summary_data = {
            "summary": meeting.summary.summary,
            "key_points": [kp.text for kp in meeting.summary.key_points] if meeting.summary.key_points else []
        }

    decisions_data = [
        {"description": d.description, "decided_by": d.decided_by}
        for d in meeting.decisions
    ] if meeting.decisions else []

    actions_data = [
        {"description": a.description, "owner": a.owner, "deadline": a.deadline}
        for a in meeting.actions
    ] if meeting.actions else []

    return { 
        "success": True,
        "data": {
            "summary": summary_data,
            "decisions": decisions_data,
            "actions": actions_data
        }}
    

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

    db.query(MeetingSummaryModel).filter(MeetingSummaryModel.meeting_id == meeting_id).delete()

    db.commit()

