import type { z } from "zod";

import type { getMeetingSchema } from "./meetings-form.schema";

export type MeetingFormValues = z.infer<ReturnType<typeof getMeetingSchema>>;

export interface MeetingFormProps {
  title: string;
  description: string;
  onSubmit: (values: MeetingFormValues) => void;
  isLoading?: boolean;
  isEdit?: boolean;
  defaultValues: MeetingFormValues;
}
