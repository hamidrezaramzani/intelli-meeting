from pydantic import BaseModel

class UploadAudioResponse(BaseModel):
    success: bool