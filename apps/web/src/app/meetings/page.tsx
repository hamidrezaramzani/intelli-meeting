"use client";

import { confirmation } from "@intelli-meeting/shared-ui";
import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useDeleteMeetingMutation, useReadManyMeetingsQuery } from "@/services";
import { Dashboard, Table } from "@/ui";

import type { Meeting } from "./_types";

import { getMeetingColumns } from "./_constants";

const MeetingsPage = () => {
  const router = useRouter();

  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading } = useReadManyMeetingsQuery({});

  const [deleteMeeting] = useDeleteMeetingMutation();

  const handleEdit = (meeting: Meeting) =>
    router.push(`/meetings/edit/${meeting.id}`);
  const handleDelete = async (meeting: Meeting) => {
    const isConfirmed = await confirmation({
      title: t("common:deleteThing", { thing: t("meeting:meeting") }),
      message: t("common:deleteThingConfirmation", {
        thing: t("meeting:meeting"),
      }),
      confirmText: t("common:yes"),
      cancelText: t("common:no"),
    });

    if (!isConfirmed) return;

    await toast.promise(
      deleteMeeting({
        params: { meetingId: meeting.id },
      }).unwrap(),
      {
        pending: t("common:deletingThing", { thing: t("meeting:meeting") }),
        success: {
          render: () => {
            router.push("/meetings");
            return t("common:thingDeleted", { thing: t("meeting:meeting") });
          },
        },
        error: t("common:operationFailed"),
      },
    );
  };

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
