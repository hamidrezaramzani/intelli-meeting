export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  timeAgo: string;
  isRead?: boolean;
}

export type ReadDashboardNotificationsResponse = Notification[];
export interface ReadManyNotificationsResponse {
  total: number;
  notifications: Notification[];
}

export interface ReadManyNotificationsRequest {
  query: {
    limit: number;
    page: number;
  };
}
