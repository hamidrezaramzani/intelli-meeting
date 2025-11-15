import { Button, Modal } from "@intelli-meeting/shared-ui";

import type { MeetingDetailsModalProps } from "./meeting-detail-modal.type";

export const MeetingDetailsModal = ({
  meetingDetails,
  onClose,
}: MeetingDetailsModalProps) => {
  if (!meetingDetails) return null;

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  return (
    <Modal title="Meeting Detail" onClose={onClose} open={!!meetingDetails}>
      <div className="space-y-4">
        {Object.entries(meetingDetails).map(([key, value]) => {
          const formattedValue = key.toLowerCase().includes("date")
            ? formatDate(value as string)
            : value || "-";

          return (
            <div key={key}>
              <h3 className="text-lg font-bold mb-1 capitalize">
                {key.replace("_", " ")}
              </h3>
              <p className="text-gray-700">
                {key === "meeting_link" && value ? (
                  <a
                    className="text-blue-500 underline"
                    href={value as string}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Link
                  </a>
                ) : (
                  formattedValue
                )}
              </p>
            </div>
          );
        })}

        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};
