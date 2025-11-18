
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, Query,BackgroundTasks, Request
from sqlalchemy.orm import Session
from src.database import get_db
from src.auth import models as user_models
from src.audio import schemas, service, models
from src.speaker_profile import service as speaker_profile_service
from src.auth import utils
router = APIRouter()



@router.get("/process/{audio_id}")
def process_audio(
    audio_id: int,
    background_tasks: BackgroundTasks,
    request: Request, 
    db: Session = Depends(get_db)
):
    audio = db.query(models.Audio).filter(models.Audio.id == audio_id).first()
    if not audio:
        raise HTTPException(status_code=404, detail="Audio not found")

    auth_header = request.headers.get("Authorization")
    print(auth_header)
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=403, detail="Invalid auth header")
    token = auth_header.split(" ")[1]
    payload = utils.decode_access_token(token)
    print(payload)
    if not payload:
        raise HTTPException(status_code=403, detail="Invalid or expired token")
    user_email = payload.get("sub")
    print(user_email)
    if not user_email:
        raise HTTPException(status_code=403, detail="Email not found in token")
    
    user = db.query(user_models.User).filter(user_models.User.email == user_email).first()
    background_tasks.add_task(service.process_audio_to_text, db, audio_id, user.id)
    
    return {
        "success": True,
        "message": f"Processing of audio {audio_id} started"
    }

@router.post("/upload-recording", response_model=schemas.UploadAudioResponse)
async def upload_recording(
    name: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    content = await file.read()
    filename = f"{name}.webm"

    service.save_audio(db, name, content, filename)
    return {"success": True}

@router.get("/", response_model=schemas.ReadManyAudiosResponse)
def read_speakers(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
):
    skip = (page - 1) * limit
    return service.get_audios(db=db, skip=skip, limit=limit)

@router.post("/assign-audio-to-meeting", response_model=schemas.AssignAudioToMeetingResponse)
def assign_audio_to_meeting(
    payload: schemas.AssignAudioToMeetingRequest,
    db: Session = Depends(get_db)
):
    return service.assign_audio_to_meeting(
        db=db,
        audio_id=payload.audio_id,
        meeting_id=payload.meeting_id,
    )

@router.get("/speakers/{audio_id}", response_model=schemas.ReadAudioSpeakers)
def read_speakers(
    audio_id: int,    
    db: Session = Depends(get_db),
):
    return speaker_profile_service.read_speakers(db=db, audio_id=audio_id)
