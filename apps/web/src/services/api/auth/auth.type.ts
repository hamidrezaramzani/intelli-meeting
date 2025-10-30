export interface CheckIsEmailAlreadyUsedResponse {
  isUnique: boolean;
}

export interface CheckIsEmailAlreadyUsedRequestBody {
  email: string;
}
