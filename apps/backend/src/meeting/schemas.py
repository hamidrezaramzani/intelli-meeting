from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from src.employee import schemas

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
    employees: Optional[List[schemas.EmployeeItem]] = None 
    model_config = ConfigDict(from_attributes=True)

class ReadManyMeetingsResponse(BaseModel):
    success: bool
    total: int
    page: int
    limit: int
    meetings: list[MeetingItem] | None

class ReadMeetingCandidatesResponse(BaseModel):
    success: bool
    meetings: list[MeetingItem] | None
    
class ConvertTranscriptToSummary(BaseModel):
    success: bool
    