import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv() 

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
FASTAPI_AUDIO_URL = os.getenv("FASTAPI_AUDIO_URL")

class Settings(BaseSettings):
    SECRET_KEY: str
    FASTAPI_AUDIO_URL: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"

settings = Settings()
