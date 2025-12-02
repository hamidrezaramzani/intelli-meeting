import { baseApi } from "@intelli-meeting/store";

import type {
  DashboardMeetingScheduleRequest,
  DashboardMeetingScheduleResponse,
  DashboardStatisticsResponse,
  DashboardTimelineResponse,
  DashboardTopEmployeesResponse,
} from "./api-dashboard.type";

export const dashboardApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    readDashboardStatistics: builder.query<
      DashboardStatisticsResponse,
      unknown
    >({
      query: () => ({
        url: `/dashboard/statistics`,
        method: "GET",
      }),
    }),

    readDashboardMeetingsSchedule: builder.query<
      DashboardMeetingScheduleResponse,
      DashboardMeetingScheduleRequest
    >({
      query: ({ candidateDate }) => ({
        url: `/dashboard/meeting-schedules/${candidateDate}`,
        method: "GET",
      }),
    }),

    readDashboardTopEmployees: builder.query<
      DashboardTopEmployeesResponse,
      unknown
    >({
      query: () => ({
        url: `/dashboard/top-employees`,
        method: "GET",
      }),
    }),

    readDashboardTimeline: builder.query<DashboardTimelineResponse, unknown>({
      query: () => ({
        url: `/dashboard/timeline`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useReadDashboardStatisticsQuery,
  useReadDashboardMeetingsScheduleQuery,
  useReadDashboardTopEmployeesQuery,
  useReadDashboardTimelineQuery,
} = dashboardApi;
