/* eslint-disable max-lines-per-function */
import { MainLayout } from "@intelli-meeting/shared-ui";
import { useEffect, useRef, useState } from "react";
import { HiOutlineMicrophone } from "react-icons/hi";
import { useNavigate } from "react-router";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";

export const RecordPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const liveWaveRef = useRef<WaveSurfer | null>(null);
  const recordRef = useRef<any>(null);
  const playbackRef = useRef<WaveSurfer | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState("00:00");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const createLiveWave = () => {
    if (liveWaveRef.current) liveWaveRef.current.destroy();

    const ws = WaveSurfer.create({
      container: containerRef.current!,
      waveColor: "rgb(0, 40, 200)",
      progressColor: "rgb(5, 13, 40)",
    });

    const record = ws.registerPlugin(
      RecordPlugin.create({
        renderRecordedAudio: false,
        scrollingWaveform: true,
        continuousWaveform: false,
      }),
    );

    liveWaveRef.current = ws;
    recordRef.current = record;

    record.on("record-progress", (ms: number) => {
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setTime(
        `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`,
      );
    });

    record.on("record-end", (blob: Blob) => {
      setRecordedBlob(blob);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      renderPlaybackWave(blob);
    });
  };

  const renderPlaybackWave = (blob: Blob) => {
    if (liveWaveRef.current) {
      liveWaveRef.current.destroy();
      liveWaveRef.current = null;
    }
    if (playbackRef.current) playbackRef.current.destroy();

    const playback = WaveSurfer.create({
      container: containerRef.current!,
      waveColor: "rgb(200, 100, 0)",
      progressColor: "rgb(100, 50, 0)",
      url: URL.createObjectURL(blob),
    });

    playback.on("finish", () => setIsPlaying(false));
    playbackRef.current = playback;
  };

  useEffect(() => {
    createLiveWave();
    return () => {
      liveWaveRef.current?.destroy();
      playbackRef.current?.destroy();
    };
  }, []);

  const handleStartStop = async () => {
    const record = recordRef.current;
    if (!record) return;

    if (isRecording) {
      record.stopRecording();
      setIsRecording(false);
      setIsPaused(false);
    } else {
      await record.startRecording();
      setIsRecording(true);
      setRecordedBlob(null);
      setTime("00:00");
    }
  };

  const handlePauseResume = () => {
    const record = recordRef.current;
    if (!record || !isRecording) return;

    if (isPaused) {
      record.resumeRecording();
      setIsPaused(false);
    } else {
      record.pauseRecording();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    const record = recordRef.current;
    if (!record) return;

    record.stopRecording();
    setIsRecording(false);
    setIsPaused(false);
  };

  const handlePlayPause = () => {
    const playback = playbackRef.current;
    if (!playback) return;

    playback.playPause();
    setIsPlaying((prev) => !prev);
  };
  const handleSave = () => {
    if (playbackRef.current) {
      playbackRef.current.destroy();
      playbackRef.current = null;
    }

    setRecordedBlob(null);
    setIsPlaying(false);
    setTime("00:00");
    setIsRecording(false);
    setIsPaused(false);

    createLiveWave();
  };

  return (
    <div className="flex flex-col justify-center items-center max-w-md mx-auto w-96 px-4 pb-4">
      <MainLayout navigate={navigate}>
        <div className="w-full flex flex-col justify-center items-center">
          <div
            className={`w-48 h-48 rounded-full cursor-pointer flex justify-center items-center ${
              isRecording ? "bg-red-500" : "bg-brand-600"
            } transition-all duration-300`}
          >
            <button
              className="flex items-center justify-center"
              type="button"
              onClick={handleStartStop}
            >
              <HiOutlineMicrophone className="text-8xl text-white" />
            </button>
          </div>

          {/* waveform */}
          <div className="w-full mt-6" ref={containerRef} />

          {/* تایمر */}
          <div className="w-full flex flex-col justify-center items-center mt-3">
            <h3 className="text-4xl text-brand-400 font-black">{time}</h3>
          </div>

          {/* کنترل‌ها */}
          <div className="w-full flex flex-col gap-3 justify-center items-center mt-5">
            <h3 className="text-xl text-slate-700">
              {!recordedBlob
                ? !isRecording
                  ? "Tap to start recording"
                  : isPaused
                    ? "Paused"
                    : "Recording..."
                : "Preview your recording"}
            </h3>

            {/* کنترل ضبط */}
            {!recordedBlob ? (
              <div className="flex justify-center items-center gap-4 mt-3">
                {isRecording && (
                  <>
                    <button
                      className="px-6 py-2 rounded-full bg-yellow-400 text-white font-semibold shadow"
                      type="button"
                      onClick={handlePauseResume}
                    >
                      {isPaused ? "Resume" : "Pause"}
                    </button>

                    <button
                      className="px-6 py-2 rounded-full bg-red-600 text-white font-semibold shadow"
                      type="button"
                      onClick={handleStop}
                    >
                      Stop
                    </button>
                  </>
                )}

                {!isRecording && (
                  <button
                    className="px-6 py-2 rounded-full bg-brand-400 text-white font-semibold shadow"
                    type="button"
                    onClick={handleStartStop}
                  >
                    Start
                  </button>
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center gap-4 mt-3">
                <button
                  className="px-6 py-2 rounded-full bg-brand-500 text-white font-semibold shadow"
                  type="button"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>

                <button
                  className="px-6 py-2 rounded-full bg-green-600 text-white font-semibold shadow"
                  type="button"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </div>
  );
};
