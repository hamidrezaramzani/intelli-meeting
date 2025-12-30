import type { ConfirmationOptions } from "../confirmation-modal/confirmation-modal.type";

export interface AudioPlayerProps {
  onPlay: () => Promise<Blob>;
  title?: string;
  onDelete?: () => Promise<void>;
  onReset?: () => Promise<void>;
  isPlayable?: boolean;
  deleteConfirmation?: ConfirmationOptions;
  resetConfirmation?: ConfirmationOptions;
  loadingMessage?: string;
  clickToPlayLabel?: string;
}
