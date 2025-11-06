import type {
  AudioUploadRequestBody,
  AudioUploadRequestResponse,
} from "./api-audio.type";

import { baseApi } from "../../baseApi";

export const audioApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadAudio: builder.mutation<
      AudioUploadRequestResponse,
      AudioUploadRequestBody
    >({
      query: (formData) => ({
        url: "/audio/upload",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUploadAudioMutation } = audioApi;
