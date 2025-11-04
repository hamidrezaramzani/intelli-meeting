let recorder: MediaRecorder;
let data: BlobPart[] = [];
let activeStreams: MediaStream[] = [];
let isRecording = false;
let isPaused = false;
let isStopped = false;
let time = 0;
let interval: ReturnType<typeof setInterval> | null = null;

const getRecordingUrl = () => {
  const blob = new Blob(data, { type: "audio/webm" });
  return URL.createObjectURL(blob);
};

const sendAudioStatus = () => {
  chrome.runtime.sendMessage({
    type: "check-status-info",
    isRecording,
    isPaused,
    isStopped,
    time,
    url: getRecordingUrl(),
  });
};

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.target === "offscreen") {
    switch (message.type) {
      case "start-recording":
        startRecording(message.data);
        break;
      case "pause-recording":
        pauseRecording();
        break;
      case "resume-recording":
        resumeRecording();
        break;
      case "stop-recording":
        stopRecording();
        break;

      case "reset-recording":
        resetRecording();
        break;

      case "check-status":
        sendAudioStatus();
        break;
    }
  }
});

async function startRecording(streamId: string) {
  stopAllStreams();

  try {
    const tabStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: "tab",
          chromeMediaSourceId: streamId,
        },
      },
      video: false,
    });

    activeStreams.push(tabStream);

    const audioContext = new AudioContext();
    const tabSource = audioContext.createMediaStreamSource(tabStream);
    const destination = audioContext.createMediaStreamDestination();
    tabSource.connect(destination);

    recorder = new MediaRecorder(destination.stream, {
      mimeType: "audio/webm",
    });

    recorder.ondataavailable = (e) => {
      data.push(e.data);
    };

    recorder.onstart = () => {
      isRecording = true;
      isPaused = false;
      interval = setInterval(() => {
        time += 1;
        sendAudioStatus();
      }, 1000);
    };

    recorder.onpause = () => {
      isPaused = true;
      if (interval) clearInterval(interval);
    };

    recorder.onresume = () => {
      isPaused = false;
      interval = setInterval(() => {
        time += 1;
        sendAudioStatus();
      }, 1000);
    };

    recorder.onstop = () => {
      chrome.runtime.sendMessage({
        type: "recording-stopped",
        url: getRecordingUrl(),
      });
      isStopped = true;
    };

    recorder.start();
  } catch (error: any) {
    console.error("Error starting recording:", error);
    chrome.runtime.sendMessage({
      type: "recording-error",
      error: error.message,
    });
    isRecording = false;
  }
}

function pauseRecording() {
  if (recorder && recorder.state === "recording") {
    recorder.pause();
  }
}

function resumeRecording() {
  if (recorder && recorder.state === "paused") {
    recorder.resume();
  }
}

function stopRecording() {
  if (recorder && recorder.state !== "inactive") {
    recorder.stop();
    if (interval) clearInterval(interval);
  }
  stopAllStreams();
}

function stopAllStreams() {
  activeStreams.forEach((s) => s.getTracks().forEach((t) => t.stop()));
  activeStreams = [];
}

function resetRecording() {
  if (interval) clearInterval(interval);
  data = [];
  isRecording = false;
  isPaused = false;
  isStopped = false;
  time = 0;
}
