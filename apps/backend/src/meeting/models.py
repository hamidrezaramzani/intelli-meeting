from sqlalchemy import Column, Integer, String, JSON
from sqlalchemy.orm import relationship
from src.database import Base

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    date = Column(String, nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    meeting_link = Column(String, nullable=False)    
    audios = relationship("Audio", back_populates="meeting")
