import os
from sqlalchemy.orm import Session
from . import models

UPLOAD_DIR = "src/uploads"
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