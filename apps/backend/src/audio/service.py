import whisper
import os
import uuid, time
from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy.orm import joinedload
from fastapi.encoders import jsonable_encoder
from pydub import AudioSegment
from . import models
from src.meeting import models as meeting_models

UPLOAD_DIR = "src/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_audio(db: Session, name: str, file_content: bytes, filename: str):
    filename = f"{int(time.time())}_{uuid.uuid4().hex}_{filename}"
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

    

def get_audios(db: Session, skip: int = 0, limit: int = 10):
    total = db.query(models.Audio).count()
    
    audios = (
        db.query(models.Audio)
        .options(joinedload(models.Audio.meeting)) 
        .order_by(models.Audio.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    audios_data = jsonable_encoder(audios)
    return {
        "success": True,
        "total": total,
        "page": (skip // limit) + 1,
        "limit": limit,
        "audios": audios_data,
    }
    
def assign_audio_to_meeting(db: Session, audio_id: int, meeting_id: int):
    audio = db.query(models.Audio).filter(models.Audio.id == audio_id).first()
    meeting = db.query(meeting_models.Meeting).filter(meeting_models.Meeting.id == meeting_id).first()

    if not audio:
        raise HTTPException(status_code=404, detail="Audio not found")
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    audio.meeting_id = meeting_id
    db.commit()
    db.refresh(audio)

    return {"message": f"Audio '{audio.name}' assigned to meeting '{meeting.title}' successfully."}

def set_audio_status(db: Session, audio, status):
    audio.status = status
    db.commit()
    db.refresh(audio)

def process_audio_to_text(db:Session, audio_id: int):
   try:
    audio = db.query(models.Audio).filter(models.Audio.id == audio_id).first()
    
    set_audio_status(db=db, status=models.AudioStatus.PROCESSING, audio=audio)
    
    file_path = file_path = os.path.join(UPLOAD_DIR, audio.file_path)
    start_time = time.time()
    model = whisper.load_model("turbo")
    result = model.transcribe(file_path)
    set_audio_status(db=db, status=models.AudioStatus.SUCCESS, audio=audio)
    audio.transcript = result["text"];
    end_time = time.time()
    processing_duration = end_time - start_time
    audio.processing_duration = f"{processing_duration}"
    db.commit()
    db.refresh(audio)
   except Exception as e:
    print(e)
    set_audio_status(db=db, status=models.AudioStatus.FAILED, audio=audio)
