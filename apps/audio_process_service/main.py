from fastapi import FastAPI, HTTPException, Body
from process import process_audio
import os

app = FastAPI()
@app.post("/process-audio")
async def process_audio_endpoint(file = Body(...)):
    try:
        file_path = os.path.abspath(os.path.join("../backend/src/uploads", file["filename"]))
        result = process_audio(file_path)
        return result
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
