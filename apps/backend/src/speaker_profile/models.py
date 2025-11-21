from sqlalchemy import Column, Integer, String, ForeignKey, Float
from src.database import Base
from sqlalchemy.orm import relationship

class SpeakerProfile(Base):
    __tablename__ = "speaker_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    initial_speaker_label = Column(String, nullable=False)
    text = Column(String, nullable=False)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True, index=True)
    audio_id = Column(Integer, ForeignKey("audios.id"), nullable=True, index=True)
    vector = Column(String, nullable=True)
    start = Column(Float, nullable=False)
    end = Column(Float, nullable=False)

    audio = relationship("Audio", back_populates="speaker_profiles")
    user = relationship("User", back_populates="speaker_profiles")
    employee = relationship("Employee", back_populates="speaker_profiles")
