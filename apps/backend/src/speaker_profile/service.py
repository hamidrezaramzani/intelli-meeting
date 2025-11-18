from sqlalchemy.orm import Session, joinedload
from src.speaker_profile.models import SpeakerProfile
from fastapi.encoders import jsonable_encoder

def create_speaker_profile(
    db: Session,
    user_id: str | None,
    initial_speaker_label: str,
    employee_id: str | None,
    audio_id: str | None,
    vector: str | None,
    avg_similarity: float,
):
    new_profile = SpeakerProfile(
        user_id=user_id,
        initial_speaker_label=initial_speaker_label,
        employee_id=employee_id,
        audio_id=audio_id,
        vector=vector,
        avg_similarity=avg_similarity,
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile

def read_speakers(db: Session, audio_id: str):
    
    speakers = (
        db.query(SpeakerProfile)
        .filter(SpeakerProfile.audio_id == audio_id)
        .options(joinedload(SpeakerProfile.employee)) 
        .order_by(SpeakerProfile.id.desc())
        .all()
    )
    
    print(speakers)
    # audios_data = jsonable_encoder(speakers)

    return {
        "success": True,
        "speakers": [],
    }
   