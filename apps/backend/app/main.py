from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app import database, models, schemas, commands


app = FastAPI()

origins = [
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      
    allow_credentials=True,
    allow_methods=["*"],     
    allow_headers=["*"],    
)


models.Base.metadata.create_all(bind=database.engine)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()
        

@app.post("/api/signup", response_model=schemas.UserResponse)
def signup(newUser: schemas.UserCreate, db: Session = Depends(get_db)):
    is_created =  commands.create_user(db, newUser); 
    if not is_created:
        return {
            "success": False,
        }
    return {
        "success": True,
    }

@app.post("/api/check-email", response_model=schemas.CheckEmailResponse)
def signup(body: schemas.CheckEmailBody, db: Session = Depends(get_db)):
    isUnique = commands.check_is_email_unique(db, body.email)
    return {
        "isUnique": isUnique
    }
