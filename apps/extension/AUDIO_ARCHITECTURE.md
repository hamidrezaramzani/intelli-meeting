# Audio Capture and Mixing Architecture

This document explains the architecture for capturing and mixing tab audio and microphone audio in the Chrome Extension.

## Overview

The solution uses the Web Audio API to capture multiple audio sources simultaneously and mix them into a single stream for recording. This enables three recording modes:

1. **Tab Audio Only** - Records audio from the active browser tab
2. **Microphone Only** - Records user's microphone input
3. **Both Tab + Microphone** - Records and mixes both sources simultaneously

## Architecture Components

### 1. Audio Recording Manager (`audio-recording-manager.ts`)

The core class that handles all audio operations:

```typescript
class AudioRecordingManager {
  private audioContext: AudioContext;
  private tabStream: MediaStream;
  private microphoneStream: MediaStream;
  private mixedStream: MediaStream;
  private mediaRecorder: MediaRecorder;
  // ... other properties
}
```

**Key Responsibilities:**
- Stream acquisition and management
- Audio mixing using Web Audio API
- Recording state management
- Error handling and cleanup

### 2. Tab Audio Capture

Uses Chrome's tab capture API:

```typescript
private async captureTabAudio(streamId: string): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      mandatory: {
        chromeMediaSource: 'tab',
        chromeMediaSourceId: streamId,
      },
    },
    video: false,
  });
  return stream;
}
```

**Process:**
1. Background script obtains `streamId` using `chrome.tabCapture.getMediaStreamId()`
2. Offscreen document uses `navigator.mediaDevices.getUserMedia()` with the stream ID
3. Returns a `MediaStream` containing tab audio tracks

### 3. Microphone Audio Capture

Standard WebRTC microphone access:

```typescript
private async captureMicrophoneAudio(): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 44100,
    },
    video: false,
  });
  return stream;
}
```

**Features:**
- Echo cancellation for meeting scenarios
- Noise suppression for cleaner audio
- Auto gain control for consistent levels
- 44.1kHz sample rate for quality

### 4. Audio Mixing Pipeline

The Web Audio API mixing process:

```typescript
private async mixAudioStreams(streams: MediaStream[]): Promise<MediaStream> {
  const audioContext = new AudioContext();
  const destination = audioContext.createMediaStreamDestination();

  // Create source nodes for each stream
  for (const stream of streams) {
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(destination);
  }

  return destination.stream;
}
```

**Mixing Process:**
1. Create `AudioContext` as the audio processing graph
2. Create `MediaStreamAudioSourceNode` for each input stream
3. Create `MediaStreamDestination` as the output node
4. Connect all sources to the destination
5. Return the mixed stream

**Audio Flow:**
```
Tab Audio ──┐
             ├───> AudioContext ──> MediaStreamDestination ──> Mixed Stream
Microphone ──┘
```

### 5. Recording Process

Uses `MediaRecorder` on the mixed stream:

```typescript
this.mediaRecorder = new MediaRecorder(this.mixedStream, {
  mimeType: this.getSupportedMimeType(),
});

this.mediaRecorder.start(1000); // Collect data every second
```

**Features:**
- Automatic MIME type detection
- Chunked data collection
- Real-time state management

## Recording Modes

### Mode 1: Tab Audio Only
```typescript
const options = {
  includeTabAudio: true,
  includeMicrophone: false,
  monitorTabAudio: true,
};
```

### Mode 2: Microphone Only
```typescript
const options = {
  includeTabAudio: false,
  includeMicrophone: true,
  monitorTabAudio: false,
};
```

### Mode 3: Both Tab + Microphone
```typescript
const options = {
  includeTabAudio: true,
  includeMicrophone: true,
  monitorTabAudio: true,
};
```

## State Management

The manager maintains comprehensive state:

```typescript
interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  isStopped: boolean;
  duration: number;
  recordedUrl?: string;
}
```

**State Transitions:**
- `idle` → `recording` → `stopped`
- `recording` ↔ `paused` → `recording`
- Any state → `idle` (reset)

## Error Handling

Comprehensive error handling throughout:

1. **Stream Acquisition Errors**
   - Permission denied
   - Device not found
   - Tab capture restrictions

2. **Audio Context Errors**
   - Context creation failure
   - Node connection issues

3. **Recording Errors**
   - MediaRecorder failures
   - Data corruption
   - Storage issues

## Performance Considerations

### Memory Management
- Stream cleanup on stop/reset
- Audio context closure
- Blob URL revocation

### Latency Optimization
- Direct stream connections (no processing nodes)
- Minimal audio graph complexity
- Efficient chunk collection

### Synchronization
- All streams share the same AudioContext
- Automatic sample rate matching
- Real-time mixing without buffering

## Chrome Extension Integration

### Background Script
- Obtains tab capture stream IDs
- Manages offscreen document lifecycle
- Handles extension messaging

### Offscreen Document
- Hosts the audio recording manager
- Provides DOM context for MediaRecorder
- Handles real-time audio processing

### Content Script
- UI for recording controls
- State synchronization
- User interaction handling

## Security Considerations

### Permissions
- `tabCapture` for tab audio access
- `activeTab` for current tab context
- `offscreen` for audio processing

### Content Security
- Stream isolation per recording session
- Automatic cleanup on page unload
- Secure blob URL handling

## Browser Compatibility

### Chrome Requirements
- Chrome 88+ for `chrome.tabCapture.getMediaStreamId()`
- Chrome 66+ for `MediaStreamAudioSourceNode`
- Chrome 58+ for `MediaRecorder` with audio

### Fallback Strategies
- MIME type detection for different browsers
- Graceful degradation for missing features
- User-friendly error messages

## Usage Example

```typescript
// Initialize manager
const manager = new AudioRecordingManager();

// Set up event handlers
manager.setCallbacks({
  onStart: () => console.log('Recording started'),
  onStop: (url) => console.log('Recording saved:', url),
  onError: (error) => console.error('Recording error:', error),
});

// Start recording with both sources
await manager.startRecording(streamId, {
  includeTabAudio: true,
  includeMicrophone: true,
  monitorTabAudio: true,
});

// Stop recording
await manager.stopRecording();
```

This architecture provides a robust, flexible solution for multi-source audio recording in Chrome extensions, with proper error handling, state management, and performance optimization.
