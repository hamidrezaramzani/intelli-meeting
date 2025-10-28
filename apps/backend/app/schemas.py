from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    confirmPassword: str

class UserResponse(BaseModel):
    success: bool
    class Config:
        orm_mode = True


class CheckEmailBody(BaseModel):
    email: EmailStr

class CheckEmailResponse(BaseModel):
    isUnique: bool
    class Config:
        orm_mode = True
