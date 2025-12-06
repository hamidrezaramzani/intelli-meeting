import type {
  SignInRequestBody,
  SignInResponseBody,
  UserProfileResponse,
} from "./auth.type";

import { baseApi } from "../../baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signin: builder.mutation<SignInResponseBody, SignInRequestBody>({
      query: (data) => ({
        url: "/auth/signin",
        method: "POST",
        data,
      }),
    }),
    readUserProfile: builder.query<UserProfileResponse, unknown>({
      query: () => ({
        url: `/auth/profile`,
        method: "GET",
      }),
    }),
  }),
});

export const { useSigninMutation, useReadUserProfileQuery } = authApi;
