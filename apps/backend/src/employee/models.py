from sqlalchemy import Column, Integer, String, ForeignKey
from src.database import Base
from sqlalchemy.orm import relationship

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    fullName = Column(String, nullable=False)
    position_id = Column(Integer, ForeignKey("positions.id"), nullable=True, index=True)

    position = relationship("Position", back_populates="employees")
