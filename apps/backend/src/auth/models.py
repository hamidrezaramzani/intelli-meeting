from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from src.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    bio = Column(Text, nullable=True)
    speaker_profiles = relationship("SpeakerProfile", back_populates="user")

    notifications = relationship(
        "Notification",
        back_populates="user",
        foreign_keys="Notification.user_id",
    )
    
    meetings =  relationship(
        "Meeting",
        back_populates="user",
    )
