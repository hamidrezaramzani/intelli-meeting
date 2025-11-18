from pyannote.audio import Pipeline, Model, Inference
from pyannote.core import Segment
import whisper
import config
import time

print("[INFO] Loading models...")
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
print("[INFO] Models loaded successfully.")

def process_audio(file_path: str):
    start_diarization = time.time()
    print("[INFO] Running speaker diarization...")
    diarization_result = diarization(file_path)
    print("[INFO] Speaker diarization completed.", time.time() - start_diarization)

    print("[INFO] Running Whisper transcription...")
    start_transcription = time.time()
    transcription = whisper_model.transcribe(
        file_path,
        fp16=False,
        verbose=True,
        condition_on_previous_text=False,
        word_timestamps=True
    )
    print(f"[INFO] Whisper transcription completed. Total words: {len(transcription['segments'])}", time.time() - start_transcription)
    print("Extracted text", transcription['text'])
    transcript_segments = []
    MIN_DURATION = 1.0

    print("[INFO] Start processing diarization segments and creating embeddings...")
    for idx, (turn, _, speaker) in enumerate(diarization_result.itertracks(yield_label=True), 1):
        start = turn.start
        end = turn.end

        if end - start < MIN_DURATION:
            print(f"[DEBUG] Skipping short segment ({round(end-start,2)}s) for speaker {speaker}")
            continue

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

        print(f"[INFO] Processed segment {idx}: speaker {speaker}, duration {round(end-start,2)}s, words {len(segment_text.split())}")

    print(f"[INFO] All segments processed. Total segments: {len(transcript_segments)}")
    return {
        "transcript_segments": transcript_segments,
    }
