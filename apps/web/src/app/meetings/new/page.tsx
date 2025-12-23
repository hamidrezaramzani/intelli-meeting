"use client";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useCreateMeetingMutation } from "@/services";
import { Dashboard } from "@/ui";

import type { MeetingFormValues } from "../_components";

import { MeetingsForm } from "../_components";

const NewMeetingForm = () => {
  const [createMeeting, { isLoading }] = useCreateMeetingMutation();
  const { t } = useTranslation();
  const router = useRouter();

  const onSubmit = async (data: MeetingFormValues) => {
    await toast.promise(
      createMeeting({
        ...data,
        date: new Date(data.date).toISOString(),
      }).unwrap(),
      {
        pending: t("common:addingThing", { thing: t("meeting:meeting") }),
        error: t("common:operationFailed"),
        success: {
          render: () => {
            router.push("/meetings");
            return t("common:thingAdded", { thing: t("meeting:meeting") });
          },
        },
      },
    );
  };

  return (
    <Dashboard backUrl="/meetings" title={t("meeting:form.addMeeting")}>
      <MeetingsForm
        title={t("common:addThing", { thing: t("meeting:meeting") })}
        description={t("meeting:form.addMeetingDescription")}
        isLoading={isLoading}
        onSubmit={onSubmit}
        defaultValues={{
          title: "",
          description: "",
          date: new Date().toDateString(),
          startTime: "",
          endTime: "",
          employees: [],
          meetingLink: "",
        }}
      />
    </Dashboard>
  );
};

export default NewMeetingForm;
