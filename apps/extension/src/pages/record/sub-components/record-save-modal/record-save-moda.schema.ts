import { z } from "zod";

export const audioNameSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  meetingId: z.string().min(1, "Please select a meeting"),
});

export type AudioNameFormValues = z.infer<typeof audioNameSchema>;
