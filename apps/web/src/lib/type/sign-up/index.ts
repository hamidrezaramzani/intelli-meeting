import type { z } from "zod";

import type { getSignUpFormSchema } from "@/lib/validation";

export type SignUpFormValues = z.infer<typeof getSignUpFormSchema>;
