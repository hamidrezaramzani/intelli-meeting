export interface SignInRequestBody {
  email: string;
  password: string;
}

export interface SignInResponseBody {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    bio?: string;
    created_at?: string;
  };
  token: string;
}

export interface UserProfileResponse {
  success: boolean;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    bio?: string;
  };
}
