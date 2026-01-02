"use client";
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { useEditPositionMutation, useReadOnePositionQuery } from "@/services";
import { Dashboard } from "@/ui";

import type { PositionFormValues } from "../../_components";

import { PositionForm } from "../../_components";

const EditPositionForm = () => {
  const router = useRouter();

  const { id } = useParams();
  const [editPosition, { isLoading }] = useEditPositionMutation();

  const { data } = useReadOnePositionQuery(id ? { params: { id } } : skipToken);

  const onSubmit = async (values: PositionFormValues) => {
    await toast.promise(
      editPosition({ data: values, params: { id } }).unwrap(),
      {
        pending: "Please wait",
        error: "We have an error when updating position, please try again",
        success: {
          render: () => {
            router.push("/settings?tab=positions");
            return "Position updated successfully";
          },
        },
      },
    );
  };

  return (
    <Dashboard backUrl="/settings?tab=positions" title="Edit Position">
      <PositionForm
        isEdit
        defaultValue={{ title: data?.title || "" }}
        isLoading={isLoading}
        onSubmit={onSubmit}
      />
    </Dashboard>
  );
};

export default EditPositionForm;
