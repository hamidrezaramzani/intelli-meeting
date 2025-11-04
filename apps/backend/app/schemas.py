from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    confirmPassword: str

class User(BaseModel):
    id: int
    name: str
    email: EmailStr

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

class UploadAudioResponse(BaseModel):
    success: bool
    name: str
    file_path: str