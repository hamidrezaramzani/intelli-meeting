from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class ChatMessage(BaseModel):
    id: int
    role: str
    content: str
    message_code: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ChatHistoryResponse(BaseModel):
    success: bool
    messages: List[ChatMessage]
    isProcessing: bool
    error: Optional[str] = None
