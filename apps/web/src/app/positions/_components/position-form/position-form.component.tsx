import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextInput } from "@intelli-meeting/shared-ui";
import { useForm } from "react-hook-form";

import type {
  PositionFormProps,
  PositionFormValues,
} from "./position-form.type";

import { positionSchema } from "./position-form.schema";

export const PositionForm = ({
  onSubmit,
  isEdit,
  isLoading,
  defaultValue,
}: PositionFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<PositionFormValues>({
    resolver: zodResolver(positionSchema),
    values: defaultValue,
  });

  const title = isEdit ? "Edit position" : "Add new position";

  const description = isEdit
    ? "Fill out the form below to edit position"
    : "Fill out the form below to create new position";

  const submitLabel = isEdit ? "Edit position" : "Create position";

  return (
    <div className="w-full">
      <div className="w-3/5 bg-slate-50 p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-600 mb-6">{description}</p>

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
            {submitLabel}
          </Button>
        </form>
      </div>
    </div>
  );
};
