from pyannote.audio import Pipeline, Model, Inference
from pyannote.core import Segment
from pydub import AudioSegment
import whisper
import numpy as np
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

speaker_embeddings = {}

COSINE_THRESHOLD = 0.75 

def cosine_similarity(a, b):
    a = np.array(a)
    b = np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def assign_speaker(new_embedding):
    if not speaker_embeddings:
        speaker_id = f"SPEAKER_{len(speaker_embeddings)}"
        speaker_embeddings[speaker_id] = new_embedding
        return speaker_id
    
    max_sim = -1
    best_speaker = None
    for speaker_id, emb in speaker_embeddings.items():
        sim = cosine_similarity(new_embedding, emb)
        if sim > max_sim:
            max_sim = sim
            best_speaker = speaker_id
    
    if max_sim >= COSINE_THRESHOLD:
        speaker_embeddings[best_speaker] = np.mean([speaker_embeddings[best_speaker], new_embedding], axis=0)
        return best_speaker
    else:
        speaker_id = f"SPEAKER_{len(speaker_embeddings)}"
        speaker_embeddings[speaker_id] = new_embedding
        return speaker_id

def generate_transcript_segments(chunk_path):
    start_diarization = time.time()
    diarization_result = diarization(chunk_path)
    print("[INFO] Speaker diarization completed.", time.time() - start_diarization)

    start_transcription = time.time()
    transcription = whisper_model.transcribe(
        chunk_path,
        fp16=False,
        verbose=False,
        condition_on_previous_text=False,
        word_timestamps=True
    )
    print("[INFO] Whisper transcription completed.", time.time() - start_transcription)

    transcript_segments = []
    MIN_DURATION = 0.5

    for idx, (turn, _, speaker_label) in enumerate(diarization_result.itertracks(yield_label=True), 1):
        start = turn.start
        end = turn.end
        if end - start < MIN_DURATION:
            continue

        segment_text = " ".join(
            word["text"] for word in transcription["segments"]
            if word["end"] >= start and word["start"] <= end
        ).strip()

        segment = Segment(start, end)
        embedding_vector = embedding_inference.crop(chunk_path, segment)

        real_speaker = assign_speaker(embedding_vector.tolist())

        transcript_segments.append({
            "speaker": real_speaker,
            "start": round(start, 2),
            "end": round(end, 2),
            "text": segment_text,
            "embedding": embedding_vector.tolist()
        })

    return transcript_segments

def process_audio(file_path: str, chunk_ms: int = 10000, overlap_ms: int = 2000):
    audio = AudioSegment.from_file(file_path)
    transcript_segments = []

    for i in range(0, len(audio), chunk_ms - overlap_ms):
        chunk = audio[i:i + chunk_ms]
        temp_path = f"temp_chunk.wav"
        chunk.export(temp_path, format="wav")
        transcript_segments.extend(generate_transcript_segments(temp_path))

    print(f"[INFO] All segments processed. Total segments: {len(transcript_segments)}")
    return {
        "transcript_segments": transcript_segments
    }
