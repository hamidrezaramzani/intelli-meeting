from sqlalchemy import Column, Integer, String
from src.database import Base





class Position(Base):
    __tablename__ = "positions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
