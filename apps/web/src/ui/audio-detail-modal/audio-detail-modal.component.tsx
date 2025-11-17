import { Button, IconButton, Modal } from "@intelli-meeting/shared-ui";
import { MdContentCopy } from "react-icons/md";

import { formatDuration, formatProcessingDuration } from "@/lib/helpers";

import type { AudioDetailsModalProps } from "./audio-detail-modal.type";
import { toast } from "react-toastify";

export const AudioDetailsModal = ({
  onClose,
  audio,
}: AudioDetailsModalProps) => {
  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  const handleTranscriptCopy = async () => {
    if (!audio?.transcript) {
      toast.error("No transcript available");
      return;
    }

    try {
      await navigator.clipboard.writeText(audio.transcript);
      toast.info("Transcript copied to clipboard!");
    } catch {
      toast.error("Failed to copy transcript");
    }
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

        {audio.processing_duration && (
          <div>
            <h3 className="text-lg font-bold mb-1">Process duration</h3>
            <p className="text-gray-700">
              {formatProcessingDuration(audio.processing_duration)}
            </p>
          </div>
        )}

        {audio.transcript && (
          <div>
            <div className="flex justify-between items-center py-5">
              <h3 className="text-lg font-bold mb-1">Transcript</h3>
              <IconButton onClick={handleTranscriptCopy}>
                <MdContentCopy />
              </IconButton>
            </div>
            <div className="text-gray-700 whitespace-pre-wrap border p-2 rounded max-h-[300px] overflow-auto">
              {audio.transcript}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};
