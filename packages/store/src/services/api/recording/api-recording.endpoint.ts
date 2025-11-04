import type {
  UploadRecordingRequest,
  UploadRecordingResponse,
} from "./api-recording.type";

import { baseApi } from "../../baseApi";

export const recordingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadRecording: builder.mutation<
      UploadRecordingResponse,
      UploadRecordingRequest
    >({
      query: (formData) => ({
        url: "/upload-recording",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUploadRecordingMutation } = recordingApi;
