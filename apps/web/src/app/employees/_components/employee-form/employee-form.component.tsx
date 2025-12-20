import { zodResolver } from "@hookform/resolvers/zod";
import { Button, SelectInput, TextInput } from "@intelli-meeting/shared-ui";
import { useForm } from "react-hook-form";

import { useReadManyPositionCandidatesQuery } from "@/services";

import type {
  EmployeeFormProps,
  EmployeeFormValues,
} from "./employee-form.type";

import { employeeFormSchema } from "./employee-form.schema";

export const EmployeeForm = ({
  onSubmit,
  isLoading,
  isEdit,
  defaultValue,
}: EmployeeFormProps) => {
  const { data: positionsData } = useReadManyPositionCandidatesQuery({});

  const positions = positionsData?.positions ?? [];
  const positionOptions = [
    ...positions.map((position: { title: string; id: string }) => ({
      label: position.title,
      value: position.id,
    })),
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    values: defaultValue,
  });

  return (
    <div className="w-full">
      <div className="w-3/5 p-6">
        <h2 className="text-2xl font-roboto font-bold text-slate-800 mb-2">
          {isEdit ? "Edit employee" : "Create employee"}
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
            {isEdit ? "Update employee" : "Save employee"}
          </Button>
        </form>
      </div>
    </div>
  );
};
