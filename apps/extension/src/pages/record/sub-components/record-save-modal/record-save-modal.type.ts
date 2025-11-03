export interface AudioNameModalProps {
  open: boolean;
  defaultValue?: string;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}
