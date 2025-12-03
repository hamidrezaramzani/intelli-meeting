export interface AudioNameModalProps {
  open: boolean;
  defaultValue?: string;
  onConfirm: (name: string, meetingId: string) => void;
  onCancel: () => void;
}
