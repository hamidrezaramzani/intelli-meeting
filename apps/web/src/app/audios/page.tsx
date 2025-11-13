"use client";

// import { Modal } from "@intelli-meeting/shared-ui";
import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { MdRemoveRedEye } from "react-icons/md";

import type { Audio } from "@/lib/type";

import { AUDIOS_LIST_COLUMNS } from "@/lib/constant";
// import { useReadManyMeetingsQuery } from "@/services";
import { Dashboard, Table } from "@/ui";

const AudiosPage = () => {
  const router = useRouter();
  // const [page, setPage] = useState(1);
  // const [meetingDetails, setMeetingDetails] = useState<Meeting | null>(null);
  // const limit = 10;
  // const { data } = useReadManyMeetingsQuery({});
  const handleDelete = (audio: Audio) => console.log("Delete", audio);

  // const meetings = data?.meetings || [];
  // const total = data?.total || 0;

  useAuthRedirect({
    onRedirect: () => router.push("/sign-in"),
    type: "unlogged",
  });

  return (
    <Dashboard backUrl="/dashboard" title="Audios">
      <Table
        data={[]}
        title="List of audios"
        columns={AUDIOS_LIST_COLUMNS}
        description="This table show you all of audios that you record before"
        onDelete={handleDelete}
        // pagination={{
        //   currentPage: page,
        //   totalPages: Math.ceil(total / limit),
        //   onPageChange: setPage,
        // }}
      />
    </Dashboard>
  );
};

export default AudiosPage;
