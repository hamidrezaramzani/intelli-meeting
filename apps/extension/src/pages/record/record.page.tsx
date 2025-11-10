/* eslint-disable max-lines-per-function */
import { confirmation, MainLayout } from "@intelli-meeting/shared-ui";
import { useUploadAudioMutation } from "@intelli-meeting/store";
import { useEffect, useMemo, useRef, useState } from "react";
import { HiOutlineMicrophone } from "react-icons/hi";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import WaveSurfer from "wavesurfer.js";

import { AudioNameModal } from "./sub-components";

export const RecordPage = () => {
  const navigate = useNavigate();

  const [uploadRecordingFile] = useUploadAudioMutation();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const waveRef = useRef<WaveSurfer | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [isSelectAudioNameModalOpen, setIsSelectAudioNameModalOpen] =
    useState(false);

  const formatTime = (inputSeconds: number) => {
    const h = Math.floor(inputSeconds / 3600);
    const m = Math.floor((inputSeconds % 3600) / 60);
    const s = inputSeconds % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const time = useMemo(() => formatTime(seconds), [seconds]);

  useEffect(() => {
    chrome.runtime.sendMessage({
      target: "offscreen",
      type: "check-status",
    });

    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === "recording-stopped") {
        setRecordedUrl(msg.url);
        setIsRecording(false);
        setIsStopped(true);
        setIsPaused(false);
      }

      if (msg.type === "recording-status") {
        setRecordedUrl(msg.url);
        setIsRecording(msg.isRecording);
      }

      if (msg.type === "check-status-info") {
        if (msg.isStopped) {
          setRecordedUrl(msg.url);
          setIsStopped(true);
          setSeconds(msg.time);
        } else {
          setIsRecording(msg.isRecording);
          setIsPaused(msg.isPaused);
          setSeconds(msg.time);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    if (recordedUrl) {
      if (waveRef.current) waveRef.current.destroy();

      const ws = WaveSurfer.create({
        container: containerRef.current,
        waveColor: "rgb(200, 100, 0)",
        progressColor: "rgb(100, 50, 0)",
        url: recordedUrl,
      });

      ws.on("finish", () => setIsPlaying(false));
      waveRef.current = ws;
    }
  }, [recordedUrl]);

  const handleStart = () => {
    chrome.runtime.sendMessage({ type: "start-recording" });
    setIsRecording(true);
    setIsPaused(false);
    setIsStopped(false);
    setRecordedUrl(null);
    setSeconds(0);
  };

  const handleStop = () => {
    chrome.runtime.sendMessage({ target: "offscreen", type: "stop-recording" });
    setIsRecording(false);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    if (isPaused) {
      chrome.runtime.sendMessage({
        target: "offscreen",
        type: "resume-recording",
      });
      setIsPaused(false);
    } else {
      chrome.runtime.sendMessage({
        target: "offscreen",
        type: "pause-recording",
      });
      setIsPaused(true);
    }
  };

  const handlePlayPause = () => {
    const wave = waveRef.current;
    if (!wave) return;
    wave.playPause();
    setIsPlaying((prev) => !prev);
  };

  const uploadRecording = async (name: string) => {
    if (!recordedUrl) {
      console.error("Recorded url not found");
      return false;
    }
    const blob = await fetch(recordedUrl).then((res) => res.blob());

    const file = new File([blob], `${name}.webm`, { type: blob.type });

    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);

    const { success } = await toast.promise(
      uploadRecordingFile(formData).unwrap(),
      {
        pending: "Please wait",
        error: "We have an error",
        success: {
          render: () => {
            navigate("/recording/list");
            return "Audio file uploaded successfully";
          },
        },
      },
    );
    return success;
  };

  const handleReset = () => {
    chrome.storage.local.remove("recordedAudio");
    waveRef.current?.destroy();
    waveRef.current = null;
    setRecordedUrl(null);
    setIsPlaying(false);
    setSeconds(0);
    setIsStopped(false);
    setIsRecording(false);
    setIsSelectAudioNameModalOpen(false);
    chrome.runtime.sendMessage({
      target: "offscreen",
      type: "reset-recording",
    });
  };
  const handleConfirmSelectingAudioName = async (name: string) => {
    const isUploaded = await uploadRecording(name);
    if (isUploaded) handleReset();
  };

  const handleCancelSelectingAudioName = () => {
    setIsSelectAudioNameModalOpen(false);
  };

  const handleSaveClick = () => {
    setIsSelectAudioNameModalOpen(true);
  };

  const handleCancel = async () => {
    const confirmed = await confirmation({
      title: "Cancel recording",
      message:
        "Are you sure you want to cancel this recording? Your progress will be lost.",
      confirmText: "Yes",
      cancelText: "Back",
    });

    if (confirmed) handleReset();
  };

  const renderRecordingActions = () => {
    if (!isRecording && !isStopped) {
      return (
        <div className="flex justify-center items-center gap-4 mt-3">
          <button
            className="px-6 py-2 rounded-full text-white font-semibold shadow bg-brand-400"
            type="button"
            onClick={handleStart}
          >
            Start
          </button>
        </div>
      );
    }

    if (isRecording && !isStopped) {
      return (
        <div className="flex justify-center items-center gap-4 mt-3">
          <button
            type="button"
            onClick={handlePauseResume}
            className={`px-6 py-2 rounded-full text-white font-semibold shadow ${
              isPaused ? "bg-yellow-500" : "bg-red-600"
            }`}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>

          <button
            className="px-6 py-2 rounded-full text-white font-semibold shadow bg-gray-600"
            type="button"
            onClick={handleStop}
          >
            Stop
          </button>
        </div>
      );
    }

    if (!isRecording && isStopped) {
      return (
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
            onClick={handleSaveClick}
          >
            Save
          </button>

          <button
            className="px-6 py-2 rounded-full bg-red-500 text-white font-semibold shadow"
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col justify-center items-center max-w-md mx-auto w-96 px-4 pb-4">
      <AudioNameModal
        onCancel={handleCancelSelectingAudioName}
        onConfirm={handleConfirmSelectingAudioName}
        open={isSelectAudioNameModalOpen}
      />
      <MainLayout navigate={navigate}>
        <div className="w-full flex flex-col justify-center items-center">
          <div
            className={`w-48 h-48 rounded-full cursor-pointer flex justify-center items-center transition-all duration-300 ${
              isRecording ? "bg-red-500" : "bg-brand-600"
            }`}
          >
            <button
              className="flex items-center justify-center"
              type="button"
              onClick={isRecording ? handleStop : handleStart}
            >
              <HiOutlineMicrophone className="text-8xl text-white" />
            </button>
          </div>

          <div className="w-full mt-6" ref={containerRef} />

          <div className="w-full flex flex-col justify-center items-center mt-3">
            <h3 className="text-4xl text-brand-400 font-black">{time}</h3>
            {isPaused && (
              <p className="text-yellow-500 font-semibold mt-1">Paused</p>
            )}
          </div>

          <div className="w-full flex flex-col gap-3 justify-center items-center mt-5">
            {renderRecordingActions()}
          </div>
        </div>
      </MainLayout>
    </div>
  );
};
