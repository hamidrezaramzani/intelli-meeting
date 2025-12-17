from fastapi import HTTPException
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
    

def read_one_employee(db: Session, employee_id: str):
    employee = (
         db.query(models.Employee, )
         .filter(models.Employee.id == employee_id)
        .options(joinedload(models.Employee.position)) 
        .first()
    )
    
    employee_data = jsonable_encoder(employee)

    print(employee_data)
    return {
        "success": True,
        "employee": employee_data,
    }
    


def update_employee(db: Session, employee_id: str, body):
    employee = (
         db.query(models.Employee, )
         .filter(models.Employee.id == employee_id)
        .options(joinedload(models.Employee.position)) 
        .first()
    )
    
    employee.fullName = body['fullName']
    employee.position_id = body['position']
    db.commit()
    return {
        "success": True,
    }
    

def delete_employee(db: Session, employee_id: str):
    employee = (
         db.query(models.Employee, )
         .filter(models.Employee.id == employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    db.delete(employee)
    db.commit()
    return {
        "success": True,
    }