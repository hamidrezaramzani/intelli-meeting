from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from src.employee import schemas as employee_schemas
from src.audio import schemas as audio_schemas
from datetime import datetime

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
    date: datetime
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
    
class SummaryResponse(BaseModel):
    summary: Optional[str]
    key_points: List[str]


class DecisionResponse(BaseModel):
    description: str
    decided_by: Optional[str] = None


class ActionItemResponse(BaseModel):
    description: str
    owner: Optional[str] = None
    deadline: Optional[str] = None


class MeetingSummaryResponse(BaseModel):
    summary: Optional[SummaryResponse] = None
    decisions: Optional[List[DecisionResponse]] = None
    actions: Optional[List[ActionItemResponse]] = None
    empty: Optional[bool] = None


class ReadMeetingSummaryResponse(BaseModel):
    success: bool
    data: Optional[MeetingSummaryResponse] = None
    error: Optional[str] = None
    
class ConvertTranscriptToSummary(BaseModel):
    success: bool
    