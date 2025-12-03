export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  start_time: string;
  end_time?: string;
  meeting_link?: string;
  employees?: {
    id: number;
    fullName: string;
    position: { id: number; title: string };
  }[];
}
