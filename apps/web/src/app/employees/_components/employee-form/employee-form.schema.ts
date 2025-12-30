import type { TFunction } from "i18next";

import { z } from "zod";

export const getEmployeeFormSchema = (t: TFunction) =>
  z.object({
    fullName: z
      .string()
      .min(1, t("common:validation.fullNameRequired"))
      .min(2, t("common:validation.fullNameMinLength")),
    position: z.string().min(1, t("common:validation.positionRequired")),
  });
