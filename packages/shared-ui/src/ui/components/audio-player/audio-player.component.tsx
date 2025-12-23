/* eslint-disable max-lines-per-function */
import { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay, FaTrash } from "react-icons/fa";
import WaveSurfer from "wavesurfer.js";

import type { AudioPlayerProps } from "./audio-player.type";

import { confirmation } from "../confirmation-modal";
import { IconButton } from "../icon-button";

export const AudioPlayer = ({ onPlay, title, onDelete }: AudioPlayerProps) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  const [blobUrl, setBlobUrl] = useState<string | undefined>();
  const [isLoading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
  };

  useEffect(() => {
    if (!waveformRef.current) return;

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#94a3b8",
      progressColor: "#0ea5e9",
      cursorColor: "#1e293b",
      height: 60,
      backend: "MediaElement",
    });

    wavesurfer.current.on("ready", () => {
      setDuration(wavesurfer.current!.getDuration());
    });

    wavesurfer.current.on("audioprocess", () => {
      if (wavesurfer.current) {
        setCurrentTime(wavesurfer.current.getCurrentTime());
      }
    });

    wavesurfer.current.on("finish", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => wavesurfer.current?.destroy();
  }, []);

  useEffect(() => {
    if (blobUrl) {
      wavesurfer.current?.load(blobUrl);
      wavesurfer.current?.playPause();
    }
  }, [blobUrl]);

  const togglePlay = async () => {
    if (!wavesurfer.current) return;

    if (!isPlaying && !blobUrl) {
      setLoading(true);
      const audioStreamBlob = await onPlay();
      const createdBlobUrl = URL.createObjectURL(audioStreamBlob);
      setBlobUrl(createdBlobUrl);
      setLoading(false);
    }

    wavesurfer.current.playPause();
    setIsPlaying(!isPlaying);
  };

  const handleDelete = async () => {
    const confirmed = await confirmation({
      title: "Delete audio",
      message:
        "Are you sure you want to delete this audio? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    try {
      setLoading(true);
      await onDelete?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-800 rounded-lg p-4 flex flex-col gap-2">
      {title && blobUrl && (
        <div className="text-slate-50 text-sm font-roboto  font-medium text-center">
          {title}
        </div>
      )}

      <div className="relative w-full h-[60px] rounded-md overflow-hidden">
        <div
          aria-hidden={!blobUrl}
          className="w-full h-full cursor-pointer"
          ref={waveformRef}
        />

        {(!blobUrl || isLoading) && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-slate-800/60
                     backdrop-blur-sm pointer-events-none"
          >
            {isLoading ? (
              <div className="flex items-center gap-2 bg-slate-700/40 h-20 animate-pulse text-sm font-roboto  text-white justify-center w-11/12 rounded-md">
                Please wait to load
              </div>
            ) : (
              <div className="w-11/12 h-30 bg-slate-700/40 flex gap-1 flex-col items-center justify-center rounded-md">
                <div className="text-slate-50 text-sm font-roboto  font-medium text-center">
                  {title}
                </div>
                <span className="ml-3 text-xs font-roboto  text-slate-400">
                  Click to play
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-slate-200 mt-2 gap-2">
        <span className="w-[48px]">{formatTime(currentTime)}</span>

        <div className="flex items-center gap-2">
          <IconButton
            type="button"
            variant="primary"
            isLoading={isLoading}
            onClick={togglePlay}
          >
            {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
          </IconButton>

          {onDelete && (
            <IconButton
              type="button"
              variant="default"
              isLoading={isLoading}
              onClick={handleDelete}
            >
              <FaTrash size={16} />
            </IconButton>
          )}
        </div>

        <span className="w-[48px]">{formatTime(duration)}</span>
      </div>
    </div>
  );
};
