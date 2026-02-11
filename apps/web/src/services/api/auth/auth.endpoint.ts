import { baseApi } from "@intelli-meeting/store";

import type {
  CheckIsEmailAlreadyUsedRequestBody,
  CheckIsEmailAlreadyUsedResponse,
  ProfileUpdateRequest,
  ProfileUpdateResponse,
  UserProfileResponse,
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
    getProfile: builder.query<UserProfileResponse, unknown>({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<
      ProfileUpdateResponse,
      ProfileUpdateRequest
    >({
      query: (data) => ({
        url: "/auth/profile",
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useSignupMutation,
  useCheckEmailMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApi;
