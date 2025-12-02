from fastapi import APIRouter, Depends, Query, Body
from sqlalchemy.orm import Session
from src.database import get_db
from src.employee import schemas, service

router = APIRouter()


@router.post("/", response_model=schemas.CreateEmployeeResponse)
async def create_employee(
    employee: schemas.CreateEmployeeRequest = Body(...), db: Session = Depends(get_db)
):
    return service.create_employee(
        db, fullName=employee.fullName, position=employee.position
    )


@router.get("/", response_model=schemas.ReadManyEmployeesResponse)
def read_employees(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    skip = (page - 1) * limit
    return service.read_employees(db=db, skip=skip, limit=limit)


@router.get("/candidates", response_model=schemas.ReadManyEmployeeCandidatesResponse)
def read_employee_candidates(
    db: Session = Depends(get_db),
):
    return service.read_employee_candidates(db=db)
