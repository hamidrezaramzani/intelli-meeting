"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Modal,
  SelectInput,
  TextInput,
} from "@intelli-meeting/shared-ui";
import { useReadMeetingCandidatesQuery } from "@intelli-meeting/store";
import { useForm } from "react-hook-form";

import type { AudioNameFormValues } from "./record-save-moda.schema";
import type { AudioNameModalProps } from "./record-save-modal.type";

import { audioNameSchema } from "./record-save-moda.schema";

export const AudioNameModal = ({
  open,
  onConfirm,
  onCancel,
}: AudioNameModalProps) => {
  const { data: meetings } = useReadMeetingCandidatesQuery({});

  const meetingOptions = meetings?.length
    ? meetings.map((meeting: any) => ({
        label: meeting.title,
        value: meeting.id,
      }))
    : [];

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
  } = useForm<AudioNameFormValues>({
    resolver: zodResolver(audioNameSchema),
    defaultValues: {
      name: "",
      meetingId: "",
    },
  });

  const onSubmit = (data: AudioNameFormValues) => {
    onConfirm(data.name.trim(), data.meetingId);
    reset();
  };

  return (
    <Modal title="Save your recording" onClose={onCancel} open={open}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <SelectInput
          label="Meeting"
          options={meetingOptions}
          {...register("meetingId")}
          error={touchedFields.meetingId ? errors.meetingId?.message : ""}
        />

        <TextInput
          label="Name"
          type="text"
          placeholder="Enter audio name..."
          {...register("name")}
          error={touchedFields.name ? errors.name?.message : ""}
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
