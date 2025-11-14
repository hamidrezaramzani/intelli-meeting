import { Button, Modal } from "@intelli-meeting/shared-ui";
import { useState } from "react";

import type { AudioDetailsModalProps } from "./audio-detail-modal.type";

export const AudioDetailsModal = ({
  onClose,
  audio,
}: AudioDetailsModalProps) => {
  const [expanded, setExpanded] = useState(false);

  const preview = audio?.transcript?.slice(0, 300);

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  const formatDuration = (minutesString: string) => {
    const minutes = Number(minutesString);
    const totalSeconds = Math.round(minutes * 60);

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return h > 0
      ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  if (!audio) return null;
  return (
    <Modal title="Audio Details" onClose={onClose} open={!!audio}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold mb-1">Name</h3>
          <p className="text-gray-700">{audio.name}</p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-1">Status</h3>
          <span
            className={`inline-block w-3 h-3 rounded-full mr-2 align-middle ${
              audio.status === "pending"
                ? "bg-gray-400"
                : audio.status === "processing"
                  ? "bg-yellow-400"
                  : audio.status === "success"
                    ? "bg-green-500"
                    : "bg-red-500"
            }`}
          ></span>
          <span className="align-middle capitalize">{audio.status}</span>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-1">Duration</h3>
          <p className="text-gray-700">{formatDuration(audio.duration)}</p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-1">Uploaded At</h3>
          <p className="text-gray-700">{formatDate(audio.date)}</p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-1">Meeting</h3>
          <p className="text-gray-700">
            {audio.meeting
              ? `${audio.meeting.title} (ID: ${audio.meeting.id})`
              : "-"}
          </p>
        </div>

        {audio.transcript && (
          <div>
            <h3 className="text-lg font-bold mb-1">Transcript</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {expanded ? audio.transcript : `${preview}...`}
            </p>

            {audio.transcript.length > 300 && (
              <button
                className="text-brand-600 mt-2 underline"
                type="button"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};
