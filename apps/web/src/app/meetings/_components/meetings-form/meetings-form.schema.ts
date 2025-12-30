import type { TFunction } from "i18next";
import { z } from "zod";

export const getMeetingSchema = (t: TFunction) =>
  z.object({
    title: z.string().min(1, t("meeting:validation.titleRequired")),
    description: z.string().optional(),
    date: z.string().min(1, t("meeting:validation.dateRequired")),
    startTime: z.string().min(1, t("meeting:validation.startTimeRequired")),
    endTime: z.string().optional(),
    meetingLink: z.string().url(t("meeting:validation.invalidUrl")).optional(),
    employees: z.array(z.string()).optional(),
  });
