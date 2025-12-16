from pydantic import BaseModel
from typing import List, Optional


class ActionItem(BaseModel):
    description: str
    owner: Optional[str] = None
    deadline: Optional[str] = None


class Decision(BaseModel):
    description: str
    decided_by: Optional[str] = None

class Summary(BaseModel):
    summary: str
    key_points: List[str]

class MeetingActionItem(BaseModel):
    actions: List[ActionItem]


class MeetingDecision(BaseModel):
    decisions: List[Decision]


class MeetingSummary(BaseModel):
    summary: Summary
    
