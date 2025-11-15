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
    }),
    createMeetingSummary: builder.mutation({
      query: ({ meetingId }) => ({
        url: `/meetings/start-audio-transcript-processing/${meetingId}`,
        method: "GET",
      }),
      invalidatesTags: ["Meetings"],
    }),
  }),
});

export const {
  useCreateMeetingMutation,
  useReadManyMeetingsQuery,
  useReadMeetingCandidatesQuery,
  useCreateMeetingSummaryMutation,
} = meetingsApi;
