import type { ChangeEvent, FormEvent } from "react";

import { Button, TextInput } from "@intelli-meeting/shared-ui";
import React, { useState } from "react";

import type { AudioNameModalProps } from "./record-save-modal.type";

export const AudioNameModal: React.FC<AudioNameModalProps> = ({
  open,
  onConfirm,
  onCancel,
}) => {
  const [name, setName] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    onConfirm(name.trim());
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Name your recording
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <TextInput
            label="Name"
            type="text"
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
      </div>
    </div>
  );
};
