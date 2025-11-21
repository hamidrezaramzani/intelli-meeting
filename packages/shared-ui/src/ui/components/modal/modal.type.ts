export interface ModalProps {
  open: boolean;
  title?: string;
  onClose?: () => void;
  children: React.ReactNode;
  size?: "2xl" | "lg" | "md" | "sm" | "xl" | "xs";
}
