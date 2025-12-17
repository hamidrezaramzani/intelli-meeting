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
    readOnePosition: builder.query({
      query: ({ params }) => ({
        url: `/position/${params.id}`,
        method: "GET",
      }),
      transformResponse: (position) => position.position,
    }),
    createPosition: builder.mutation({
      query: (data) => ({
        url: `/position`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["Positions"],
    }),
    editPosition: builder.mutation({
      query: ({ data, params }) => ({
        url: `/position/${params.id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Positions"],
    }),

    deletePosition: builder.mutation({
      query: ({ params }) => ({
        url: `/position/${params.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Positions"],
    }),
  }),
});

export const {
  useCreatePositionMutation,
  useReadManyPositionsQuery,
  useReadManyPositionCandidatesQuery,
  useReadOnePositionQuery,
  useEditPositionMutation,
  useDeletePositionMutation,
} = positionApi;
