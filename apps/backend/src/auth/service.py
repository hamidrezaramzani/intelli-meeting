from . import schemas, models, utils
from src import utils as main_utils
from sqlalchemy.orm import Session
from src.notification import service as notification_service
from fastapi import Request, HTTPException


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = utils.hash_password(user.password)
    db_user = models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password=hashed_password,
        bio=user.bio
    )
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
        title="Login Successful",
        message="You have logged in successfully",
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


def read_user_profile(db: Session, request: Request):
    user_id = main_utils.get_user_id(request, db)
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if user == None:
        raise HTTPException(status_code=500, detail=str("User not found"))

    return {
        "success": True, 
        "user": {
            "id": user.id, 
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "bio": user.bio
        }
    }


def update_user_profile(db: Session, request: Request, profile_update: schemas.ProfileUpdate):
    user_id = main_utils.get_user_id(request, db)
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if user == None:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if email is being updated and if it's unique
    if profile_update.email and profile_update.email != user.email:
        if not check_is_email_unique(db, profile_update.email):
            raise HTTPException(status_code=400, detail="Email already exists")

    # Update fields that are provided
    update_data = profile_update.dict(exclude_unset=True)
    
    # Hash password if it's being updated
    if 'password' in update_data:
        update_data['password'] = utils.hash_password(update_data['password'])

    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "bio": user.bio
        },
        "message": "Profile updated successfully"
    }
