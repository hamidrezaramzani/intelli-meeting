"use client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { useCreatePositionMutation } from "@/services";
import { Dashboard } from "@/ui";

import type { PositionFormValues } from "../_components";

import { PositionForm } from "../_components";

const NewPositionForm = () => {
  const [createPosition, { isLoading }] = useCreatePositionMutation();
  const router = useRouter();

  const onSubmit = async (data: PositionFormValues) => {
    await toast.promise(createPosition(data).unwrap(), {
      pending: "Please wait",
      error: "We have an error when creating new position, please try again",
      success: {
        render: () => {
          router.push("/settings?tab=positions");
          return "Position created successfully";
        },
      },
    });
  };

  return (
    <Dashboard backUrl="/settings?tab=positions" title="New Position">
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
