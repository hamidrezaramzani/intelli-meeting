"use client";

import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useReadManyMeetingsQuery } from "@/services";
import { Dashboard, Table } from "@/ui";

import type { Meeting } from "./_types";

import { getMeetingColumns } from "./_constants";

const MeetingsPage = () => {
  const router = useRouter();

  const { t } = useTranslation();

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
        thing={t("meeting:meeting")}
        title={t("meeting:meeting")}
        columns={getMeetingColumns(t)}
        description={t("meeting:description")}
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
