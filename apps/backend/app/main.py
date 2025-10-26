from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app import database, models, schemas, crud

app = FastAPI()

models.Base.metadata.create_all(bind=database.engine)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/signup", response_model=schemas.UserResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    new_user = crud.create_user(db, user)
    return new_user
