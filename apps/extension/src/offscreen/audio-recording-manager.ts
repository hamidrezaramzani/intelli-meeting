/**
 * Audio Recording Manager for Chrome Extension
 * Handles simultaneous recording of tab audio and microphone audio
 * with Web Audio API mixing capabilities
 */

export interface RecordingOptions {
  includeTabAudio: boolean;
  includeMicrophone: boolean;
  monitorTabAudio?: boolean;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  isStopped: boolean;
  duration: number;
  recordedUrl?: string;
}

export class AudioRecordingManager {
  private audioContext: AudioContext | null = null;
  private tabStream: MediaStream | null = null;
  private microphoneStream: MediaStream | null = null;
  private mixedStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private recordingStartTime: number = 0;
  private pausedDuration: number = 0;
  private pauseStartTime: number = 0;
  private timerInterval: NodeJS.Timeout | null = null;
  private monitorAudioElement: HTMLAudioElement | null = null;

  // Event callbacks
  private onDataCallback?: (chunk: Blob) => void;
  private onStartCallback?: () => void;
  private onStopCallback?: (url: string) => void;
  private onPauseCallback?: () => void;
  private onResumeCallback?: () => void;
  private onErrorCallback?: (error: Error) => void;
  private onStateChangeCallback?: (state: RecordingState) => void;

  constructor() {
    this.setupEventListeners();
  }

  /**
   * Set up event listeners for cleanup
   */
  private setupEventListeners(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.cleanup();
      });
    }
  }

  /**
   * Set event callbacks
   */
  public setCallbacks(callbacks: {
    onData?: (chunk: Blob) => void;
    onStart?: () => void;
    onStop?: (url: string) => void;
    onPause?: () => void;
    onResume?: () => void;
    onError?: (error: Error) => void;
    onStateChange?: (state: RecordingState) => void;
  }): void {
    this.onDataCallback = callbacks.onData;
    this.onStartCallback = callbacks.onStart;
    this.onStopCallback = callbacks.onStop;
    this.onPauseCallback = callbacks.onPause;
    this.onResumeCallback = callbacks.onResume;
    this.onErrorCallback = callbacks.onError;
    this.onStateChangeCallback = callbacks.onStateChange;
  }

  /**
   * Get current recording state
   */
  public getState(): RecordingState {
    const duration = this.calculateDuration();
    const recordedUrl = this.getRecordedUrl();
    
    return {
      isRecording: this.mediaRecorder?.state === 'recording',
      isPaused: this.mediaRecorder?.state === 'paused',
      isStopped: !this.mediaRecorder || this.mediaRecorder.state === 'inactive',
      duration,
      recordedUrl,
    };
  }

  /**
   * Start recording with specified options
   */
  public async startRecording(
    streamId: string,
    options: RecordingOptions = {
      includeTabAudio: true,
      includeMicrophone: false,
      monitorTabAudio: true,
    }
  ): Promise<void> {
    try {
      console.log('🎙️ AudioRecordingManager: Starting recording with options:', options);
      
      // Clean up any existing recording
      await this.stopRecording();
      this.cleanup();

      // Initialize audio context
      this.audioContext = new AudioContext();
      console.log('🎵 AudioContext created:', this.audioContext.state);

      // Capture audio streams based on options
      const streams: MediaStream[] = [];

      if (options.includeTabAudio) {
        console.log('📺 Capturing tab audio with streamId:', streamId);
        try {
          this.tabStream = await this.captureTabAudio(streamId);
          streams.push(this.tabStream);
          console.log('✅ Tab audio captured successfully');
        } catch (error) {
          console.error('❌ Failed to capture tab audio:', error);
          throw error;
        }
      }

      if (options.includeMicrophone) {
        console.log('🎤 Capturing microphone audio');
        try {
          this.microphoneStream = await this.captureMicrophoneAudio();
          streams.push(this.microphoneStream);
          console.log('✅ Microphone audio captured successfully');
        } catch (error) {
          console.error('❌ Failed to capture microphone audio:', error);
          throw error;
        }
      }

      if (streams.length === 0) {
        const error = new Error('No audio sources selected for recording');
        console.error('❌', error.message);
        throw error;
      }

      // Mix streams using Web Audio API
      console.log('🔀 Mixing audio streams...');
      this.mixedStream = await this.mixAudioStreams(streams);
      console.log('✅ Audio streams mixed successfully');

      // Set up monitoring if tab audio is included
      if (options.includeTabAudio && options.monitorTabAudio && this.tabStream) {
        console.log('🔊 Setting up audio monitoring');
        this.setupAudioMonitoring(this.tabStream);
      }

      // Initialize media recorder
      console.log('⏺️ Initializing MediaRecorder');
      this.mediaRecorder = new MediaRecorder(this.mixedStream, {
        mimeType: this.getSupportedMimeType(),
      });
      console.log('📼 MediaRecorder created with MIME type:', this.getSupportedMimeType());

      // Set up recorder event handlers
      this.setupMediaRecorderEvents();

      // Start recording
      this.mediaRecorder.start(1000); // Collect data every second
      this.recordingStartTime = Date.now();
      this.startTimer();

      console.log('🎙️ Recording started successfully');
      this.notifyStateChange();

    } catch (error) {
      console.error('💥 AudioRecordingManager: Error starting recording:', error);
      this.handleError(error as Error);
    }
  }

  /**
   * Capture tab audio using stream ID
   */
  private async captureTabAudio(streamId: string): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: 'tab',
            chromeMediaSourceId: streamId,
          },
        } as MediaTrackConstraints,
        video: false,
      });

      return stream;
    } catch (error) {
      throw new Error(`Failed to capture tab audio: ${(error as Error).message}`);
    }
  }

  /**
   * Capture microphone audio
   */
  private async captureMicrophoneAudio(): Promise<MediaStream> {
    try {
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
    } catch (error) {
      throw new Error(`Failed to capture microphone audio: ${(error as Error).message}`);
    }
  }

  /**
   * Mix multiple audio streams using Web Audio API
   */
  private async mixAudioStreams(streams: MediaStream[]): Promise<MediaStream> {
    if (!this.audioContext) {
      throw new Error('AudioContext not initialized');
    }

    const destination = this.audioContext.createMediaStreamDestination();

    // Create source nodes for each stream and connect to destination
    for (const stream of streams) {
      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(destination);
    }

    return destination.stream;
  }

  /**
   * Set up audio monitoring for tab audio
   */
  private setupAudioMonitoring(tabStream: MediaStream): void {
    this.stopMonitoringPlayback();

    const monitorStream = new MediaStream(tabStream.getAudioTracks());
    this.monitorAudioElement = new Audio();
    this.monitorAudioElement.autoplay = true;
    this.monitorAudioElement.muted = false;
    this.monitorAudioElement.srcObject = monitorStream;

    this.monitorAudioElement.play().catch((error) => {
      console.warn('Unable to start tab audio monitoring:', error);
    });
  }

  /**
   * Stop monitoring playback
   */
  private stopMonitoringPlayback(): void {
    if (this.monitorAudioElement) {
      this.monitorAudioElement.pause();
      this.monitorAudioElement.srcObject = null;
      this.monitorAudioElement = null;
    }
  }

  /**
   * Set up MediaRecorder event handlers
   */
  private setupMediaRecorderEvents(): void {
    if (!this.mediaRecorder) return;

    this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
        this.onDataCallback?.(event.data);
      }
    };

    this.mediaRecorder.onstart = () => {
      this.onStartCallback?.();
      this.notifyStateChange();
    };

    this.mediaRecorder.onstop = () => {
      const url = this.createRecordingUrl();
      this.onStopCallback?.(url);
      this.notifyStateChange();
    };

    this.mediaRecorder.onpause = () => {
      this.pauseStartTime = Date.now();
      this.onPauseCallback?.();
      this.notifyStateChange();
    };

    this.mediaRecorder.onresume = () => {
      if (this.pauseStartTime > 0) {
        this.pausedDuration += Date.now() - this.pauseStartTime;
        this.pauseStartTime = 0;
      }
      this.onResumeCallback?.();
      this.notifyStateChange();
    };

    this.mediaRecorder.onerror = (event: Event) => {
      const error = new Error(`MediaRecorder error: ${(event as ErrorEvent).message}`);
      this.handleError(error);
    };
  }

  /**
   * Pause recording
   */
  public pauseRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      this.stopTimer();
    }
  }

  /**
   * Resume recording
   */
  public resumeRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      this.startTimer();
    }
  }

  /**
   * Stop recording
   */
  public async stopRecording(): Promise<void> {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.stopTimer();
    }
  }

  /**
   * Reset recording state and data
   */
  public resetRecording(): void {
    this.stopRecording();
    this.cleanup();
    this.recordedChunks = [];
    this.recordingStartTime = 0;
    this.pausedDuration = 0;
    this.pauseStartTime = 0;
    this.notifyStateChange();
  }

  /**
   * Clean up resources
   */
  private cleanup(): void {
    this.stopTimer();
    this.stopMonitoringPlayback();

    // Stop all streams
    [this.tabStream, this.microphoneStream, this.mixedStream].forEach(stream => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    });

    // Close audio context
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }

    // Reset references
    this.tabStream = null;
    this.microphoneStream = null;
    this.mixedStream = null;
    this.mediaRecorder = null;
    this.audioContext = null;
  }

  /**
   * Start duration timer
   */
  private startTimer(): void {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.notifyStateChange();
    }, 1000);
  }

  /**
   * Stop duration timer
   */
  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Calculate recording duration in seconds
   */
  private calculateDuration(): number {
    if (this.recordingStartTime === 0) return 0;

    const elapsed = Date.now() - this.recordingStartTime - this.pausedDuration;
    return Math.floor(elapsed / 1000);
  }

  /**
   * Create recording URL from chunks
   */
  private createRecordingUrl(): string {
    if (this.recordedChunks.length === 0) {
      throw new Error('No recorded data available');
    }

    const blob = new Blob(this.recordedChunks, { 
      type: this.getSupportedMimeType() 
    });
    return URL.createObjectURL(blob);
  }

  /**
   * Get recorded URL
   */
  private getRecordedUrl(): string | undefined {
    try {
      return this.createRecordingUrl();
    } catch {
      return undefined;
    }
  }

  /**
   * Get supported MIME type for MediaRecorder
   */
  private getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/wav',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'audio/webm'; // Fallback
  }

  /**
   * Handle errors
   */
  private handleError(error: Error): void {
    console.error('AudioRecordingManager error:', error);
    this.onErrorCallback?.(error);
    this.cleanup();
    this.notifyStateChange();
  }

  /**
   * Notify state change
   */
  private notifyStateChange(): void {
    this.onStateChangeCallback?.(this.getState());
  }

  /**
   * Get available audio devices
   */
  public static async getAudioDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'audioinput');
    } catch (error) {
      console.error('Failed to enumerate audio devices:', error);
      return [];
    }
  }

  /**
   * Check microphone permissions
   */
  public static async checkMicrophonePermission(): Promise<PermissionState> {
    try {
      const permission = await navigator.permissions.query({ 
        name: 'microphone' as PermissionName 
      });
      return permission.state;
    } catch (error) {
      console.warn('Could not check microphone permission:', error);
      return 'prompt';
    }
  }
}

// Export singleton instance
export const audioRecordingManager = new AudioRecordingManager();
