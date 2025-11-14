import type { SelectInputProps } from "@intelli-meeting/shared-ui";

import { Button, Modal, SelectInput } from "@intelli-meeting/shared-ui";
import { useState } from "react";
import { toast } from "react-toastify";

import type { Meeting } from "@/lib/type";

import {
  useAssignAudioToMeetingMutation,
  useReadMeetingCandidatesQuery,
} from "@/services";

import type { AssignAudioToMeetingModalProps } from "./assign-audio-to-meeting-modal.type";

export const AssignAudioToMeetingModal = ({
  onClose,
  audio,
}: AssignAudioToMeetingModalProps) => {
  const { data } = useReadMeetingCandidatesQuery({});
  const [assignAudioToMeeting, { isLoading }] =
    useAssignAudioToMeetingMutation();
  const [meetingId, setMeetingId] = useState<string | undefined>();
  const meetings = data?.meetings || [];
  const meetingOptions = [
    { label: "Select a meeting...", value: undefined },
    ...meetings.map((meeting: Meeting) => ({
      label: meeting.title,
      value: meeting.id,
    })),
  ];

  const handleMeetingChange: SelectInputProps["onChange"] = (e) => {
    const value = e.target.value;
    setMeetingId(value);
  };

  const handleAssignClick = async () => {
    if (isNaN(Number(meetingId))) {
      return;
    }
    void toast.promise(
      assignAudioToMeeting({
        meeting_id: meetingId,
        audio_id: audio?.id,
      }).unwrap(),
      {
        pending: "Please wait",
        error:
          "We have an error when assigning audio to meeting, please try again",
        success: {
          render: () => {
            onClose();
            return "Meeting assigned successfully";
          },
        },
      },
    );
  };

  return (
    <Modal
      title="Assign an audio to the meeting"
      onClose={onClose}
      open={!!audio}
    >
      {audio && (
        <form>
          <h3 className="font-bold mb-3">Audio: {audio.name}</h3>
          <SelectInput
            label="Meeting"
            value={meetingId}
            onChange={handleMeetingChange}
            options={meetingOptions}
          />
          <Button disabled={isLoading} onClick={handleAssignClick}>
            Assign
          </Button>
        </form>
      )}
    </Modal>
  );
};
