from sqlalchemy.orm import Session
from . import models, schemas, utilities
import os

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = utilities.hash_password(user.password)
    db_user = models.User(
        name=user.name, email=user.email, password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        return False
    if not utilities.verify_password(password, user.password):
        return False
    return {"user": user, "token": utilities.create_access_token(data={"sub": user.email})}

def check_is_email_unique(db: Session, email: str):
    existing_user = db.query(models.User).filter(models.User.email == email).first()
    if(existing_user):
        return False
    else:
        return True


UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_audio(db: Session, name: str, file_content: bytes, filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as f:
        f.write(file_content)

    audio = models.Audio(name=name, file_path=file_path)
    db.add(audio)
    db.commit()
    db.refresh(audio)
    return audio