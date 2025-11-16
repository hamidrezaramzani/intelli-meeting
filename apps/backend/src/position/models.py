from sqlalchemy import Column, Integer, String
from src.database import Base
from sqlalchemy.orm import relationship

class Position(Base):
    __tablename__ = "positions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    
    employees = relationship("Employee", back_populates="position")
