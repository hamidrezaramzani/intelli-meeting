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
    playSpeakerProfile: builder.mutation({
      query: ({ speakerProfileId }) => ({
        url: `/audio/play/speaker-profile/${speakerProfileId}`,
        method: "GET",
        responseType: "blob",
      }),
    }),
    playAudio: builder.mutation({
      query: ({ audioId }) => ({
        url: `/audio/play/audio/${audioId}`,
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
      invalidatesTags: ["Audios", "Meeting"],
    }),
    assignAudioSpeakers: builder.mutation({
      query: ({ values, audioId }) => ({
        url: `/audio/assign-audio-speaker/${audioId}`,
        method: "POST",
        data: values,
      }),
      invalidatesTags: ["Meeting"],
    }),

    updateAudioText: builder.mutation({
      query: ({ payload, speakerProfileId }) => ({
        url: `/audio/update-audio-text/${speakerProfileId}`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Meeting"],
    }),

    deleteAudioText: builder.mutation({
      query: ({ speakerProfileId }) => ({
        url: `/audio/delete-audio-text/${speakerProfileId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Meeting"],
    }),
    deleteAudio: builder.mutation({
      query: ({ params }) => ({
        url: `/audio/${params.audioId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Meeting"],
    }),
  }),
});

export const {
  useReadManyAudiosQuery,
  useAssignAudioToMeetingMutation,
  useStartAudioProcessingMutation,
  useReadAudioSpeakersQuery,
  usePlayAudioMutation,
  usePlaySpeakerProfileMutation,
  useAssignAudioSpeakersMutation,
  useUpdateAudioTextMutation,
  useDeleteAudioTextMutation,
  useDeleteAudioMutation,
} = audioApi;
