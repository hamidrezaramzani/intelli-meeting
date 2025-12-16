from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from src.employee.schemas import EmployeeItem
class UploadAudioResponse(BaseModel):
    success: bool
    
    
class SpeakerItem(BaseModel):
    id: int
    initial_speaker_label: str
    text: str
    audio_id: int
    employee: Optional[EmployeeItem]

class AudioItem(BaseModel):
    id: int
    name: str
    date: datetime
    duration: str
    file_path: str
    status: str
    transcript: str | None
    processing_duration: str | None
    speaker_profiles: list[SpeakerItem] | None
    is_processing: bool | None
    
    

class ReadManyAudiosResponse(BaseModel):
    success: bool
    total: int
    page: int
    limit: int
    audios: list[AudioItem] | None
    
class AssignAudioToMeetingRequest(BaseModel):
    audio_id: int
    meeting_id: int

class PlayAudioResponse(BaseModel):
    success: bool

class AssignAudioToMeetingResponse(BaseModel):
    message: str
    
class ReadAudioSpeakers(BaseModel):
    success: bool
    speakers: list[SpeakerItem] | None