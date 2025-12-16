import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv() 

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 480))
FASTAPI_AUDIO_URL = os.getenv("FASTAPI_AUDIO_URL")

class Settings(BaseSettings):
    SECRET_KEY: str
    FASTAPI_AUDIO_URL: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    API_KEY: str 
    MODEL_ID: str
    BASE_URL: str
    POSTGRES_DATABASE_URL: str
    CHROMA_HOST: str
    CHROMA_PORT: str
    REDIS_DB_URL: str
       
    class Config:
        env_file = ".env"

settings = Settings()
