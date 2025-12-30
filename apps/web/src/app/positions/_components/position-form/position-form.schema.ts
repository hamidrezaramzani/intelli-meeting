import type { TFunction } from "i18next";
import { z } from "zod";

export const getPositionSchema = (t: TFunction) =>
  z.object({
    title: z.string().min(1, t("common:validation.titleRequired")),
  });
