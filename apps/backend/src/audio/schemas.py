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
    
class ReadManyAudiosResponse(BaseModel):
    success: bool
    total: int
    page: int
    limit: int
    audios: list[AudioItem] | None
    
class AssignAudioToMeetingRequest(BaseModel):
    audio_id: int
    meeting_id: int


class AssignAudioToMeetingResponse(BaseModel):
    message: str