/* eslint-disable max-lines-per-function */
import { Button, Modal } from "@intelli-meeting/shared-ui";
import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useMemo, useState } from "react";
import { MdPause, MdPlayArrow } from "react-icons/md";
import { toast } from "react-toastify";

import {
  useAssignAudioSpeakersMutation,
  usePlayAudioMutation,
  useReadAudioSpeakersQuery,
  useReadManyEmployeeCandidatesQuery,
} from "@/services";

import type { SpeakersModalProps } from "./speakers-modal.type";

import { Table } from "../table";
import { getSpeakerColumns } from "./speakers-modal.constant";

export const SpeakersModal = ({ onClose, audio }: SpeakersModalProps) => {
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);

  const {
    data: speakersData = [],
    error,
    refetch,
  } = useReadAudioSpeakersQuery(audio?.id ? { audioId: audio?.id } : skipToken);

  const { data: employees } = useReadManyEmployeeCandidatesQuery(
    audio?.id ? {} : skipToken
  );

  const [assignAudioSpeakers] = useAssignAudioSpeakersMutation();

  const [playAudio] = usePlayAudioMutation();

  const [values, setValues] = useState<
    { employeeId: string; speakerProfileId: string }[]
  >([]);

  const employeeOptions = employees
    ? employees?.map((employee: any) => ({
        value: String(employee.id),
        label: `${employee.fullName} - ${employee.position.title}`,
      }))
    : [];

  const speakers = useMemo(
    () => speakersData?.speakers || [],
    [speakersData?.speakers],
  );

  useEffect(() => {
    speakers.forEach((sp: any) => {
      if (sp.employee_id) {
        setValues((prevValues) => [
          ...prevValues,
          { speakerProfileId: sp.id, employeeId: sp.employee_id },
        ]);
      }
    });
  }, [speakers]);

  const handlePlayClick = async (row: any) => {
    try {
      const blob = await playAudio({ speakerProfileId: row.id }).unwrap();
      const blobWithMime = new Blob([blob], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(blobWithMime);
      const audioToPlay = new Audio(audioUrl);
      setPlayingAudioId(row.id);
      await audioToPlay.play();
      audioToPlay.onended = () => {
        setPlayingAudioId(null);
      };
    } catch (err) {
      console.error(err);
    }
  };

  const handleSpeakerChange = (
    employeeId: string,
    speakerProfileId: string
  ) => {
    const isExistsBefore = values.some(
      (v) => v.speakerProfileId === speakerProfileId
    );

    if (!isExistsBefore) {
      setValues((prevState) => [
        ...prevState,
        {
          employeeId,
          speakerProfileId,
        },
      ]);
      return;
    }

    if (!employeeId && isExistsBefore) {
      setValues((prevValues) =>
        prevValues.filter((v) => v.speakerProfileId !== speakerProfileId)
      );
      return;
    }

    setValues((prevValues) =>
      prevValues.map((v) => {
        const newValue = { ...v };
        if (newValue.speakerProfileId === speakerProfileId) {
          newValue.employeeId = employeeId;
        }
        return newValue;
      })
    );
  };

  const handleSubmit = async () => {
    await toast.promise(
      assignAudioSpeakers({ values, audioId: audio?.id }).unwrap(),
      {
        pending: "Assigning speakers...",
        success: {
          render: () => {
            onClose();
            return "Speakers assigned successfully!";
          },
        },
        error: "Failed to assign speakers. Please try again.",
      }
    );
  };

  const getSelectInputValue = (speakerProfileId: string) => {
    const selectedSpeakerProfile = values.find(
      (sp) => sp.speakerProfileId === speakerProfileId
    );
    if (selectedSpeakerProfile) return selectedSpeakerProfile.employeeId;
  };

  const columns = getSpeakerColumns(
    employeeOptions,
    getSelectInputValue,
    handleSpeakerChange
  );

  return (
    <Modal size="2xl" title="Speakers" onClose={onClose} open={!!audio?.id}>
      <div className="space-y-4">
        <Table
          data={speakers}
          refetch={refetch}
          title="List of Speakers"
          actions={[
            {
              render: (record) =>
                record.id === playingAudioId ? <MdPause /> : <MdPlayArrow />,
              onActionClick: handlePlayClick,
              title: "Play audio",
            },
          ]}
          columns={columns}
          description="This table shows all speakers of the audio. You can assign them to employees."
          error={!!error}
        />

        <div className="flex justify-end">
          <div className="mt-4 inline-flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
