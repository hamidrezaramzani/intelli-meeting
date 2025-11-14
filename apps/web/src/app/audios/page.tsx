"use client";

import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PiFileAudio } from "react-icons/pi";

import type { Audio } from "@/lib/type";

import { AUDIOS_LIST_COLUMNS } from "@/lib/constant";
import { useReadManyAudiosQuery } from "@/services";
import { AssignAudioToMeetingModal, Dashboard, Table } from "@/ui";

const AudiosPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [audio, setAudio] = useState<Audio | null>(null);
  const limit = 10;
  const { data } = useReadManyAudiosQuery({});
  const handleDelete = (selectedAudioToDelete: Audio) =>
    console.log("Delete", selectedAudioToDelete);

  const audios = data?.audios || [];
  const total = data?.total || 0;

  useAuthRedirect({
    onRedirect: () => router.push("/sign-in"),
    type: "unlogged",
  });

  return (
    <Dashboard backUrl="/dashboard" title="Audios">
      <AssignAudioToMeetingModal audio={audio} onClose={() => setAudio(null)} />
      <Table
        data={audios}
        title="List of audios"
        actions={[
          {
            children: <PiFileAudio />,
            onActionClick: (record) => setAudio(record),
          },
        ]}
        columns={AUDIOS_LIST_COLUMNS}
        description="This table show you all of audios that you record before"
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
