interface Position {
  id: number;
  title: string;
}
interface Employee {
  id: number;
  fullName: string;
  position: Position;
}

interface SpeakerProfile {
  audio_id: number;
  employee: Employee;
  id: number;
  initial_speaker_label: string;
  text: string;
}

interface Audio {
  id: number;
  date: Date;
  duration: string;
  file_path: string;
  name: string;
  processing_duration: string;
  speaker_profiles: SpeakerProfile[];
  status: string;
  transcript: string;
  is_processing?: boolean;
}

export interface Meeting {
  id: number;
  title: string;
  date: string;
  description: string;
  start_time: string;
  end_time: string;
  meeting_link: string;
  audios: Audio[];
  employees: Employee[];
}

export interface ReadOneMeetingResponse {
  meeting: Meeting;
  success: boolean;
}
