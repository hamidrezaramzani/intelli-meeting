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
whisper_model = whisper.load_model("small")
print("[INFO] Models loaded successfully.")

chunk_ms = 10000
overlap_ms = 2000
speaker_embeddings = {}
speaker_embeddings_count = {}

COSINE_THRESHOLD = 0.60

def cosine_similarity(a, b):
    a = np.array(a)
    b = np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def assign_speaker(new_embedding: np.ndarray):
    if not speaker_embeddings:
        speaker_id = f"SPEAKER_{len(speaker_embeddings)}"
        speaker_embeddings[speaker_id] = new_embedding
        speaker_embeddings_count[speaker_id] = 1
        return speaker_id

    max_sim = -1
    best_speaker = None
    for speaker_id, emb in speaker_embeddings.items():
        emb_array = np.array(emb)
        sim = cosine_similarity(new_embedding, emb_array)
        if sim > max_sim:
            max_sim = sim
            best_speaker = speaker_id

    if max_sim >= COSINE_THRESHOLD:
        n = speaker_embeddings_count[best_speaker]
        speaker_embeddings[best_speaker] = (np.array(speaker_embeddings[best_speaker]) * n + new_embedding) / (n + 1)
        speaker_embeddings_count[best_speaker] += 1
        return best_speaker
    else:
        speaker_id = f"SPEAKER_{len(speaker_embeddings)}"
        speaker_embeddings[speaker_id] = new_embedding
        speaker_embeddings_count[speaker_id] = 1
        return speaker_id

def generate_transcript_segments(chunk_path, index):
    start_diarization = time.time()
    print("[INFO] Speaker diarization started.")
    diarization_result = diarization(chunk_path)
    print("[INFO] Speaker diarization completed.", time.time() - start_diarization)

    start_transcription = time.time()
    print("[INFO] Whisper transcription started.")
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
    chunk_sec = chunk_ms / 1000
    overlap_sec = overlap_ms / 1000
    offset = index * (chunk_sec - overlap_sec)

    for turn, _, speaker_label in diarization_result.itertracks(yield_label=True):
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

        real_speaker = assign_speaker(np.array(embedding_vector))

        transcript_segments.append({
            "speaker": real_speaker,
            "start": round(start + offset, 2),
            "end": round(end + offset, 2),
            "text": segment_text,
            "embedding": embedding_vector.tolist()
        })

    return transcript_segments

def process_audio(file_path: str):
    audio = AudioSegment.from_file(file_path)
    transcript_segments = []

    for chunk_idx, i in enumerate(range(0, len(audio), chunk_ms - overlap_ms)):
        chunk = audio[i:i + chunk_ms]
        temp_path = f"temp_chunk.wav"
        chunk.export(temp_path, format="wav")
        transcript_segments.extend(generate_transcript_segments(temp_path, chunk_idx))

    print(f"[INFO] All segments processed. Total segments: {len(transcript_segments)}")
    return {
        "transcript_segments": transcript_segments
    }
