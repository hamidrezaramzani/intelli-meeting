import { Button, Modal } from "@intelli-meeting/shared-ui";

import type { MeetingDetailsModalProps } from "./meeting-detail-modal.type";

export const MeetingDetailsModal = ({
  meetingDetails,
  onClose,
}: MeetingDetailsModalProps) => {
  if (!meetingDetails) return null;

  return (
    <Modal title="Meeting Details" onClose={onClose} open={!!meetingDetails}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold mb-1">Title</h3>
          <p className="text-gray-700">{meetingDetails.title}</p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-1">Description</h3>
          <p className="text-gray-700">{meetingDetails.description || "-"}</p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-1">Date</h3>
          <p className="text-gray-700">{meetingDetails.date}</p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-1">Start Time</h3>
          <p className="text-gray-700">{meetingDetails.start_time}</p>
        </div>

        {meetingDetails.end_time && (
          <div>
            <h3 className="text-lg font-bold mb-1">End Time</h3>
            <p className="text-gray-700">{meetingDetails.end_time}</p>
          </div>
        )}

        {meetingDetails.meeting_link && (
          <div>
            <h3 className="text-lg font-bold mb-1">Meeting Link</h3>
            <a
              className="text-blue-500 underline"
              href={meetingDetails.meeting_link}
              rel="noopener noreferrer"
              target="_blank"
            >
              Join Link
            </a>
          </div>
        )}

        {meetingDetails.employees && meetingDetails.employees.length > 0 && (
          <div>
            <h3 className="text-lg font-bold mb-1">Employees</h3>
            <div className="text-gray-700">
              {meetingDetails.employees.map((e) => (
                <div key={e.id}>
                  {e.fullName} - {e.position.title}
                </div>
              ))}
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
