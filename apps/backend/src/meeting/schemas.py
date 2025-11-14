from pydantic import BaseModel, ConfigDict
from . import models
from typing import List

class CreateMeetingResponse(BaseModel):
    success: bool

class CreateMeetingBody(BaseModel):
    title: str
    description: str
    date: str
    startTime: str
    endTime: str
    meetingLink: str
    
    
    
class MeetingItem(BaseModel):
    id: int
    title: str
    description: str
    date: str
    start_time: str
    end_time: str
    meeting_link: str

    # 👈 tell Pydantic it can read from ORM objects
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