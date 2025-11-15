"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextInput } from "@intelli-meeting/shared-ui";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import type { PositionFormValues } from "@/lib/type";

import { positionSchema } from "@/lib";
import { useCreatePositionMutation } from "@/services";
import { Dashboard } from "@/ui";

const NewPositionForm = () => {
  const [createPosition, { isLoading }] = useCreatePositionMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<PositionFormValues>({
    resolver: zodResolver(positionSchema),
  });

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
      <div className="w-full">
        <div className="w-3/5 bg-slate-50 p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Add new position
          </h2>
          <p className="text-slate-600 mb-6">
            Fill out the form below to create a new position.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              width="half"
              label="Title"
              type="text"
              placeholder="Enter position title"
              {...register("title")}
              error={touchedFields.title ? errors.title?.message : ""}
            />

            <Button
              className="mt-2 w-96"
              disabled={isLoading}
              fullWidth={false}
              type="submit"
            >
              Save position
            </Button>
          </form>
        </div>
      </div>
    </Dashboard>
  );
};

export default NewPositionForm;
