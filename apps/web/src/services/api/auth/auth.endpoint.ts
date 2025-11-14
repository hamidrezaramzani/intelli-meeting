import { baseApi } from "@intelli-meeting/store";

import type {
  CheckIsEmailAlreadyUsedRequestBody,
  CheckIsEmailAlreadyUsedResponse,
} from "./auth.type";

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (data) => ({
        url: "/auth/signup",
        method: "POST",
        data,
      }),
    }),
    checkEmail: builder.mutation<
      CheckIsEmailAlreadyUsedResponse,
      CheckIsEmailAlreadyUsedRequestBody
    >({
      query: (data) => ({
        url: "/auth/check-email",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const { useSignupMutation, useCheckEmailMutation } = authApi;
