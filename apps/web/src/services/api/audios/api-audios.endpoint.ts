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
    playAudio: builder.mutation({
      query: ({ speakerProfileId }) => ({
        url: `/audio/play/${speakerProfileId}`,
        method: "GET",
        responseType: "blob",
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
    assignAudioSpeakers: builder.mutation({
      query: ({ values, audioId }) => ({
        url: `/audio/assign-audio-speaker/${audioId}`,
        method: "POST",
        data: values,
      }),
    }),
  }),
});

export const {
  useReadManyAudiosQuery,
  useAssignAudioToMeetingMutation,
  useStartAudioProcessingMutation,
  useReadAudioSpeakersQuery,
  usePlayAudioMutation,
  useAssignAudioSpeakersMutation,
} = audioApi;
