from fastapi import (
    HTTPException,
    Request,
)
from sqlalchemy.orm import Session
from src.auth import models as user_models
from src.auth import utils as user_utils
from datetime import datetime, timezone
def get_now_timestamp():
    now = datetime.datetime.now()
    return now.timestamp()

def get_user_id(request: Request, db: Session):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=403, detail="Invalid auth header")
    token = auth_header.split(" ")[1]
    payload = user_utils.decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=403, detail="Invalid or expired token")
    user_email = payload.get("sub")
    if not user_email:
        raise HTTPException(status_code=403, detail="Email not found in token")

    user = (
        db.query(user_models.User).filter(user_models.User.email == user_email).first()
    )

    return user.id

def time_ago(dt: datetime) -> str:
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)

    now = datetime.now(timezone.utc)
    diff = now - dt
    seconds = diff.total_seconds()

    if seconds < 60:
        return f"{int(seconds)} secs ago"
    elif seconds < 3600:
        mins = int(seconds // 60)
        return f"{mins} mins ago"
    elif seconds < 86400:
        hours = int(seconds // 3600)
        return f"{hours} hours ago"
    else:
        days = int(seconds // 86400)
        return f"{days} days ago"