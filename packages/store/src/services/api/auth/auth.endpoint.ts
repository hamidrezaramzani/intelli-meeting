import type {
  CheckIsEmailAlreadyUsedRequestBody,
  CheckIsEmailAlreadyUsedResponse,
  SignInRequestBody,
  SignInResponseBody,
} from "./auth.type";

import { baseApi } from "../../baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (data) => ({
        url: "/auth/signup",
        method: "POST",
        body: data,
      }),
    }),
    signin: builder.mutation<SignInResponseBody, SignInRequestBody>({
      query: (data) => ({
        url: "/auth/signin",
        method: "POST",
        body: data,
      }),
    }),
    checkEmail: builder.mutation<
      CheckIsEmailAlreadyUsedResponse,
      CheckIsEmailAlreadyUsedRequestBody
    >({
      query: (data) => ({
        url: "/auth/check-email",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSignupMutation, useSigninMutation, useCheckEmailMutation } =
  authApi;
