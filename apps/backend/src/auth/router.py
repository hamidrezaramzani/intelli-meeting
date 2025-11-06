from . import schemas, service
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.database import get_db
from . import schemas, service


router = APIRouter()


@router.post("/signup", response_model=schemas.UserResponse)
def signup(newUser: schemas.UserCreate, db: Session = Depends(get_db)):
    pass
    is_created =  service.create_user(db, newUser); 
    if not is_created:
        return {
            "success": False,
        }
    return {
        "success": True,
    }

@router.post("/signin", response_model=schemas.UserSigninResponse)
def signin(user: schemas.UserSignin, db: Session = Depends(get_db)):
    data = service.authenticate_user(db, user.email, user.password)

    if not data or not data.get("user"):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user = data["user"]
    token = data["token"]
    return {"user": user, "token": token}




@router.post("/check-email", response_model=schemas.CheckEmailResponse)
def signup(body: schemas.CheckEmailBody, db: Session = Depends(get_db)):
    isUnique = service.check_is_email_unique(db, body.email)
    return {
        "isUnique": isUnique
    }

