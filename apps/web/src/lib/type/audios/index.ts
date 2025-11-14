export interface Audio {
  id: string;
  name: string;
  date?: string;
  duration: string;
  file_path: string;
  meeting?: {
    id: number;
    title: string;
  };
}
