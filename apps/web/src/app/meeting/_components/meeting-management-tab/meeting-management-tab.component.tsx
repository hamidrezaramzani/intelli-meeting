/* eslint-disable max-lines-per-function */
import {
  AudioPlayer,
  Button,
  confirmation,
  EmptyState,
} from "@intelli-meeting/shared-ui";
import { useState } from "react";
import { toast } from "react-toastify";

import {
  usePlayAudioMutation,
  useReadManyEmployeeCandidatesQuery,
  useStartAudioProcessingMutation,
} from "@/services";

import type { MeetingManagementTabProps } from "./meeting-management-tab.props";

import { MeetingTranscribeSentence } from "../meeting-transcribe-sentence";

export const MeetingManagementTab = ({ audios }: MeetingManagementTabProps) => {
  const [playAudio] = usePlayAudioMutation();
  const { data: employees } = useReadManyEmployeeCandidatesQuery({});

  const [startAudioProcessing] = useStartAudioProcessingMutation();

  const [showTextPopover, setShowTextPopover] = useState<number | null>();

  const handleMeetingSummarySelect = (selectedId: number | null) => {
    setShowTextPopover(
      showTextPopover === Number(selectedId)
        ? null
        : selectedId
          ? Number(selectedId)
          : null,
    );
  };

  const getAudioBlob = async (audioId: number) => {
    const blob = await playAudio({ audioId }).unwrap();
    const blobWithMime = new Blob([blob], { type: "audio/wav" });
    return blobWithMime;
  };

  const handleStartAudioProcessing = async (
    audioId: number,
    status: string,
  ) => {
    let shouldProcessAudio = false;
    switch (status) {
      case "processing": {
        shouldProcessAudio = await confirmation({
          title: "Processing",
          message:
            "This audio is already being processed. Please wait until it completes.",
        });
        return;
      }

      case "failed":
        shouldProcessAudio = await confirmation({
          title: "Processing Failed",
          message: "Previous processing attempt failed. Do you want to retry?",
        });
        break;

      case "pending":
        shouldProcessAudio = true;
        break;
      default:
        break;
    }

    if (shouldProcessAudio) {
      await toast.promise(
        startAudioProcessing({ audioId: String(audioId) }).unwrap(),
        {
          pending: "Starting audio processing...",
          success: "Audio processing started successfully!",
          error:
            "An error occurred while starting the audio processing. Please try again.",
        },
      );
    }
  };

  return (
    <div className="text-gray-800 transition-all cursor-pointer leading-9">
      {audios.length ? (
        audios.map((audio) => (
          <div className="flex flex-col gap-4" key={audio.id}>
            <AudioPlayer
              title={audio.name}
              onPlay={() => getAudioBlob(audio.id)}
            />
            {audio?.status !== "success" && (
              <div
                className={`
      w-full rounded-md items-center gap-3 p-3 flex flex-col text-sm
      ${
        audio.status === "pending"
          ? "bg-blue-50 text-slate-600"
          : audio.status === "processing"
            ? "bg-yellow-50 text-yellow-600"
            : audio.status === "failed"
              ? "bg-red-50 text-red-600"
              : ""
      }
    `}
              >
                {audio.status === "pending" && (
                  <>
                    <p>This recording is waiting to be processed.</p>
                    <Button
                      fullWidth={false}
                      onClick={() =>
                        handleStartAudioProcessing(audio.id, audio.status)
                      }
                    >
                      Start Processing
                    </Button>
                  </>
                )}

                {audio.status === "processing" && (
                  <>
                    <p>The recording is currently being processed...</p>
                    <Button disabled fullWidth={false}>
                      Processing...
                    </Button>
                  </>
                )}

                {audio.status === "failed" && (
                  <>
                    <p>Processing failed. Please try again.</p>
                    <Button
                      fullWidth={false}
                      onClick={() =>
                        handleStartAudioProcessing(audio.id, audio.status)
                      }
                    >
                      Retry
                    </Button>
                  </>
                )}
              </div>
            )}

            <div className="mb-4">
              {audio.speaker_profiles.map((text) => (
                <MeetingTranscribeSentence
                  key={text.id}
                  text={text}
                  employees={employees}
                  onTranscribeSelect={handleMeetingSummarySelect}
                  openedTextPopoverId={showTextPopover}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <EmptyState
          title="No audio available"
          description="There are no audios recorded for this meeting yet"
        />
      )}
    </div>
  );
};
