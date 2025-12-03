import type { z } from "zod";

import type { meetingSchema } from "../_schemas";

export type MeetingFormValues = z.infer<typeof meetingSchema>;
