export interface DashboardStatisticsResponse {
  allMeetingsCount: string;
  processedAudiosCount: string;
  futureMeetingsCount: string;
}

export type DashboardMeetingScheduleResponse = {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
}[];

export interface DashboardMeetingScheduleRequest {
  candidateDate: string;
}

export type DashboardTopEmployeesResponse = {
  id: number;
  employeeName: string;
  totalTime: string;
  position: {
    id: number;
    title: string;
  };
}[];

export type DashboardTimelineResponse = {
  id: number;
  title: string;
  message: string;
  type: string;
  timeAgo: string;
}[];
