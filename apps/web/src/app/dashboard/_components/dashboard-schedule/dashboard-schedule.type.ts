interface DashboardMeeting {
  title: string;
  createDate: string;
  startTime: string;
  audios: number;
}

export interface DailyScheduleProps {
  meetings: DashboardMeeting[];
}
