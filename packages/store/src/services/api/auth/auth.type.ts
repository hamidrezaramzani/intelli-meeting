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

export interface UserProfileResponse {
  success: boolean;
  user: {
    id: number;
    name: string;
  };
}
