import { zodResolver } from "@hookform/resolvers/zod";
import { Button, SelectInput, TextInput } from "@intelli-meeting/shared-ui";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useReadManyPositionCandidatesQuery } from "@/services";

import type {
  EmployeeFormProps,
  EmployeeFormValues,
} from "./employee-form.type";

import { getEmployeeFormSchema } from "./employee-form.schema";

export const EmployeeForm = ({
  onSubmit,
  isLoading,
  isEdit,
  defaultValue,
}: EmployeeFormProps) => {
  const { t } = useTranslation();
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
    resolver: zodResolver(getEmployeeFormSchema(t)),
    values: defaultValue,
  });

  return (
    <div className="w-full">
      <div className="w-full lg:w-3/5 p-4 sm:p-6">
        <h2 className="text-2xl font-roboto font-bold text-slate-800 mb-2">
          {isEdit
            ? t("employee:form.editTitle")
            : t("employee:form.createTitle")}
        </h2>

        <p className="text-slate-600 mb-6">{t("employee:form.description")}</p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            width="half"
            label={t("common:form.fullName")}
            type="text"
            placeholder={t("common:placeholders.fullName")}
            {...register("fullName")}
            error={touchedFields.fullName ? errors.fullName?.message : ""}
          />

          <SelectInput
            label={t("common:form.position")}
            placeholder={t("common:placeholders.select")}
            {...register("position")}
            options={positionOptions}
          />

          <Button
            className="mt-2 w-full sm:w-96"
            disabled={isLoading}
            type="submit"
          >
            {isEdit
              ? t("employee:form.editSubmit")
              : t("employee:form.createSubmit")}
          </Button>
        </form>
      </div>
    </div>
  );
};
