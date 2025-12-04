from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends,
    HTTPException,
    Query,
    BackgroundTasks,
    Request,
    Body,
)
from sqlalchemy.orm import Session
from src.database import get_db
from src.audio import schemas, service, models
from src.speaker_profile import service as speaker_profile_service
from src import utils

router = APIRouter()




@router.get("/process/{audio_id}")
def process_audio(
    audio_id: int,
    background_tasks: BackgroundTasks,
    request: Request,
    db: Session = Depends(get_db),
):
    audio = db.query(models.Audio).filter(models.Audio.id == audio_id).first()
    if not audio:
        raise HTTPException(status_code=404, detail="Audio not found")

    user_id = utils.get_user_id(request=request, db=db)
    background_tasks.add_task(service.process_audio_to_text, db, audio_id, user_id)

    return {"success": True, "message": f"Processing of audio {audio_id} started"}


@router.post("/upload-recording", response_model=schemas.UploadAudioResponse)
async def upload_recording(
    name: str = Form(...),
    meetingId: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    request: Request = None,
):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    content = await file.read()
    filename = f"{name}.webm"

    user_id = utils.get_user_id(request=request, db=db)

    await service.save_audio(db, name, meetingId, content, filename, user_id)
    return {"success": True}


@router.get("/", response_model=schemas.ReadManyAudiosResponse)
def read_speakers(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    skip = (page - 1) * limit
    return service.get_audios(db=db, skip=skip, limit=limit)


@router.post(
    "/assign-audio-to-meeting", response_model=schemas.AssignAudioToMeetingResponse
)
def assign_audio_to_meeting(
    payload: schemas.AssignAudioToMeetingRequest, db: Session = Depends(get_db)
):
    return service.assign_audio_to_meeting(
        db=db,
        audio_id=payload.audio_id,
        meeting_id=payload.meeting_id,
    )


@router.get("/play/speaker-profile/{speaker_profile_id}")
def play_speaker_profile(speaker_profile_id: str, db: Session = Depends(get_db)):
    return service.play_audio(
        db=db,
        speaker_profile_id=speaker_profile_id,
    )


@router.get("/play/audio/{audio_id}")
def play_audio(audio_id: str, db: Session = Depends(get_db)):
    return service.play_audio(
        db=db,
        audio_id=audio_id,
    )


@router.post("/assign-audio-speaker/{audio_id}")
def assigns_audio_speakers(
    audio_id: str,
    request: Request,
    speaker_profile_assignment_payload=Body(...),
    db: Session = Depends(get_db),
):
    user_id = utils.get_user_id(request=request, db=db)
    return speaker_profile_service.assign_speakers(
        db, speaker_profile_assignment_payload, audio_id, user_id
    )


@router.post("/update-audio-text/{speaker_profile_id}")
def update_audio_text(
    speaker_profile_id, payload=Body(...), db: Session = Depends(get_db)
):
    return speaker_profile_service.update_audio_text(db, speaker_profile_id, payload)


@router.delete("/delete-audio-text/{speaker_profile_id}")
def delete_audio_text(speaker_profile_id, db: Session = Depends(get_db)):
    return speaker_profile_service.delete_audio_text(db, speaker_profile_id)


@router.get("/speakers/{audio_id}", response_model=schemas.ReadAudioSpeakers)
def read_one_speaker(
    audio_id: str,
    db: Session = Depends(get_db),
):
    return speaker_profile_service.read_speakers(db=db, audio_id=audio_id)
