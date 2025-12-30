export interface AudioPlayerProps {
  onPlay: () => Promise<Blob>;
  title?: string;
  onDelete?: () => Promise<void>;
  onReset?: () => Promise<void>;
  isPlayable?: boolean;
}
