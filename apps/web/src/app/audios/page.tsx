"use client";

import { confirmation } from "@intelli-meeting/shared-ui";
import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdRemoveRedEye } from "react-icons/md";
import { PiFileAudio } from "react-icons/pi";
import { VscDebugStart } from "react-icons/vsc";
import { toast } from "react-toastify";

import type { Audio } from "@/lib/type";

import { AUDIOS_LIST_COLUMNS } from "@/lib/constant";
import {
  useReadManyAudiosQuery,
  useStartAudioProcessingMutation,
} from "@/services";
import {
  AssignAudioToMeetingModal,
  AudioDetailsModal,
  Dashboard,
  Table,
} from "@/ui";

const AudiosPage = () => {
  const router = useRouter();

  const [startAudioProccessing] = useStartAudioProcessingMutation();
  const { data, error, refetch } = useReadManyAudiosQuery({});
  const [modal, setModal] = useState<"assign" | "details" | null>(null);
  const [page, setPage] = useState(1);
  const [audio, setAudio] = useState<Audio | null>(null);
  const limit = 10;
  const handleDelete = (selectedAudioToDelete: Audio) =>
    console.log("Delete", selectedAudioToDelete);

  const audios = data?.audios || [];
  const total = data?.total || 0;

  useAuthRedirect({
    onRedirect: () => router.push("/sign-in"),
    type: "unlogged",
  });

  const handleStartAudioProcessing = async (
    audioId: string,
    status: string,
  ) => {
    switch (status) {
      case "processing":
        await confirmation({
          title: "Processing",
          message:
            "This audio is already being processed. Please wait until it completes.",
        });
        return;

      case "success":
        await confirmation({
          title: "Already Processed",
          message: "This audio has already been processed successfully.",
        });
        return;

      case "failed":
        await confirmation({
          title: "Processing Failed",
          message: "Previous processing attempt failed. Do you want to retry?",
        });
        break;

      case "pending":
      default:
        break;
    }

    await toast.promise(startAudioProccessing({ audioId }).unwrap(), {
      pending: "Starting audio processing...",
      success: "Audio processing started successfully!",
      error:
        "An error occurred while starting the audio processing. Please try again.",
    });
  };

  return (
    <Dashboard backUrl="/dashboard" title="Audios">
      <AssignAudioToMeetingModal
        audio={modal === "assign" ? audio : null}
        onClose={() => setAudio(null)}
      />
      <AudioDetailsModal
        audio={modal === "details" ? audio : null}
        onClose={() => setAudio(null)}
      />
      <Table
        data={audios}
        refetch={refetch}
        title="List of audios"
        actions={[
          {
            children: <PiFileAudio />,
            onActionClick: (record) => {
              setModal("assign");
              setAudio(record);
            },
          },
          {
            children: <VscDebugStart />,
            onActionClick: (record) =>
              handleStartAudioProcessing(record.id, record.status),
            title: "Start converting audio to text process",
          },
          {
            children: <MdRemoveRedEye />,
            onActionClick: (record) => {
              setModal("details");
              setAudio(record);
            },
          },
        ]}
        columns={AUDIOS_LIST_COLUMNS}
        description="This table show you all of audios that you record before"
        error={!!error}
        onDelete={handleDelete}
        pagination={{
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          onPageChange: setPage,
        }}
      />
    </Dashboard>
  );
};

export default AudiosPage;
