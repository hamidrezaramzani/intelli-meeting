import { Button } from "@intelli-meeting/shared-ui";

import type { ConfirmationModalProps } from "./confirmation-modal.type";

import { Modal } from "../modal";

export const ConfirmationModal = ({
  open,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => {
  return (
    <Modal title={title} onClose={onCancel} open={open}>
      <p className="text-gray-700">{message}</p>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button type="button" onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};
