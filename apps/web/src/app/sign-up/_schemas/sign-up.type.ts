import type { TFunction } from "i18next";
import { z } from "zod";

export const getSignUpFormSchema = (
  checkIsEmailAlreadyUsed: (email: string) => Promise<boolean>,
  t: TFunction,
) =>
  z
    .object({
      name: z.string().min(2, t("common:validation.nameMinLength")),
      email: z.string().email(t("common:validation.invalidEmail")),
      password: z
        .string()
        .min(6, t("common:validation.passwordMinLength")),
      confirmPassword: z.string(),
    })
    .refine(
      async (data) => {
        const isUnique = await checkIsEmailAlreadyUsed(data.email);
        return isUnique;
      },
      {
        message: t("common:validation.emailInUse"),
        path: ["email"],
      },
    )
    .refine((data) => data.password === data.confirmPassword, {
      message: t("common:validation.passwordsDoNotMatch"),
      path: ["confirmPassword"],
    });
