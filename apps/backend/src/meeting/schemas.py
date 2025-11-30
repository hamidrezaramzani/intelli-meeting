from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from src.employee import schemas as employee_schemas
from src.audio import schemas as audio_schemas

class CreateMeetingResponse(BaseModel):
    success: bool

class CreateMeetingBody(BaseModel):
    title: str
    description: str
    date: str
    startTime: str
    endTime: str
    meetingLink: str
    employees: Optional[List[int]] = []

    
    
class MeetingItem(BaseModel):
    id: int
    title: str
    description: str
    date: str
    start_time: str
    end_time: str
    meeting_link: str
    audios: Optional[List[audio_schemas.AudioItem]] = None 
    employees: Optional[List[employee_schemas.EmployeeItem]] = None 
    model_config = ConfigDict(from_attributes=True)

class ReadManyMeetingsResponse(BaseModel):
    success: bool
    total: int
    page: int
    limit: int
    meetings: list[MeetingItem] | None
    

class ReadOneMeetingResponse(BaseModel):
    success: bool
    meeting: MeetingItem | None

class ReadMeetingCandidatesResponse(BaseModel):
    success: bool
    meetings: list[MeetingItem] | None
    
class ConvertTranscriptToSummary(BaseModel):
    success: bool
    