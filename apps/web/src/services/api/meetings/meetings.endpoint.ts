import { baseApi } from "@intelli-meeting/store";

export const meetingsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createMeeting: builder.mutation({
      query: (data) => ({
        url: "/meetings",
        method: "POST",
        data,
      }),
    }),
    readManyMeetings: builder.query({
      query: () => ({
        url: "/meetings",
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateMeetingMutation, useReadManyMeetingsQuery } =
  meetingsApi;
