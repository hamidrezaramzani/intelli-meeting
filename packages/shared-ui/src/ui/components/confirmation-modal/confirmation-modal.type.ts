export interface ConfirmationModalProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface ConfirmationOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}
