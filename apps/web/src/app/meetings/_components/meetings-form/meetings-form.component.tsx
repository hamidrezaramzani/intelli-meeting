/* eslint-disable complexity */
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  SelectMultipleInput,
  TextInput,
} from "@intelli-meeting/shared-ui";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useReadManyEmployeeCandidatesQuery } from "@/services";

import type { MeetingFormProps, MeetingFormValues } from "./meetings-form.type";

import { getMeetingSchema } from "./meetings-form.schema";

export const MeetingsForm = ({
  title,
  description,
  onSubmit,
  isLoading,
  defaultValues,
  isEdit = false,
}: MeetingFormProps) => {
  const { data: employees } = useReadManyEmployeeCandidatesQuery({});

  const { t } = useTranslation();

  const employeeOptions = employees
    ? employees?.map((employee: any) => ({
        value: String(employee.id),
        label: `${employee.fullName} - ${employee.position.id}`,
      }))
    : [];

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, touchedFields },
  } = useForm<MeetingFormValues>({
    resolver: zodResolver(getMeetingSchema(t)),
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <div className="w-full">
      <div className="w-full lg:w-3/5 p-4 sm:p-6">
        <h2 className="text-2xl font-roboto font-bold text-slate-800 mb-2">
          {title}
        </h2>
        <p className="text-slate-600 mb-6">{description}</p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            width="half"
            label={t("common:form.title")}
            type="text"
            placeholder={t("common:placeholders.meetingTitle")}
            {...register("title")}
            error={touchedFields.title ? errors.title?.message : ""}
          />

          <TextInput
            width="half"
            label={t("common:form.description")}
            type="text"
            placeholder={t("common:placeholders.meetingDescription")}
            {...register("description")}
            error={touchedFields.description ? errors.description?.message : ""}
          />

          <TextInput
            width="half"
            label={t("common:form.date")}
            type="date"
            {...register("date")}
            error={touchedFields.date ? errors.date?.message : ""}
          />

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-1/2">
            <div className="w-full sm:w-1/2">
              <TextInput
                label={t("common:form.startTime")}
                type="time"
                {...register("startTime")}
                width="full"
                error={touchedFields.startTime ? errors.startTime?.message : ""}
              />
            </div>

            <div className="w-full sm:w-1/2">
              <TextInput
                label={t("common:form.endTime")}
                type="time"
                {...register("endTime")}
                width="full"
                error={touchedFields.endTime ? errors.endTime?.message : ""}
              />
            </div>
          </div>

          <TextInput
            label={t("common:form.meetingLink")}
            type="text"
            placeholder={t("common:placeholders.meetingLink")}
            {...register("meetingLink")}
            width="half"
            error={touchedFields.meetingLink ? errors.meetingLink?.message : ""}
          />

          <Controller
            name="employees"
            control={control}
            render={({ field, fieldState }) => (
              <SelectMultipleInput
                label={t("common:form.employees")}
                placeholder={t("common:placeholders.select")}
                value={field.value || []}
                error={fieldState.error?.message}
                onBlur={field.onBlur}
                onChange={field.onChange}
                options={employeeOptions}
              />
            )}
          />

          <Button className="mt-2 w-full sm:w-96" disabled={isLoading} type="submit">
            {isEdit
              ? t("common:editThing", { thing: t("meeting:meeting") })
              : t("common:addThing", { thing: t("meeting:meeting") })}
          </Button>
        </form>
      </div>
    </div>
  );
};
