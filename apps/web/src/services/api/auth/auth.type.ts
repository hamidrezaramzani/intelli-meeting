export interface CheckIsEmailAlreadyUsedResponse {
  isUnique: boolean;
}

export interface CheckIsEmailAlreadyUsedRequestBody {
  email: string;
}

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  bio?: string;
  created_at: string;
}

export interface UserProfileResponse {
  success: true;
  user: UserProfile;
}

export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  bio?: string;
  password?: string;
}

export interface ProfileUpdateResponse {
  success: true;
  user: UserProfile;
  message: string;
}
