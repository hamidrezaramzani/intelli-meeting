from src.auth import router as auth_router
from src.audio import router as audio_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src import models, database

app = FastAPI(
    title="Intelli meetings"
)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      
    allow_credentials=True,
    allow_methods=["*"],     
    allow_headers=["*"],    
)


models.Base.metadata.create_all(bind=database.engine)

app.include_router(auth_router.router, prefix="/api/auth", tags=["Auth"])
app.include_router(audio_router.router, prefix="/api/audio", tags=["Audio"])