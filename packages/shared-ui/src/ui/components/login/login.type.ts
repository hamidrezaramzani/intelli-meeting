import type { z } from "zod";

import type { getLoginFormSchema } from "./login.schema";

export interface LoginCopy {
  title: string;
  description: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  submitLabel: string;
  noAccountPrompt: string;
  signUpLabel: string;
}

export interface LoginLinks {
  homeUrl: string;
  signUpUrl: string;
}

export interface LoginToastMessages {
  pending: string;
  error: string;
  success: string;
}

export interface LoginValidationMessages {
  invalidEmail: string;
  passwordMinLength: string;
}

export interface LoginProps {
  navigate: (url: string) => void;
  copy: LoginCopy;
  links: LoginLinks;
  toastMessages: LoginToastMessages;
  validationMessages: LoginValidationMessages;
}
export type LoginFormValues = z.infer<ReturnType<typeof getLoginFormSchema>>;
