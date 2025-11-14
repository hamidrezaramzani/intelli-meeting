import type { Audio } from "@/lib/type";

export interface AssignAudioToMeetingModalProps {
  onClose: () => void;
  audio: Audio | null;
}
