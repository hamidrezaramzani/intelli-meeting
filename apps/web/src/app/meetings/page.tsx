"use client";

import { Modal } from "@intelli-meeting/shared-ui";
import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdRemoveRedEye, MdSend } from "react-icons/md";
import { toast } from "react-toastify";

import type { Meeting } from "@/lib/type";

import { MEETINGS_LIST_COLUMNS } from "@/lib/constant";
import {
  useCreateMeetingSummaryMutation,
  useReadManyMeetingsQuery,
} from "@/services";
import { Dashboard, Table } from "@/ui";

const MeetingsPage = () => {
  const router = useRouter();
  const [startCreateMeetingSummaryProcessing] =
    useCreateMeetingSummaryMutation();

  const [page, setPage] = useState(1);
  const [meetingDetails, setMeetingDetails] = useState<Meeting | null>(null);
  const limit = 10;
  const { data } = useReadManyMeetingsQuery({});
  const handleEdit = (meeting: Meeting) => console.log("Edit", meeting);
  const handleDelete = (meeting: Meeting) => console.log("Delete", meeting);

  const meetings = data?.meetings || [];
  const total = data?.total || 0;

  useAuthRedirect({
    onRedirect: () => router.push("/sign-in"),
    type: "unlogged",
  });

  const handleCreateSummaryClick = async (meetingId: string) => {
    await toast.promise(
      startCreateMeetingSummaryProcessing({ meetingId }).unwrap(),
      {
        pending: "Starting transcripts processing...",
        success: "Audio transcripts processing started successfully!",
        error:
          "An error occurred while starting the audio transcripts processing. Please try again.",
      },
    );
  };

  return (
    <Dashboard title="Meetings">
      <Modal
        title="Meeting detail"
        onClose={() => setMeetingDetails(null)}
        open={meetingDetails !== null}
      >
        {meetingDetails && (
          <table className="min-w-[300px] border border-gray-200">
            <tbody>
              {Object.entries(meetingDetails).map(([key, value]) => (
                <tr className="border-b border-b-gray-300" key={key}>
                  <td className="py-2 px-4 font-semibold bg-gray-100 capitalize">
                    {key.replace("_", " ")}
                  </td>
                  <td className="py-2 px-4">
                    {key === "meeting_link" && value ? (
                      <a
                        className="text-blue-500 underline"
                        href={value}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Link
                      </a>
                    ) : (
                      value || "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Modal>
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
