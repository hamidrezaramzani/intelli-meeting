export interface Audio {
  id: string;
  name: string;
  date?: string;
  duration: string;
  status: string;
  file_path: string;
  transcript?: string;
  meeting?: {
    id: number;
    title: string;
  };
}
