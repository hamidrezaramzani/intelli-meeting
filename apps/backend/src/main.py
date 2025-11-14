from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.middleware import jwt_middleware
from src import database
from src.database import Base

from src.models import * 

from src.auth import router as auth_router
from src.audio import router as audio_router
from src.meeting import router as meeting_router


app = FastAPI(title="Intelli meetings")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.middleware("http")(jwt_middleware)

Base.metadata.create_all(bind=database.engine)

app.include_router(auth_router.router, prefix="/api/auth", tags=["Auth"])
app.include_router(audio_router.router, prefix="/api/audio", tags=["Audio"])
app.include_router(meeting_router.router, prefix="/api/meetings", tags=["Meeting"])
