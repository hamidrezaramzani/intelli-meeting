"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, SelectInput, TextInput } from "@intelli-meeting/shared-ui";
import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import type { CreateEmployeeFormValues } from "@/lib/type";

import { createEmployeeSchema } from "@/lib";
import {
  useCreateEmployeeMutation,
  useReadManyPositionCandidatesQuery,
} from "@/services";
import { Dashboard } from "@/ui";

const NewEmployeeForm = () => {
  const router = useRouter();
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();
  const { data: positionsData } = useReadManyPositionCandidatesQuery({});

  useAuthRedirect({
    onRedirect: () => router.push("/sign-in"),
    type: "unlogged",
  });

  const positions = positionsData?.positions ?? [];
  const positionOptions = [
    { label: "Select a position...", value: undefined },
    ...positions.map((position: { title: string; id: string }) => ({
      label: position.title,
      value: position.id,
    })),
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<CreateEmployeeFormValues>({
    resolver: zodResolver(createEmployeeSchema),
  });

  const onSubmit = async (data: CreateEmployeeFormValues) => {
    await toast.promise(createEmployee(data).unwrap(), {
      pending: "Creating employee...",
      success: {
        render: () => {
          router.push("/employees");
          return "Employee created successfully!";
        },
      },
      error: "Error while creating employee. Please try again.",
    });
  };

  return (
    <Dashboard backUrl="/employees" title="New employee">
      <div className="w-full">
        <div className="w-3/5 bg-slate-50 p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Add new employee
          </h2>

          <p className="text-slate-600 mb-6">
            Fill out the form below to register a new employee.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              width="half"
              label="Full name"
              type="text"
              placeholder="Enter employee name"
              {...register("fullName")}
              error={touchedFields.fullName ? errors.fullName?.message : ""}
            />

            <SelectInput
              label="Position"
              {...register("position")}
              options={positionOptions}
            />

            <Button className="mt-2 w-96" disabled={isLoading} type="submit">
              Save employee
            </Button>
          </form>
        </div>
      </div>
    </Dashboard>
  );
};

export default NewEmployeeForm;
