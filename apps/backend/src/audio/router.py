
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, Query,BackgroundTasks
from sqlalchemy.orm import Session
from src.database import get_db
from src.audio import schemas, service, models
router = APIRouter()



@router.get("/process/{audio_id}")
def process_audio(
    audio_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    audio = db.query(models.Audio).filter(models.Audio.id == audio_id).first()
    if not audio:
        raise HTTPException(status_code=404, detail="Audio not found")

    
    background_tasks.add_task(service.process_audio_to_text, db, audio_id)
    
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
def read_audios(
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