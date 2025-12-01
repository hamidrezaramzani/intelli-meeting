"use client";

import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdRemoveRedEye } from "react-icons/md";

import type { Meeting } from "@/lib/type";

import { MEETINGS_LIST_COLUMNS } from "@/lib/constant";
import { useReadManyMeetingsQuery } from "@/services";
import { Dashboard, MeetingDetailsModal, Table } from "@/ui";

const MeetingsPage = () => {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const limit = 10;
  const [meetingDetails, setMeetingDetails] = useState<Meeting | null>(null);
  const { data, isLoading } = useReadManyMeetingsQuery({});
  const handleEdit = (meeting: Meeting) => console.log("Edit", meeting);
  const handleDelete = (meeting: Meeting) => console.log("Delete", meeting);

  const meetings = data?.meetings || [];
  const total = data?.total || 0;

  useAuthRedirect({
    onRedirect: () => router.push("/sign-in"),
    type: "unlogged",
  });

  return (
    <Dashboard title="Meetings">
      <MeetingDetailsModal
        meetingDetails={meetingDetails}
        onClose={() => setMeetingDetails(null)}
      />
      <Table
        data={meetings}
        title="List of meetings"
        actions={[
          {
            children: <MdRemoveRedEye />,
            onActionClick: (row) => setMeetingDetails(row),
            title: "Meeting details",
          },
        ]}
        columns={MEETINGS_LIST_COLUMNS}
        description="This table show you all of meetings that you saved before"
        formPath="/meetings/new"
        loading={isLoading}
        onDelete={handleDelete}
        onEdit={handleEdit}
        pagination={{
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          onPageChange: setPage,
        }}
      />
    </Dashboard>
  );
};

export default MeetingsPage;
