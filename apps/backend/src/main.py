from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.middleware import jwt_middleware
from src import database
from src.database import Base

from src.models import *

from src.auth import router as auth_router
from src.audio import router as audio_router
from src.audio import router_ws as audio_router_ws
from src.meeting import router as meeting_router
from src.meeting import router_ws as meeting_router_ws
from src.position import router as positions_router
from src.employee import router as employees_router
from src.dashboard import router as dashboard_router
from src.notification import router as notification_router
from src.notification import router_ws as notification_router_ws
from src.config import settings
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
app.include_router(audio_router_ws.router, prefix="/ws/audio", tags=["Meeting"])
app.include_router(meeting_router.router, prefix="/api/meeting", tags=["Meeting"])
app.include_router(dashboard_router.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(meeting_router_ws.router, prefix="/ws/meeting", tags=["Meeting"])
app.include_router(positions_router.router, prefix="/api/position", tags=["Position"])
app.include_router(employees_router.router, prefix="/api/employee", tags=["Employee"])
app.include_router(notification_router.router, prefix="/api/notification", tags=["Notification"])
app.include_router(notification_router_ws.router, prefix="/ws/notification", tags=["Notification"])