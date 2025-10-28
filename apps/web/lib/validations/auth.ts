import { z } from "zod";

export const getSignUpFormSchema = (
  checkIsEmailAlreadyUsed: (email: string) => Promise<boolean>
) =>
  z
    .object({
      name: z.string().min(2, "Name must be at least 2 characters long."),
      email: z.string().email("Invalid email address."),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long."),
      confirmPassword: z.string(),
    })
    .refine(
      async (data) => {
        const isUnique = await checkIsEmailAlreadyUsed(data.email);
        return isUnique;
      },
      {
        message: "Email is already used",
        path: ["email"],
      }
    )
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    });

export type SignUpInput = z.infer<ReturnType<typeof getSignUpFormSchema>>;
