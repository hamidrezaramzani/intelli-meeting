from pydantic import BaseModel
from src.position.schemas import PositionItem

class CreateEmployeeResponse(BaseModel):
    success: bool
    
class CreateEmployeeRequest(BaseModel):
    fullName: str
    position: str
    
class EmployeeItem(BaseModel):
    id: int
    fullName: str
    position: PositionItem
    
class ReadManyEmployeesResponse(BaseModel):
    success: bool
    total: int
    page: int
    limit: int
    employees: list[EmployeeItem] | None
    
    
        
class ReadManyEmployeeCandidatesResponse(BaseModel):
    success: bool
    employees: list[EmployeeItem] | None
    

class ReadOneEmployeeResponse(BaseModel):
    success: bool
    employee: EmployeeItem | None
    