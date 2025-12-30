import { z } from "zod";

export const getLoginFormSchema = (messages: {
  invalidEmail: string;
  passwordMinLength: string;
}) =>
  z.object({
    email: z.string().email(messages.invalidEmail),
    password: z.string().min(6, messages.passwordMinLength),
  });
