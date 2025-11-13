import type {
  AudioUploadRequestBody,
  AudioUploadRequestResponse,
} from "./audio-api.type";

import { baseApi } from "../../baseApi";

export const audioApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadAudio: builder.mutation<
      AudioUploadRequestResponse,
      AudioUploadRequestBody
    >({
      query: (data) => ({
        url: "/audio/upload-recording",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const { useUploadAudioMutation } = audioApi;
