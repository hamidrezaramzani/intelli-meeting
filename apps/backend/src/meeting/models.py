from sqlalchemy import Column, Integer, String, Boolean, Table, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from src.database import Base


meeting_employee = Table(
    "meeting_employee",
    Base.metadata,
    Column("meeting_id", Integer, ForeignKey("meetings.id"), primary_key=True),
    Column("employee_id", Integer, ForeignKey("employees.id"), primary_key=True),
)


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    summary = relationship(
        "MeetingSummaryModel", back_populates="meeting", uselist=False
    )
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    date = Column(DateTime(timezone=False), nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    meeting_link = Column(String, nullable=False)
    is_generating = Column(Boolean, nullable=True, default=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    user = relationship("User", back_populates="meetings")
    
    audios = relationship("Audio", back_populates="meeting")
    employees = relationship(
        "Employee", secondary=meeting_employee, back_populates="meetings"
    )

    notifications = relationship("Notification", back_populates="meeting")
