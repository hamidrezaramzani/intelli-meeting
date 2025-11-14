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
      invalidatesTags: ["Meetings"],
    }),
    readManyMeetings: builder.query({
      query: () => ({
        url: "/meetings",
        method: "GET",
      }),
      providesTags: ["Meetings"],
    }),
    readMeetingCandidates: builder.query({
      query: () => ({
        url: "/meetings/candidates",
        method: "GET",
      }),
      providesTags: ["Meetings"],
    }),
  }),
});

export const {
  useCreateMeetingMutation,
  useReadManyMeetingsQuery,
  useReadMeetingCandidatesQuery,
} = meetingsApi;
