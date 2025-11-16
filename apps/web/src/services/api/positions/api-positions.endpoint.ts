import { baseApi } from "@intelli-meeting/store";

export const positionApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    readManyPositions: builder.query({
      query: ({ query }) => ({
        url: `/position?limit=${query.limit}&page=${query.page}`,
        method: "GET",
      }),
      providesTags: ["Positions"],
    }),
    readManyPositionCandidates: builder.query({
      query: () => ({
        url: `/position/candidates`,
        method: "GET",
      }),
    }),
    createPosition: builder.mutation({
      query: (data) => ({
        url: `/position`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["Positions"],
    }),
  }),
});

export const {
  useCreatePositionMutation,
  useReadManyPositionsQuery,
  useReadManyPositionCandidatesQuery,
} = positionApi;
