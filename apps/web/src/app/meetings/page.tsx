"use client";

import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useReadManyMeetingsQuery } from "@/services";
import { Dashboard, Table } from "@/ui";

import type { Meeting } from "./_types";

import { MEETINGS_LIST_COLUMNS } from "./_constants";

const MeetingsPage = () => {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const limit = 10;
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
      <Table
        data={meetings}
        title="List of meetings"
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
