from sqlalchemy import Integer, ForeignKey, Text
from sqlalchemy.orm import relationship, Mapped, mapped_column
from src.database import Base


class MeetingSummaryModel(Base):
    __tablename__ = "meeting_summaries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    meeting_id: Mapped[int] = mapped_column(ForeignKey("meetings.id"), unique=True)
    meeting = relationship("Meeting", back_populates="summary", uselist=False)
    
    summary = relationship("SummaryModel", back_populates="meeting", uselist=False)

    decisions = relationship("DecisionModel", back_populates="meeting")
    actions = relationship("ActionItemModel", back_populates="meeting")


class SummaryModel(Base):
    __tablename__ = "summaries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    summary: Mapped[str] = mapped_column(Text)

    key_points = relationship("KeyPointModel", back_populates="summary")

    meeting_id: Mapped[int] = mapped_column(ForeignKey("meeting_summaries.id"))
    meeting = relationship("MeetingSummaryModel", back_populates="summary")


class KeyPointModel(Base):
    __tablename__ = "summary_key_points"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    text: Mapped[str] = mapped_column(Text)

    summary_id: Mapped[int] = mapped_column(ForeignKey("summaries.id"))
    summary = relationship("SummaryModel", back_populates="key_points")


class DecisionModel(Base):
    __tablename__ = "meeting_decisions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    description: Mapped[str] = mapped_column(Text)
    decided_by: Mapped[str | None] = mapped_column(Text, nullable=True)

    meeting_id: Mapped[int] = mapped_column(ForeignKey("meeting_summaries.id"))
    meeting = relationship("MeetingSummaryModel", back_populates="decisions")


class ActionItemModel(Base):
    __tablename__ = "meeting_actions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    description: Mapped[str] = mapped_column(Text)
    owner: Mapped[str | None] = mapped_column(Text, nullable=True)
    deadline: Mapped[str | None] = mapped_column(Text, nullable=True)

    meeting_id: Mapped[int] = mapped_column(ForeignKey("meeting_summaries.id"))
    meeting = relationship("MeetingSummaryModel", back_populates="actions")
