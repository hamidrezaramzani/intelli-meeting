import { baseApi } from "../../baseApi";

export const meetingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    readMeetingCandidates: builder.query({
      query: () => ({
        url: "/meeting/candidates",
        method: "GET",
      }),
      transformResponse: (data) => data.meetings,
    }),
  }),
});

export const { useReadMeetingCandidatesQuery } = meetingApi;
