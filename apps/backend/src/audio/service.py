import os
from sqlalchemy.orm import Session
from pydub import AudioSegment
from . import models

UPLOAD_DIR = "src/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_audio(db: Session, name: str, file_content: bytes, filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as f:
        f.write(file_content)

    try:
        audio_segment = AudioSegment.from_file(file_path)
        duration_seconds = len(audio_segment) / 1000
        duration_minutes = round(duration_seconds / 60, 2)
        duration_str = f"{duration_minutes}"
    except Exception as e:
        print("Error calculating duration:", e)
        duration_str = "Unknown"

    audio = models.Audio(
        name=name,
        file_path=filename,
        duration=duration_str
    )

    db.add(audio)
    db.commit()
    db.refresh(audio)

    return audio
