import type { Meeting } from "@/services/api/meetings/api-meetings.type";

export interface MeetingTranscribeSentenceProps {
  openedTextPopoverId?: number | null;
  text: Meeting["audios"][number]["speaker_profiles"][number];
  employees?: {
    id: number;
    fullName: string;
    position: { title: string };
  }[];
  onTranscribeSelect: (id: number | null) => void;
}
