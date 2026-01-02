from datetime import datetime
import enum

from sqlalchemy import (
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
)

from src.database import Base


class MeetingChatMessage(Base):
    __tablename__ = "meeting_chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    message_code = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class MeetingChatJobStatus(str, enum.Enum):
    PROCESSING = "processing"
    DONE = "done"
    FAILED = "failed"


class MeetingChatJob(Base):
    __tablename__ = "meeting_chat_jobs"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    user_message_id = Column(
        Integer, ForeignKey("meeting_chat_messages.id"), nullable=False
    )
    assistant_message_id = Column(
        Integer, ForeignKey("meeting_chat_messages.id"), nullable=True
    )
    status = Column(
        Enum(MeetingChatJobStatus),
        default=MeetingChatJobStatus.PROCESSING,
        nullable=False,
    )
    error = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
