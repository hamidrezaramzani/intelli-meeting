import type { Audio } from "@/lib/type";

export interface AudioDetailsModalProps {
  onClose: () => void;
  audio: Audio | null;
}
