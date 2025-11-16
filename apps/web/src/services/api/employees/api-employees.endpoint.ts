import { baseApi } from "@intelli-meeting/store";

export const employeeApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    readManyEmployees: builder.query({
      query: ({ query }) => ({
        url: `/employee?limit=${query.limit}&page=${query.page}`,
        method: "GET",
      }),
      providesTags: ["Employees", "EmployeeCandidates"],
    }),
    readManyEmployeeCandidates: builder.query({
      query: () => ({
        url: `/employee/candidates`,
        method: "GET",
      }),
      transformResponse: (data) => data.employees,
    }),
    createEmployee: builder.mutation({
      query: (data: any) => ({
        url: `/employee`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["Employees"],
    }),
  }),
});

export const {
  useCreateEmployeeMutation,
  useReadManyEmployeeCandidatesQuery,
  useReadManyEmployeesQuery,
} = employeeApi;
