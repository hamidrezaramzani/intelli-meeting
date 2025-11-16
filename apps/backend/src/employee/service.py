from sqlalchemy.orm import Session, joinedload
from fastapi.encoders import jsonable_encoder
from . import models
from src.position import models as position_models 

def create_employee(db: Session, fullName: str, position: str):
    try:
        employee = models.Employee(
        fullName=fullName,
        position_id=position
        )

        db.add(employee)
        db.commit()
        db.refresh(employee)

        return { "success": True }
    except: 
        return { 'success': False }

    

def read_employees(db: Session, skip: int = 0, limit: int = 10):
    total = db.query(models.Employee).count()
    
    employees = (
        db.query(models.Employee)
        .options(joinedload(models.Employee.position)) 
        .order_by(models.Employee.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    
    employees_data = jsonable_encoder(employees)
    return {
        "success": True,
        "total": total,
        "page": (skip // limit) + 1,
        "limit": limit,
        "employees": employees_data,
    }
    
def read_employee_candidates(db: Session):
    employees = (
         db.query(models.Employee)
        .options(joinedload(models.Employee.position)) 
        .order_by(models.Employee.id.desc())
        .all()
    )
    
    employees_data = jsonable_encoder(employees)
    return {
        "success": True,
        "employees": employees_data,
    }
    