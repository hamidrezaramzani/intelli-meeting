"use client";

import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdRemoveRedEye, MdSend } from "react-icons/md";

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

  const handleCreateSummaryClick = async (meetingId: string) => {
    const ws = new WebSocket(
      `ws://localhost:8000/ws/meeting/generate-summary?meeting_id=${meetingId}`,
    );

    const listener = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        console.log(message);
      } catch (e) {
        console.error("Failed to parse message", e);
      }
    };

    ws.addEventListener("message", listener);

    ws.addEventListener("open", () => console.log("WebSocket opened"));
    ws.addEventListener("close", () => console.log("WebSocket closed"));
    ws.addEventListener("error", (err) =>
      console.error("WebSocket error", err),
    );
  };

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
          {
            children: <MdSend />,
            onActionClick: (row) => handleCreateSummaryClick(row.id),
            title: "Send transcript for analysis by the LLM",
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
