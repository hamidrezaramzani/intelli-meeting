import type { Meeting } from "@/lib/type";

export interface MeetingDetailsModalProps {
  meetingDetails: Meeting | null;
  onClose: () => void;
}
