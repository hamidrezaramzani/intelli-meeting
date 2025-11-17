from pyannote.audio import Pipeline, Model, Inference
from pyannote.core import Segment
import whisper
import config

def process_audio(file_path: str):


    diarization = Pipeline.from_pretrained(
        "pyannote/speaker-diarization@2.1",
        use_auth_token=config.HF_TOKEN
    )
    embedding_model = Model.from_pretrained(
        "pyannote/embedding",
        use_auth_token=config.HF_TOKEN
    )
    embedding_inference = Inference(embedding_model, window="whole")
    whisper_model = whisper.load_model("medium")

    diarization_result = diarization(file_path)

    transcription = whisper_model.transcribe(
        file_path,
        fp16=False,
        verbose=False,
        condition_on_previous_text=False,
        word_timestamps=True
    )

    transcript_segments = []

    for turn, _, speaker in diarization_result.itertracks(yield_label=True):
        start = turn.start
        end = turn.end

        segment_text = ""
        for word in transcription["segments"]:
            word_start = word["start"]
            word_end = word["end"]
            if word_end >= start and word_start <= end:
                segment_text += word["text"] + " "

        segment_text = segment_text.strip()

        segment = Segment(start, end)
        embedding_vector = embedding_inference.crop(file_path, segment)

        transcript_segments.append({
            "speaker": speaker,
            "start": round(start, 2),
            "end": round(end, 2),
            "text": segment_text,
            "embedding": embedding_vector.tolist()
        })

    return {
        "transcript_segments": transcript_segments,
    }
