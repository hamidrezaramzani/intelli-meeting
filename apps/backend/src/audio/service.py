from . import models
from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import StreamingResponse
from pydub import AudioSegment
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from src import config
from src.meeting import models as meeting_models
from src.speaker_profile import models as speaker_profile_model
from src.speaker_profile import service as speaker_profile_service
import io
import json
import numpy as np
import os
from sqlalchemy import delete
import uuid
import time
import wave
from src.chroma.chroma import chroma_collection
from src.notification import service as notification_service
from src.notification import models as notification_models
from src.redis.redis import publisher
from src.database import SessionLocal
import httpx

UPLOAD_DIR = "src/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def get_similar_employee_id(segment_embedding, speaker_profiles, threshold=0.78):
    best_similarity = -1
    best_employee_id = None
    segment_embedding_np = np.array(segment_embedding)

    for profile in speaker_profiles:
        if profile.vector:
            profile_embedding = np.array(json.loads(profile.vector))
            similarity = cosine_similarity([segment_embedding_np], [profile_embedding])[
                0
            ][0]

            if similarity >= threshold and similarity > best_similarity:
                best_similarity = similarity
                best_employee_id = profile.employee_id

    return best_employee_id


async def save_audio(
    db: Session, name: str, meeting_id, file_content: bytes, filename: str, user_id: str
):
    try:
        await notification_service.create_notification(
            db=db,
            title="Upload Started",
            message=f"Your audio file({name}) is now uploading",
            user_id=user_id,
            type="uploading-audio",
        )

        filename = f"{int(time.time())}_{uuid.uuid4().hex}_{filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        with open(file_path, "wb") as f:
            f.write(file_content)

        base_name, ext = os.path.splitext(file_path)
        wav_path = f"{base_name}.wav"
        if ext.lower() != ".wav":
            audio_segment = AudioSegment.from_file(
                file_path, format=ext.replace(".", "")
            )
            audio_segment = audio_segment.set_frame_rate(16000).set_channels(1)
            audio_segment.export(wav_path, format="wav")
            final_path = wav_path
            os.remove(file_path)
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
            duration=duration_str,
            meeting_id=meeting_id,
        )
        await notification_service.create_notification(
            db=db,
            title="Upload Complete",
            message=f"Your audio({name}) file has been uploaded successfully",
            user_id=user_id,
            type="audio-uploaded",
        )
        db.add(audio)
        db.commit()
        db.refresh(audio)

        return audio
    except Exception:
        await notification_service.create_notification(
            db=db,
            title="Upload Failed",
            message=f"There was an error uploading the audio({name}) file",
            user_id=user_id,
            type="uploading-audio-failed",
        )


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
    meeting = (
        db.query(meeting_models.Meeting)
        .filter(meeting_models.Meeting.id == meeting_id)
        .first()
    )

    if not audio:
        raise HTTPException(status_code=404, detail="Audio not found")
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    audio.meeting_id = meeting_id
    db.commit()
    db.refresh(audio)

    return {
        "message": f"Audio '{audio.name}' assigned to meeting '{meeting.title}' successfully."
    }


def play_audio(
    db: Session, speaker_profile_id: str | None = None, audio_id: str | None = None
):
    if speaker_profile_id:
        speaker_profile = (
            db.query(speaker_profile_model.SpeakerProfile)
            .options(joinedload(speaker_profile_model.SpeakerProfile.audio))
            .filter(speaker_profile_model.SpeakerProfile.id == speaker_profile_id)
            .first()
        )

        if not speaker_profile:
            raise HTTPException(status_code=404, detail="Speaker profile not found")

        start_sec = speaker_profile.start
        end_sec = speaker_profile.end

        audio_file_name = speaker_profile.audio.file_path
        audio_path = os.path.join(UPLOAD_DIR, audio_file_name)

        if not os.path.exists(audio_path):
            raise HTTPException(status_code=404, detail="Audio file not found")

        with wave.open(audio_path, "rb") as wf:
            sample_rate = wf.getframerate()
            num_channels = wf.getnchannels()
            sample_width = wf.getsampwidth()
            total_frames = wf.getnframes()

            start_frame = int(start_sec * sample_rate)
            end_frame = int(end_sec * sample_rate)
            if end_frame > total_frames:
                end_frame = total_frames

            wf.setpos(start_frame)
            frames = wf.readframes(end_frame - start_frame)

        buffer = io.BytesIO()
        with wave.open(buffer, "wb") as out_wf:
            out_wf.setnchannels(num_channels)
            out_wf.setsampwidth(sample_width)
            out_wf.setframerate(sample_rate)
            out_wf.writeframes(frames)

        buffer.seek(0)
        return StreamingResponse(buffer, media_type="audio/wav")
    else:
        audio = db.query(models.Audio).filter(models.Audio.id == audio_id).first()
        audio_file_name = audio.file_path
        audio_file_path = os.path.join(UPLOAD_DIR, audio_file_name)
        if not os.path.exists(audio_file_path):
            raise HTTPException(status_code=404, detail="File not found")

        def iterfile():
            with open(audio_file_path, mode="rb") as file:
                yield from file

        return StreamingResponse(iterfile(), media_type="audio/wav")


async def set_audio_status(status, audio_id,  key, doc):
    try:
        db = SessionLocal()
        audio = db.query(models.Audio).filter(models.Audio.id == audio_id).first()
        if status == models.AudioStatus.PROCESSING:
            await publisher(key, doc)
            audio.is_processing = True
        
        if status == models.AudioStatus.SUCCESS:
            await publisher(key, doc)
            audio.is_processing = False

        if status == models.AudioStatus.FAILED:
            await publisher(key, doc)
            audio.is_processing = False

        audio.status = status
        db.commit()
    except Exception as e:
        print(e)
        raise


async def process_audio_to_text(db: Session, audio_id: str, user_id: str, key: str):
    try:
        audio = db.query(models.Audio).filter(models.Audio.id == audio_id).first()

        await notification_service.create_notification(
            db=db,
            user_id=user_id,
            title="Transcription Started",
            message=f"Converting your audio({audio.name}) to text",
            type="audio-transcription-started",
            audio_id=audio_id,
        )

        if not audio:
            print(f"Audio {audio_id} not found")
            return

        speaker_profiles = (
            db.query(speaker_profile_model.SpeakerProfile)
            .filter(
                speaker_profile_model.SpeakerProfile.user_id == user_id,
                speaker_profile_model.SpeakerProfile.employee_id != None,
            )
            .all()
        )

        file_path = os.path.join(UPLOAD_DIR, audio.file_path)
        filename = os.path.basename(file_path)

        start_time = time.time()

        await set_audio_status(status=models.AudioStatus.PROCESSING, audio_id=audio_id, key=key, doc={ "type": "audio_progress", "audioId": audio_id })    
        async with httpx.AsyncClient(timeout=None) as client:
            response = await client.post(
                f"{config.settings.FASTAPI_AUDIO_URL}/process-audio",
                json={"filename": filename},
            )

        audio.processing_duration = str(time.time() - start_time)
        response.raise_for_status()

        transcript_segments = response.json().get("transcript_segments", [])
        transcript = ""

        chroma_documents = []
        chroma_ids = []
        chroma_metadatas = []

        for segment in transcript_segments:
            transcript += segment["text"] + " "

            employee_id = get_similar_employee_id(
                segment["embedding"], speaker_profiles
            )

            speaker_profile_id = speaker_profile_service.create_speaker_profile(
                db,
                user_id=str(user_id),
                initial_speaker_label=segment["speaker"],
                employee_id=employee_id,
                audio_id=str(audio_id),
                vector=json.dumps(segment["embedding"]),
                text=segment["text"],
                start=segment["start"],
                end=segment["end"],
            )

            chroma_documents.append(segment["text"])

            chroma_ids.append(str(speaker_profile_id))

            metadata = {
                "audio_id": str(audio_id),
                "speaker_label": segment["speaker"],
            }

            if employee_id is not None:
                metadata["employee_id"] = int(employee_id)

            chroma_metadatas.append(metadata)


        chroma_collection.delete(where={"audio_id": str(audio_id)})

        chroma_collection.add(
            ids=chroma_ids,
            documents=chroma_documents,
            metadatas=chroma_metadatas
        )

        audio.transcript = transcript

        created_speaker_profiles = speaker_profile_service.read_all_speakers(db=db, audio_id=audio_id)
        await set_audio_status(status=models.AudioStatus.SUCCESS, audio_id=audio_id, key=key, doc={ "type": "audio_done", "audioId": audio_id, "transcript": transcript, "speakerProfiles": jsonable_encoder(created_speaker_profiles) })

        await notification_service.create_notification(
            db=db,
            user_id=user_id,
            title="Transcription Complete",
            message=f"Your audio has been successfully transcribed",
            type="audio-transcription-completed",
            audio_id=audio_id,
        )
        db.commit()

    except Exception as e:
        print(f"Error processing audio {audio_id}: {e}")
        await notification_service.create_notification(
            db=db,
            user_id=user_id,
            title="Transcription Failed",
            message=f"Unable to transcribe the audio({audio.name}). Please try again",
            type="audio-transcription-failed",
            audio_id=audio_id,
        )
        await set_audio_status(status=models.AudioStatus.FAILED, audio_id=audio_id, key=key, doc={ "type": "audio_failed", "audioId": audio_id})

def delete_audio(db: Session, audio_id: int):
    audio = db.get(models.Audio, audio_id)
    if not audio:
        raise HTTPException(status_code=404, detail="Audio not found")

    file_path = os.path.join(UPLOAD_DIR, audio.file_path)

    try:
        chroma_collection.delete(where={"audio_id": str(audio_id)})

        db.execute(
            delete(speaker_profile_model.SpeakerProfile)
            .where(speaker_profile_model.SpeakerProfile.audio_id == audio_id)
        )

        db.execute(
            delete(notification_models.Notification)
            .where(notification_models.Notification.audio_id == audio_id)
        )

        db.execute(
            delete(models.Audio)
            .where(models.Audio.id == audio_id)
        )

        db.commit()

        if os.path.exists(file_path):
            os.remove(file_path)

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to delete audio"
        ) from e
