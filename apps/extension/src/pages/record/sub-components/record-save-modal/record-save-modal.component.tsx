import type { ChangeEvent, FormEvent } from "react";

import { Button, Modal, TextInput } from "@intelli-meeting/shared-ui";
import { useState } from "react";

import type { AudioNameModalProps } from "./record-save-modal.type";

export const AudioNameModal = ({
  open,
  onConfirm,
  onCancel,
}: AudioNameModalProps) => {
  const [name, setName] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    onConfirm(name.trim());
    setName("");
  };

  return (
    <Modal title="Name your recording" onClose={onCancel} open={open}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          label="Name"
          type="text"
          value={name}
          onChange={handleChange}
          placeholder="Enter audio name..."
        />

        <div className="flex justify-end gap-2">
          <Button className="min-w-[80px]" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="min-w-[100px]" type="submit">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};
