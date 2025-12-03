import { z } from "zod";

export const meetingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().optional(),
  meetingLink: z.string().url("Invalid URL").optional(),
  employees: z.array(z.string()).optional(),
});
