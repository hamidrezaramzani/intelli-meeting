"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  SelectMultipleInput,
  TextInput,
} from "@intelli-meeting/shared-ui";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import type { MeetingFormValues } from "@/lib/type";

import { meetingSchema } from "@/lib";
import {
  useCreateMeetingMutation,
  useReadManyEmployeeCandidatesQuery,
} from "@/services";
import { Dashboard } from "@/ui";

// eslint-disable-next-line complexity
const NewMeetingForm = () => {
  const [createMeeting, { isLoading }] = useCreateMeetingMutation();
  const { data: employees } = useReadManyEmployeeCandidatesQuery({});
  const employeeOptions = employees
    ? employees?.map((employee: any) => ({
        value: employee.id,
        label: `${employee.fullName} - ${employee.position.id}`,
      }))
    : [];
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, touchedFields },
  } = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingSchema),
  });

  const onSubmit = async (data: MeetingFormValues) => {
    void toast.promise(createMeeting(data).unwrap(), {
      pending: "Please wait",
      error: "We have an error when creating new user, please try again",
      success: {
        render: () => {
          router.push("/meetings");
          return "Meeting created successfully";
        },
      },
    });
  };

  return (
    <Dashboard backUrl="/meetings" title="New meeting">
      <div className="w-full">
        <div className="w-3/5 bg-slate-50 p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Add new meeting
          </h2>
          <p className="text-slate-600 mb-6">
            Fill out the form below to create a new meeting record.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              width="half"
              label="Title"
              type="text"
              placeholder="Enter meeting title"
              {...register("title")}
              error={touchedFields.title ? errors.title?.message : ""}
            />

            <TextInput
              width="half"
              label="Description"
              type="text"
              placeholder="Enter meeting description"
              {...register("description")}
              error={
                touchedFields.description ? errors.description?.message : ""
              }
            />

            <TextInput
              width="half"
              label="Date"
              type="date"
              {...register("date")}
              error={touchedFields.date ? errors.date?.message : ""}
            />

            <div className="flex gap-3 w-1/2 ">
              <div className="w-1/2">
                <TextInput
                  label="Start time"
                  type="time"
                  {...register("startTime")}
                  width="full"
                  error={
                    touchedFields.startTime ? errors.startTime?.message : ""
                  }
                />
              </div>

              <div className="w-1/2">
                <TextInput
                  label="End time"
                  type="time"
                  {...register("endTime")}
                  width="full"
                  error={touchedFields.endTime ? errors.endTime?.message : ""}
                />
              </div>
            </div>

            <TextInput
              label="Meeting link"
              type="text"
              placeholder="Enter meeting URL"
              {...register("meetingLink")}
              width="half"
              error={
                touchedFields.meetingLink ? errors.meetingLink?.message : ""
              }
            />

            <Controller
              name="employees"
              control={control}
              render={({ field, fieldState }) => (
                <SelectMultipleInput
                  label="Employees"
                  value={field.value || []}
                  error={fieldState.error?.message}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  options={employeeOptions}
                />
              )}
            />

            <Button className="mt-2 w-96" disabled={isLoading} type="submit">
              Save meeting
            </Button>
          </form>
        </div>
      </div>
    </Dashboard>
  );
};

export default NewMeetingForm;
