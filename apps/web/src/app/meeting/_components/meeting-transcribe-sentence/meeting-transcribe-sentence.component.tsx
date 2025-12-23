/* eslint-disable next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable complexity */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable max-lines-per-function */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { confirmation, IconButton } from "@intelli-meeting/shared-ui";
import { motion } from "motion/react";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { LuUserRoundCheck, LuUserRoundMinus } from "react-icons/lu";
import { MdCheck, MdEdit, MdPlayCircle } from "react-icons/md";
import { toast } from "react-toastify";

import { getBounceEffect } from "@/lib/helpers";
import {
  useAssignAudioSpeakersMutation,
  useDeleteAudioTextMutation,
  usePlaySpeakerProfileMutation,
  useUpdateAudioTextMutation,
} from "@/services";

import type { MeetingTranscribeSentenceProps } from "./meeting-transcribe-sentence.type";

export const MeetingTranscribeSentence = ({
  openedTextPopoverId,
  text,
  employees,
  onTranscribeSelect,
}: MeetingTranscribeSentenceProps) => {
  const [playAudio] = usePlaySpeakerProfileMutation();
  const [assignAudioSpeakers] = useAssignAudioSpeakersMutation();
  const [deleteAudioText, { isLoading: isDeletingAudioText }] =
    useDeleteAudioTextMutation();
  const [updateAudioText, { isLoading: isUpdatingAudioText }] =
    useUpdateAudioTextMutation();
  const [currentText, setCurrentText] = useState(text.text);
  const [isEditable, setIsEditable] = useState(false);
  const [_, setPlayingAudioId] = useState<number | null>(null);

  const [isAssignableToEmployee, setIsAssignableToEmployee] =
    useState<boolean>(false);

  const handleShowEmployeesClick = () => {
    setIsEditable(false);
    setIsAssignableToEmployee((prevStatus) => !prevStatus);
  };

  const handlePlayClick = async (speakerProfileId: number) => {
    try {
      const blob = await playAudio({ speakerProfileId }).unwrap();
      const blobWithMime = new Blob([blob], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(blobWithMime);
      const audioToPlay = new Audio(audioUrl);
      setPlayingAudioId(speakerProfileId);
      await audioToPlay.play();
      audioToPlay.onended = () => {
        setPlayingAudioId(null);
      };
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignAudioSpeakers = async (employeeId: number) => {
    await toast.promise(
      assignAudioSpeakers({
        values: [{ employeeId, speakerProfileId: text.id }],
        audioId: text.audio_id,
      }).unwrap(),
      {
        pending: "Assigning speakers...",
        success: {
          render: () => {
            setIsAssignableToEmployee(false);
            onTranscribeSelect(null);
            return "Speakers assigned successfully!";
          },
        },
        error: "Failed to assign speakers. Please try again.",
      }
    );
  };

  const handleEdit = async () => {
    setCurrentText(currentText);
    await toast.promise(
      updateAudioText({
        payload: { newText: currentText },
        speakerProfileId: text.id,
      }).unwrap(),
      {
        pending: "Updating audio text...",
        success: {
          render: () => {
            setIsAssignableToEmployee(false);
            onTranscribeSelect(null);
            setIsEditable(false);
            return "Updating audio text successfully!";
          },
        },
        error: "Failed to update audio text. Please try again.",
      },
    );
  };

  const handleTextDelete = async () => {
    const confirmationDelete = await confirmation({
      confirmText: "Delete",
      cancelText: "Cancel",
      title: "Delete audio text",
      message: "Do you want to delete audio? this action is not undoable",
    });

    if (!confirmationDelete) return;

    await toast.promise(
      deleteAudioText({
        speakerProfileId: text.id,
      }).unwrap(),
      {
        pending: "Deleting audio text...",
        success: {
          render: () => {
            setIsAssignableToEmployee(false);
            onTranscribeSelect(null);
            return "deleting audio text successfully!";
          },
        },
        error: "Failed to delete audio text. Please try again.",
      }
    );
  };

  const handleOnEditClick = () => {
    if (!isEditable) {
      setIsAssignableToEmployee(false);
      setIsEditable(true);
      return;
    }
    handleEdit();
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentText(e.target.value);
  };

  const isLoading = isUpdatingAudioText || isDeletingAudioText;

  return (
    <div className="relative inline py-3">
      {openedTextPopoverId && openedTextPopoverId === Number(text.id) && (
        <motion.div
          className="w-xl right-0 absolute bg-slate-800 py-2 rounded-md z-30 flex flex-col justify-between px-4"
          style={{
            top: "-60px",
          }}
          {...getBounceEffect(0.1, "down")}
        >
          <div className="flex justify-between">
            <div className="flex">
              <img
                className="w-12 rounded-full"
                src={`https://ui-avatars.com/api/?name=${text.employee ? text.employee.fullName : text.initial_speaker_label}`}
              />
              <div className="flex flex-col px-3 justify-center">
                <h3 className="text-slate-300 text-md font-roboto  inline leading-6">
                  {text.employee?.fullName || text.initial_speaker_label}
                </h3>
                <span className="text-slate-400 text-xs font-roboto  inline">
                  {text.employee?.position.title || "Unknown"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IconButton onClick={handleShowEmployeesClick}>
                {!isAssignableToEmployee ? (
                  <LuUserRoundCheck className="text-2xl font-roboto" />
                ) : (
                  <LuUserRoundMinus className="text-2xl font-roboto" />
                )}
              </IconButton>
              <IconButton onClick={handleOnEditClick}>
                {isEditable ? (
                  <MdCheck />
                ) : (
                  <MdEdit className="text-2xl font-roboto" />
                )}
              </IconButton>
              <IconButton onClick={handleTextDelete}>
                <FiTrash2 className="text-2xl font-roboto" />
              </IconButton>
              <IconButton onClick={() => handlePlayClick(text.id)}>
                <MdPlayCircle className="text-2xl font-roboto" />
              </IconButton>
            </div>
          </div>

          {isEditable && !isAssignableToEmployee && (
            <div className="w-full py-4">
              <textarea
                className="bg-slate-600 text-white outline-none px-2 rounded-md w-full"
                value={currentText}
                onChange={handleValueChange}
              />
            </div>
          )}

          {isAssignableToEmployee && !isEditable ? (
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col">
                <h3 className="text-white text-md font-roboto ">
                  Select employee
                </h3>
                <span className="text-sm font-roboto  text-slate-400">
                  Please select an employee for this voice
                </span>
              </div>
              <div className="flex flex-col gap-4 h-48 overflow-y-auto">
                {employees
                  ?.filter((e) => e.id !== text?.employee?.id)
                  .map((employee) => (
                    <div
                      className="flex hover:bg-slate-700 p-3 rounded-md"
                      key={employee.id}
                      onClick={() => handleAssignAudioSpeakers(employee.id)}
                    >
                      <img
                        className="w-12 rounded-full"
                        src="https://ui-avatars.com/api/?name=HamidrezaRamzani"
                      />
                      <div className="flex flex-col px-3 justify-center">
                        <h3 className="text-slate-300 text-md font-roboto  inline leading-6">
                          {employee?.fullName}
                        </h3>
                        <span className="text-slate-400 text-xs font-roboto  inline">
                          {employee?.position
                            ? employee?.position.title
                            : "Unknown"}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : null}
        </motion.div>
      )}
      <p
        className={`inline whitespace-normal p-2 hover:bg-slate-300 caret-red-600 outline-none focus:outline-none ${isLoading ? "bg-loading" : ""}`}
        onClick={() => onTranscribeSelect(text.id)}
      >
        {text.text}
      </p>
    </div>
  );
};
