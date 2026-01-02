"use client";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useCreatePositionMutation } from "@/services";
import { Dashboard } from "@/ui";

import type { PositionFormValues } from "../_components";

import { PositionForm } from "../_components";

const NewPositionForm = () => {
  const [createPosition, { isLoading }] = useCreatePositionMutation();
  const { t } = useTranslation();
  const router = useRouter();

  const onSubmit = async (data: PositionFormValues) => {
    await toast.promise(createPosition(data).unwrap(), {
      pending: t("common:pleaseWait"),
      error: t("common:errors.createPosition"),
      success: {
        render: () => {
          router.push("/settings?tab=positions");
          return t("common:messages.positionCreated");
        },
      },
    });
  };

  return (
    <Dashboard
      backUrl="/settings?tab=positions"
      title={t("setting:positions.form.createTitle")}
    >
      <PositionForm
        defaultValue={{ title: "" }}
        isEdit={false}
        isLoading={isLoading}
        onSubmit={onSubmit}
      />
    </Dashboard>
  );
};

export default NewPositionForm;
