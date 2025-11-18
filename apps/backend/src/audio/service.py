import requests
import os
import uuid, time
from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy.orm import joinedload
from fastapi.encoders import jsonable_encoder
from pydub import AudioSegment
from . import models
from src.meeting import models as meeting_models
from src.speaker_profile import service as speaker_profile_service
from src import config
import json
from pydub import AudioSegment
import numpy as np

UPLOAD_DIR = "src/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_audio(db: Session, name: str, file_content: bytes, filename: str):
    filename = f"{int(time.time())}_{uuid.uuid4().hex}_{filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as f:
        f.write(file_content)

    base_name, ext = os.path.splitext(file_path)
    wav_path = f"{base_name}.wav"
    if ext.lower() != ".wav":
        audio_segment = AudioSegment.from_file(file_path, format=ext.replace(".", ""))
        audio_segment = audio_segment.set_frame_rate(16000).set_channels(1)
        audio_segment.export(wav_path, format="wav")
        final_path = wav_path
    else:
        final_path = file_path
        audio_segment = AudioSegment.from_file(file_path)

    try:
        duration_seconds = len(audio_segment) / 1000
        duration_minutes = round(duration_seconds / 60, 2)
        duration_str = f"{duration_minutes}"
    except Exception as e:
        print("Error calculating duration:", e)
        duration_str = "Unknown"

    audio = models.Audio(
        name=name,
        file_path=os.path.basename(final_path),
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

def process_audio_to_text(db: Session, audio_id: int, user_id: int):
    try:
        audio = db.query(models.Audio).filter(models.Audio.id == audio_id).first()
        if not audio:
            print(f"Audio {audio_id} not found")
            return

        set_audio_status(db=db, status=models.AudioStatus.PROCESSING, audio=audio)

        file_path = os.path.join(UPLOAD_DIR, audio.file_path)
        filename = os.path.basename(file_path)

        start_time = time.time()

        response = requests.post(
            f"{config.settings.FASTAPI_AUDIO_URL}/process-audio",
            json={"filename": filename},
            timeout=None 
        )

        audio.processing_duration = str(time.time() - start_time)
        response.raise_for_status()

        transcript_segments = response.json().get("transcript_segments", [])
        transcript = ""        
        for segment in transcript_segments:
            transcript += segment["text"] + " "
            speaker_profile_service.create_speaker_profile(
                db,
                user_id=user_id,
                initial_speaker_label=segment["speaker"],
                employee_id=None,
                audio_id=audio_id,
                vector=json.dumps(segment["embedding"]),
                avg_similarity=float(np.mean(segment["embedding"])),
                sample_audio_path=""
            )     

        audio.transcript = transcript
    

        set_audio_status(db=db, status=models.AudioStatus.SUCCESS, audio=audio)
        db.commit()
        db.refresh(audio)

    except Exception as e:
        print(f"Error processing audio {audio_id}: {e}")
        set_audio_status(db=db, status=models.AudioStatus.FAILED, audio=audio)
        db.commit()
        db.refresh(audio)