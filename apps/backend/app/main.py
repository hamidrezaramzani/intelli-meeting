from fastapi import FastAPI, Depends, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app import database, models, schemas, commands

app = FastAPI()

origins = ["*"]

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

@app.post("/api/signin", response_model=schemas.UserSigninResponse)
def signin(user: schemas.UserSignin, db: Session = Depends(get_db)):
    data = commands.authenticate_user(db, user.email, user.password)

    if not data or not data.get("user"):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user = data["user"]
    token = data["token"]
    return {"user": user, "token": token}




@app.post("/api/check-email", response_model=schemas.CheckEmailResponse)
def signup(body: schemas.CheckEmailBody, db: Session = Depends(get_db)):
    isUnique = commands.check_is_email_unique(db, body.email)
    return {
        "isUnique": isUnique
    }

@app.post("/api/upload-recording", response_model=schemas.UploadAudioResponse)
async def upload_recording(
    name: str = Form(...),
    file: UploadFile = None,
    db: Session = Depends(get_db)
):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    content = await file.read()
    filename = f"{name}.webm"

    audio = commands.save_audio(db, name, content, filename)

    return {
        "success": True,
        "name": audio.name,
        "file_path": audio.file_path
    }
