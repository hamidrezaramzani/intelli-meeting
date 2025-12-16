import type { Meeting } from "@/services";

export interface MeetingManagementTabProps {
  audios: Meeting["audios"];
  onStartAudioProcessing: (audioId: number) => void;
}
