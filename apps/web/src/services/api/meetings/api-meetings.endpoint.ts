import { baseApi } from "@intelli-meeting/store";

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
  }),
});

export const {
  useCreateMeetingMutation,
  useReadManyMeetingsQuery,
  useReadMeetingCandidatesQuery,
} = meetingsApi;
