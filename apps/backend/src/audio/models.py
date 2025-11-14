from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func, Enum
from sqlalchemy.orm import relationship
import enum
from src.database import Base



class AudioStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SUCCESS = "success"
    FAILED = "failed"

class Audio(Base):
    __tablename__ = "audios"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    status = Column(Enum(AudioStatus), default=AudioStatus.PENDING)
    transcript = Column(String, nullable=True)
    
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=True, index=True)

    meeting = relationship("Meeting", back_populates="audios")
