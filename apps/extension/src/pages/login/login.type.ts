import type { SignInInput } from "./login.schema";

export interface LoginProps {
  onSubmit: (values: SignInInput) => void;
  isLoading: boolean;
}
