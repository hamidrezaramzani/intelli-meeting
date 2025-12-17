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
    readOneEmployee: builder.query({
      query: ({ params }) => ({
        url: `/employee/${params.id}`,
        method: "GET",
      }),
      transformResponse: (employee) => employee.employee,
    }),
    createEmployee: builder.mutation({
      query: (data: any) => ({
        url: `/employee`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["Employees"],
    }),
    updateEmployee: builder.mutation({
      query: ({ data, params }) => ({
        url: `/employee/${params.id}`,
        method: "PUT",
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
  useReadOneEmployeeQuery,
  useUpdateEmployeeMutation,
} = employeeApi;
