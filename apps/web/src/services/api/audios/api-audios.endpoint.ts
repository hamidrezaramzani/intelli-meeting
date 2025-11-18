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
    readAudioSpeakers: builder.query({
      query: ({ audioId }) => ({
        url: `/audio/speakers/${audioId}`,
        method: "GET",
      }),
    }),
    assignAudioToMeeting: builder.mutation({
      query: (data) => ({
        url: `/audio/assign-audio-to-meeting`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["Audios"],
    }),
    startAudioProcessing: builder.mutation<unknown, { audioId: string }>({
      query: ({ audioId }) => ({
        url: `/audio/process/${audioId}`,
        method: "GET",
      }),
      invalidatesTags: ["Audios"],
    }),
  }),
});

export const {
  useReadManyAudiosQuery,
  useAssignAudioToMeetingMutation,
  useStartAudioProcessingMutation,
  useReadAudioSpeakersQuery,
} = audioApi;
