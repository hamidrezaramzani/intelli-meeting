import type { z } from "zod";

import type { meetingSchema } from "./meetings-form.schema";

export type MeetingFormValues = z.infer<typeof meetingSchema>;

export interface MeetingFormProps {
  title: string;
  description: string;
  onSubmit: (values: MeetingFormValues) => void;
  isLoading?: boolean;
  isEdit?: boolean;
  defaultValues: MeetingFormValues;
}
