import type { UserProfile } from "@/services/api/auth/auth.type";

export interface EditProfileFormProps {
  onSubmit: (data: EditProfileFormValues) => void;
  isLoading: boolean;
  defaultValue?: UserProfile | null;
}

export interface EditProfileFormValues {
  first_name: string;
  last_name: string;
  email: string;
  bio?: string;
  password?: string;
  confirmPassword?: string;
}
