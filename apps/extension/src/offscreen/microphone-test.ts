// Simple microphone test for debugging
export async function testMicrophoneAccess(): Promise<boolean> {
  try {
    console.log('Testing microphone access...');
    
    // Check permissions first
    const permission = await navigator.permissions.query({ 
      name: 'microphone' as PermissionName 
    });
    console.log('Microphone permission state:', permission.state);
    
    if (permission.state === 'denied') {
      console.error('Microphone permission denied');
      return false;
    }
    
    // Try to get microphone stream
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 44100,
      },
      video: false,
    });
    
    console.log('Microphone stream obtained successfully');
    console.log('Audio tracks:', stream.getAudioTracks());
    
    // Stop the test stream
    stream.getTracks().forEach(track => track.stop());
    
    return true;
  } catch (error) {
    console.error('Microphone test failed:', error);
    return false;
  }
}

// Test function can be called from browser console
if (typeof window !== 'undefined') {
  (window as any).testMicrophone = testMicrophoneAccess;
}
