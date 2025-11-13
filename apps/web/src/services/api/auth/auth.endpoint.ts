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
        url: "/signup",
        method: "POST",
        data,
      }),
    }),
    checkEmail: builder.mutation<
      CheckIsEmailAlreadyUsedResponse,
      CheckIsEmailAlreadyUsedRequestBody
    >({
      query: (data) => ({
        url: "/check-email",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSignupMutation, useCheckEmailMutation } = authApi;
