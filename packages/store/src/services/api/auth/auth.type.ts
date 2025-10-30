export interface CheckIsEmailAlreadyUsedResponse {
  isUnique: boolean;
}

export interface CheckIsEmailAlreadyUsedRequestBody {
  email: string;
}

export interface SignInRequestBody {
  email: string;
  password: string;
}

export interface SignInResponseBody {
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
}
