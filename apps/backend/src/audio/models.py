from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from src.database import Base

class Audio(Base):
    __tablename__ = "audios"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=True, index=True)

    meeting = relationship("Meeting", back_populates="audios")
