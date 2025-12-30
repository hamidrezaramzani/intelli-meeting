import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextInput } from "@intelli-meeting/shared-ui";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type {
  PositionFormProps,
  PositionFormValues,
} from "./position-form.type";

import { getPositionSchema } from "./position-form.schema";

export const PositionForm = ({
  onSubmit,
  isEdit,
  isLoading,
  defaultValue,
}: PositionFormProps) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<PositionFormValues>({
    resolver: zodResolver(getPositionSchema(t)),
    values: defaultValue,
  });

  const title = isEdit
    ? t("setting:positions.form.editTitle")
    : t("setting:positions.form.createTitle");

  const description = isEdit
    ? t("setting:positions.form.editDescription")
    : t("setting:positions.form.createDescription");

  const submitLabel = isEdit
    ? t("setting:positions.form.editSubmit")
    : t("setting:positions.form.createSubmit");

  return (
    <div className="w-full">
      <div className="w-3/5 bg-slate-50 p-6">
        <h2 className="text-2xl font-roboto font-bold text-slate-800 mb-2">
          {title}
        </h2>
        <p className="text-slate-600 mb-6">{description}</p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            width="half"
            label={t("common:form.title")}
            type="text"
            placeholder={t("common:placeholders.positionTitle")}
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
