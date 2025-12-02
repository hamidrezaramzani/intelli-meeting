from sqlalchemy.orm import Session
from src.notification import models


def create_notification(
    db: Session,
    user_id: str,
    title: str,
    message: str,
    type: str,
    logged_by_id: str | None = None,
    meeting_id: str | None = None,
    audio_id: str | None = None,
):
    notification = models.Notification(
        title=title,
        message=message,
        user_id=user_id,
        type=type,
        logged_by_id=logged_by_id,
        meeting_id=meeting_id,
        audio_id=audio_id,
    )
    db.add(notification)
    db.commit()

    db.refresh(notification)

    return notification
