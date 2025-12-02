from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from src.database import Base
from datetime import datetime


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", foreign_keys=[user_id], back_populates="notifications")

    audio_id = Column(Integer, ForeignKey("audios.id"), nullable=True)
    audio = relationship("Audio", back_populates="notifications")

    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=True)
    meeting = relationship("Meeting", back_populates="notifications")

    logged_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    logged_by = relationship("User", foreign_keys=[logged_by_id])

    title = Column(String, nullable=False)
    message = Column(String, nullable=False)

    type = Column(String, nullable=False)

    is_read = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
