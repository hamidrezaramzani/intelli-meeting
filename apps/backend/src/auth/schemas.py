from pydantic import BaseModel, EmailStr, validator
from typing import Optional

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    confirmPassword: str
    bio: Optional[str] = None

class User(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    bio: Optional[str] = None

    class Config:
        orm_mode = True
        
        
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

class UserSignin(BaseModel):
    email: EmailStr
    password: str
    

class UserSigninResponse(BaseModel):
    user: User | None = None
    token: str | None = None

    class Config:
        orm_mode = True
        


class UserProfile(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    bio: Optional[str] = None

class UserProfileResponse(BaseModel):
    success: bool
    user: UserProfile

class ProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    bio: Optional[str] = None
    password: Optional[str] = None
    
    @validator('password')
    def validate_password(cls, v):
        if v is not None and len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v

class ProfileUpdateResponse(BaseModel):
    success: bool
    user: UserProfile
    message: str
