/* eslint-disable max-lines-per-function */
import {
  AudioPlayer,
  Button,
  confirmation,
  EmptyState,
} from "@intelli-meeting/shared-ui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  useDeleteAudioMutation,
  usePlayAudioMutation,
  useReadManyEmployeeCandidatesQuery,
  useResetAudioMutation,
} from "@/services";

import type { MeetingManagementTabProps } from "./meeting-management-tab.props";

import { MeetingTranscribeSentence } from "../meeting-transcribe-sentence";

export const MeetingManagementTab = ({
  audios,
  onStartAudioProcessing,
}: MeetingManagementTabProps) => {
  const { t } = useTranslation();

  const [playAudio] = usePlayAudioMutation();
  const [deleteAudio] = useDeleteAudioMutation();
  const [resetAudio] = useResetAudioMutation();
  const { data: employees } = useReadManyEmployeeCandidatesQuery({});

  const [showTextPopover, setShowTextPopover] = useState<number | null>();

  const handleMeetingSummarySelect = (selectedId: number | null) => {
    setShowTextPopover(
      showTextPopover === Number(selectedId)
        ? null
        : selectedId
          ? Number(selectedId)
          : null
    );
  };

  const getAudioBlob = async (audioId: number) => {
    const blob = await playAudio({ audioId }).unwrap();
    const blobWithMime = new Blob([blob], { type: "audio/wav" });
    return blobWithMime;
  };

  const handleStartAudioProcessing = async (
    audioId: number,
    status: string
  ) => {
    let shouldProcessAudio = false;
    switch (status) {
      case "processing": {
        shouldProcessAudio = await confirmation({
          title: t("audio:status.processingTitle"),
          message: t("audio:status.processingMessage"),
          confirmText: t("common:confirm"),
          cancelText: t("common:cancel"),
        });
        return;
      }

      case "failed":
        shouldProcessAudio = await confirmation({
          title: t("audio:status.failedTitle"),
          message: t("audio:status.failedMessage"),
          confirmText: t("common:confirm"),
          cancelText: t("common:cancel"),
        });
        break;

      case "pending":
        shouldProcessAudio = true;
        break;
      default:
        break;
    }
    console.log(shouldProcessAudio, audioId, status);
    if (shouldProcessAudio) {
      onStartAudioProcessing(audioId);
    }
  };

  const handleAudioDelete = async (audioId: number) => {
    await toast.promise(
      deleteAudio({
        params: { audioId },
      }).unwrap(),
      {
        pending: t("common:deletingThing", { thing: t("audio:audio") }),
        success: {
          render: () => {
            return t("common:thingDeleted", { thing: t("audio:audio") });
          },
        },
        error: t("common:operationFailed"),
      },
    );
  };

  const handleAudioReset = async (audioId: number) => {
    await toast.promise(
      resetAudio({
        params: { audioId },
      }).unwrap(),
      {
        pending: t("common:updatingThing", { thing: t("audio:audio") }),
        success: {
          render: () => {
            return t("common:thingUpdated", { thing: t("audio:audio") });
          },
        },
        error: t("common:operationFailed"),
      },
    );
  };

  return (
    <div className="text-gray-800 transition-all cursor-pointer leading-9">
      {audios.length ? (
        audios.map((audio) => (
          <div className="flex flex-col gap-4" key={audio.id}>
            <AudioPlayer
              isPlayable={audio.status === "success"}
              title={audio.name}
              clickToPlayLabel={t("audio:player.clickToPlay")}
              deleteConfirmation={{
                title: t("audio:confirm.deleteTitle"),
                message: t("audio:confirm.deleteMessage"),
                confirmText: t("common:delete"),
                cancelText: t("common:cancel"),
              }}
              loadingMessage={t("audio:player.loadingMessage")}
              onDelete={() => handleAudioDelete(audio.id)}
              onPlay={() => getAudioBlob(audio.id)}
              onReset={
                audio.status === "success"
                  ? () => handleAudioReset(audio.id)
                  : undefined
              }
              resetConfirmation={{
                title: t("audio:confirm.resetTitle"),
                message: t("audio:confirm.resetMessage"),
                confirmText: t("common:reset"),
                cancelText: t("common:cancel"),
              }}
            />
            {audio?.status !== "success" && (
              <div
                className={`
      w-full rounded-md items-center gap-3 p-3 flex flex-col text-sm font-roboto 
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
                    <p>{t("audio:status.pendingMessage")}</p>
                    <Button
                      fullWidth={false}
                      onClick={() =>
                        handleStartAudioProcessing(audio.id, audio.status)
                      }
                    >
                      {t("audio:status.startProcessing")}
                    </Button>
                  </>
                )}

                {audio.status === "processing" && (
                  <>
                    <p>{t("audio:status.processingBanner")}</p>
                    <Button disabled fullWidth={false}>
                      {t("audio:status.processingButton")}
                    </Button>
                  </>
                )}

                {audio.status === "failed" && (
                  <>
                    <p>{t("audio:status.failedBanner")}</p>
                    <Button
                      fullWidth={false}
                      onClick={() =>
                        handleStartAudioProcessing(audio.id, audio.status)
                      }
                    >
                      {t("common:retry")}
                    </Button>
                  </>
                )}
              </div>
            )}
            {audio.status === "success" && (
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
            )}
          </div>
        ))
      ) : (
        <EmptyState
          title={t("audio:empty.title")}
          description={t("audio:empty.description")}
        />
      )}
    </div>
  );
};
