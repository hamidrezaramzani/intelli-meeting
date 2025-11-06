
from . import schemas, service
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from . import schemas, service

router = APIRouter()
@router.post("/api/upload-recording", response_model=schemas.UploadAudioResponse)
async def upload_recording(
    name,
    file,
    db: Session = Depends(get_db)
):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    content = await file.read()
    filename = f"{name}.webm"

    audio = service.save_audio(db, name, content, filename)
    return {
        "success": True,
    }
