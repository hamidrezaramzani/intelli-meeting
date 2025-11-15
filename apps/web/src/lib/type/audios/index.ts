export interface Audio {
  id: string;
  name: string;
  date?: string;
  duration: string;
  status: string;
  file_path: string;
  transcript?: string;
  processing_duration?: string;
  meeting?: {
    id: number;
    title: string;
  };
}
