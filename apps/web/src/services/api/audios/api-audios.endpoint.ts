import { baseApi } from "@intelli-meeting/store";

export const audioApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    readManyAudios: builder.query({
      query: () => ({
        url: "/audio",
        method: "GET",
      }),
      providesTags: ["Audios"],
    }),
    assignAudioToMeeting: builder.mutation({
      query: (data) => ({
        url: `/audio/assign-audio-to-meeting`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["Audios"],
    }),
  }),
});

export const { useReadManyAudiosQuery, useAssignAudioToMeetingMutation } =
  audioApi;
