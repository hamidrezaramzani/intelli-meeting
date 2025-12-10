from sqlalchemy.orm import Session
from src.notification import models
from src.websocket.websocket import manager
import asyncio
from src import utils


async def create_notification(
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
    
    asyncio.create_task(manager.send_personal_message(f"{user_id}:notification", {
        "id": notification.id,
        "title": title,
        "message": message,
        "type": type,
        "timeAgo": "now"
    }))
    return notification



def read_notifications(db: Session, request, skip: int, limit: int):
    user_id = utils.get_user_id(request, db)
    
    total = db.query(models.Notification).filter(models.Notification.user_id == user_id).count()
    
    notifications = (
        db.query(models.Notification)
        .filter(models.Notification.user_id == user_id)
        .order_by(models.Notification.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    notifications = [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "timeAgo": utils.time_ago(n.created_at),
            "isRead": n.is_read
        }
        for n in notifications
    ]
    return {
        "success": True,
        "notifications": notifications,
        "total": total,
        "page": (skip // limit) + 1,
        "limit": limit,
    }


def read_dashboard_notifications(db: Session, request, limit = "5"):
    user_id = utils.get_user_id(request, db)
    
    notifications = (
        db.query(models.Notification)
        .filter(models.Notification.user_id == user_id, models.Notification.is_read == False)
        .order_by(models.Notification.created_at.desc())
        .limit(limit)
        .all()
    )
    
    notifications = [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "timeAgo": utils.time_ago(n.created_at)
        }
        for n in notifications
    ]
    return {
        "success": True,
        "notifications": notifications
    }

def marks_all_as_read(db: Session, request):
    user_id = utils.get_user_id(request, db)
    notifications = db.query(models.Notification).filter(
        models.Notification.user_id == user_id,
        models.Notification.is_read == False
    ).all()

    for n in notifications:
        n.is_read = True

    db.commit()

    return {"success": True}