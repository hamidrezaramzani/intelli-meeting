export interface AudioPlayerProps {
  onPlay: () => Promise<Blob>;
  title?: string;
}
