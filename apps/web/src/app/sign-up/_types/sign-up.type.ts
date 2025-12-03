import type { z } from "zod";

import type { getSignUpFormSchema } from "../_schemas";

export type SignUpFormValues = z.infer<typeof getSignUpFormSchema>;
