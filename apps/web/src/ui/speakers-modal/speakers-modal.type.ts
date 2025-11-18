import type { Audio } from "@/lib/type";

export interface SpeakersModalProps {
  audio: Audio | null;
  onClose: () => void;
}
