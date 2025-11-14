import type { SignInRequestBody, SignInResponseBody } from "./auth.type";

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
  }),
});

export const { useSigninMutation } = authApi;
