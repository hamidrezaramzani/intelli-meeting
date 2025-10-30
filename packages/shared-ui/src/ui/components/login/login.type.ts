import type { z } from "zod";

import type { getLoginFormSchema } from "./login.schema";

export interface LoginProps {
  navigate: (url: string) => void;
}
export type LoginFormValues = z.infer<ReturnType<typeof getLoginFormSchema>>;
