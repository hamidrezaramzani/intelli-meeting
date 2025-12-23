"use client";
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useReadOneMeetingQuery, useUpdateMeetingMutation } from "@/services";
import { Dashboard } from "@/ui";

import type { MeetingFormValues } from "../../_components";

import { MeetingsForm } from "../../_components";

// eslint-disable-next-line complexity
const EditMeetingForm = () => {
  const [editMeeting, { isLoading }] = useUpdateMeetingMutation();
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useParams();

  const { data: meetingData } = useReadOneMeetingQuery(
    id ? { meetingId: id as string } : skipToken,
  );
  const meeting = meetingData?.meeting;

  const onSubmit = async (data: MeetingFormValues) => {
    await toast.promise(
      editMeeting({
        data: {
          ...data,
          date: new Date(data.date).toISOString(),
        },
        params: {
          meetingId: id,
        },
      }).unwrap(),
      {
        pending: t("common:updatingThing", {
          thing: t("meeting:meeting"),
        }),
        error: t("common:operationFailed"),
        success: {
          render: () => {
            router.push("/meetings");
            return t("common:thingUpdated", { thing: t("meeting:meeting") });
          },
        },
      },
    );
  };

  return (
    <Dashboard
      backUrl="/meetings"
      title={t("common:editThing", { thing: t("meeting:meeting") })}
    >
      <MeetingsForm
        isEdit
        title={t("common:editThing", { thing: t("meeting:meeting") })}
        description={t("meeting:form.editMeetingDescription")}
        isLoading={isLoading}
        onSubmit={onSubmit}
        defaultValues={{
          title: meeting?.title || "",
          description: meeting?.description || "",
          date: meeting?.date || "",
          startTime: meeting?.start_time || "",
          endTime: meeting?.end_time || "",
          employees: meeting?.employees
            ? meeting?.employees.map((m) => String(m.id))
            : [],
          meetingLink: meeting?.meeting_link || "",
        }}
      />
    </Dashboard>
  );
};

export default EditMeetingForm;
