import { z } from "zod";
import type { TFunction } from "i18next";

export const getEditProfileFormSchema = (t: TFunction) =>
  z.object({
    first_name: z.string().min(1, t("profile:validation.firstNameRequired")),
    last_name: z.string().min(1, t("profile:validation.lastNameRequired")),
    email: z.string().email(t("profile:validation.invalidEmail")),
    bio: z.string().optional(),
    password: z
      .string()
      .min(6, t("profile:validation.passwordMinLength"))
      .optional()
      .or(z.literal("")),
    confirmPassword: z
      .string()
      .optional()
      .or(z.literal("")),
  }).refine(
    (data) => {
      if (data.password && data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: t("profile:validation.passwordsMatch"),
      path: ["confirmPassword"],
    }
  );
