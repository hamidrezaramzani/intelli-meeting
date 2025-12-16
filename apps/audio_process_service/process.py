from pathlib import Path
from pydub import AudioSegment
import numpy as np
import whisper
import soundfile as sf
from resemblyzer import VoiceEncoder, preprocess_wav
import sherpa_onnx
from config import CHUNK_MS, COSINE_THRESHOLD, EMBEDDING_MODEL_PATH, MIN_DURATION, OVERLAP_MS,SEGMENTATION_MODEL_PATH

print("[INFO] Loading Whisper...")
whisper_model = whisper.load_model("small")

print("[INFO] Loading Resemblyzer...")
encoder = VoiceEncoder()

print("[INFO] Loading Sherpa diarization...")
from sherpa_onnx import (
    OfflineSpeakerDiarizationConfig,
    OfflineSpeakerSegmentationModelConfig,
    OfflineSpeakerSegmentationPyannoteModelConfig,
    SpeakerEmbeddingExtractorConfig,
    FastClusteringConfig,
    OfflineSpeakerDiarization
)

diarization_config = OfflineSpeakerDiarizationConfig(
    segmentation=OfflineSpeakerSegmentationModelConfig(
        pyannote=OfflineSpeakerSegmentationPyannoteModelConfig(
            model=SEGMENTATION_MODEL_PATH
        )
    ),
    embedding=SpeakerEmbeddingExtractorConfig(model=EMBEDDING_MODEL_PATH),
    clustering=FastClusteringConfig(num_clusters=-1, threshold=0.6),
    min_duration_on=0.3,
    min_duration_off=0.5,
)

sherpa_diarizer = OfflineSpeakerDiarization(diarization_config)


speaker_embeddings = {}
speaker_embeddings_count = {}


SPEAKER_MEMORY_SIZE = 5
speaker_embeddings = {}  
speaker_embeddings_avg = {}  

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def assign_speaker(new_embedding: np.ndarray):
    new_embedding = new_embedding / np.linalg.norm(new_embedding)

    if not speaker_embeddings:
        speaker_id = "SPEAKER_0"
        speaker_embeddings[speaker_id] = [new_embedding]
        speaker_embeddings_avg[speaker_id] = new_embedding
        return speaker_id

    max_sim = -1
    best_speaker = None
    for speaker_id, avg_emb in speaker_embeddings_avg.items():
        sim = cosine_similarity(new_embedding, avg_emb)
        if sim > max_sim:
            max_sim = sim
            best_speaker = speaker_id

    if max_sim >= COSINE_THRESHOLD:
        speaker_embeddings[best_speaker].append(new_embedding)
        if len(speaker_embeddings[best_speaker]) > SPEAKER_MEMORY_SIZE:
            speaker_embeddings[best_speaker].pop(0)
        speaker_embeddings_avg[best_speaker] = np.mean(speaker_embeddings[best_speaker], axis=0)
        return best_speaker
    else:
        speaker_id = f"SPEAKER_{len(speaker_embeddings)}"
        speaker_embeddings[speaker_id] = [new_embedding]
        speaker_embeddings_avg[speaker_id] = new_embedding
        return speaker_id


def get_embedding(wav, sr, start, end):
    segment = wav[int(start*sr): int(end*sr)]
    if len(segment) < sr*MIN_DURATION:
        return None
    processed = preprocess_wav(segment, source_sr=sr)
    return encoder.embed_utterance(processed)

def generate_transcript_segments(chunk_path, index):
    samples, sr = sf.read(chunk_path)
    if samples.ndim > 1:
        samples = samples[:, 0]

    diarization_result = sherpa_diarizer.process(samples).sort_by_start_time()
    
    transcription = whisper_model.transcribe(
        chunk_path,
        fp16=False,
        verbose=False,
        condition_on_previous_text=False,
        word_timestamps=True,
    )

    transcript_segments = []
    chunk_sec = CHUNK_MS / 1000
    overlap_sec = OVERLAP_MS / 1000
    offset = index * (chunk_sec - overlap_sec)

    for seg in diarization_result:
        start, end = seg.start, seg.end
        
        if end - start < MIN_DURATION:
            continue

        segment_text = " ".join(
            word["word"]
            for s in transcription["segments"]
            for word in s.get("words", [])
            if word["start"] <= seg.end and word["end"] >= seg.start
        ).strip()

        embedding = get_embedding(samples, sr, start, end)
        if embedding is None:
            continue

        speaker_id = assign_speaker(embedding)

        transcript_segments.append({
            "speaker": speaker_id,
            "start": round(start + offset, 2),
            "end": round(end + offset, 2),
            "text": segment_text,
            "embedding": embedding.tolist(),
        })

    return transcript_segments

def process_audio(file_path: str):
    audio = AudioSegment.from_file(file_path)
    transcript_segments = []

    for chunk_idx, i in enumerate(range(0, len(audio), CHUNK_MS - OVERLAP_MS)):
        chunk = audio[i: i + CHUNK_MS]
        if len(chunk) < CHUNK_MS:
            chunk += AudioSegment.silent(duration=(CHUNK_MS - len(chunk)))

        temp_path = "temp_chunk.wav"
        chunk.export(temp_path, format="wav")

        transcript_segments.extend(
            generate_transcript_segments(temp_path, chunk_idx)
        )

        Path(temp_path).unlink()

    print(f"[INFO] All segments processed: {len(transcript_segments)}")
    return {"transcript_segments": transcript_segments}
