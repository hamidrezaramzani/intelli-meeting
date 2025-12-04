from . import schemas, models, utils
from sqlalchemy.orm import Session
from src.notification import service as notification_service


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = utils.hash_password(user.password)
    db_user = models.User(name=user.name, email=user.email, password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


async def authenticate_user(db: Session, email: str, password: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        return False
    if not utils.verify_password(password, user.password):
        return False

    await notification_service.create_notification(
        db=db,
        user_id=user.id,
        title="Welcome Back!",
        message="You have successfully logged into your account",
        type="user-login",
        logged_by_id=user.id,
    )

    return {"user": user, "token": utils.create_access_token(data={"sub": user.email})}


def check_is_email_unique(db: Session, email: str):
    existing_user = db.query(models.User).filter(models.User.email == email).first()
    if existing_user:
        return False
    else:
        return True
