import type { z } from "zod";

import type { meetingSchema } from "@/lib/validation";

export type MeetingFormValues = z.infer<typeof meetingSchema>;
