import { baseApi } from "@intelli-meeting/store";
import { Meeting, ReadOneMeetingResponse } from "./api-meetings.type";

export const meetingsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createMeeting: builder.mutation({
      query: (data) => ({
        url: "/meeting",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Meetings"],
    }),
    readManyMeetings: builder.query({
      query: () => ({
        url: `/meeting`,
        method: "GET",
      }),
      providesTags: ["Meetings"],
    }),
    readMeetingCandidates: builder.query({
      query: () => ({
        url: "/meeting/candidates",
        method: "GET",
      }),
    }),
    readOneMeeting: builder.query<
      ReadOneMeetingResponse,
      { meetingId: string }
    >({
      query: ({ meetingId }) => ({
        url: `/meeting/${meetingId}`,
        method: "GET",
      }),
      providesTags: ["Meeting"],
    }),
  }),
});

export const {
  useCreateMeetingMutation,
  useReadManyMeetingsQuery,
  useReadMeetingCandidatesQuery,
  useReadOneMeetingQuery,
} = meetingsApi;
