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
    text: str,
    start: str,
    end: str
):
    new_profile = SpeakerProfile(
        user_id=user_id,
        initial_speaker_label=initial_speaker_label,
        employee_id=employee_id,
        audio_id=audio_id,
        vector=vector,
        text=text,
        start=start,
        end=end,
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
    
    speakers_data = []
    for speaker in jsonable_encoder(speakers):
        if(len(speaker['text']) > 10 and not any(x["speaker"] == speaker['initial_speaker_label'] for x in speakers_data)):
            speakers_data.append({
                'id': speaker['id'],
                'speaker': speaker['initial_speaker_label'],
                'transcript': speaker['text'],
                'employee_id': speaker['employee_id']
            })
        
    return {
        "success": True,
        "speakers": speakers_data,
    }
   
def assign_speakers(db: Session, speaker_profile_assignment_payload, audio_id, user_id):
    labels_in_payload = {}
    for assignment in speaker_profile_assignment_payload:
        speaker = db.query(SpeakerProfile).filter(
            SpeakerProfile.id == assignment["speakerProfileId"]
        ).first()
        if not speaker:
            continue
        labels_in_payload[speaker.initial_speaker_label] = assignment["employeeId"]

    speakers = db.query(SpeakerProfile).filter(
        SpeakerProfile.audio_id == audio_id,
        SpeakerProfile.user_id == user_id
    ).all()

    for sp in speakers:
        if sp.initial_speaker_label in labels_in_payload:
            sp.employee_id = labels_in_payload[sp.initial_speaker_label]
        else:
            sp.employee_id = None

    db.commit()
