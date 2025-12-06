export interface CheckIsEmailAlreadyUsedResponse {
  isUnique: boolean;
}

export interface CheckIsEmailAlreadyUsedRequestBody {
  email: string;
}

export interface UserProfileResponse {
  success: true;
  user: { id: number; name: string };
}
