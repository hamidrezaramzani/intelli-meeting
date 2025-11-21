from pydantic import BaseModel
from src.meeting.schemas import MeetingItem

class UploadAudioResponse(BaseModel):
    success: bool
    
    
class AudioItem(BaseModel):
    id: int
    name: str
    date: str
    duration: str
    file_path: str
    status: str
    transcript: str | None
    processing_duration: str | None
    meeting: MeetingItem | None
    
class SpeakerItem(BaseModel):
    id: int
    speaker: str
    transcript: str
    employee_id: int | None
    
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