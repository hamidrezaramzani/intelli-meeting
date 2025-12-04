export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
}

export interface NotificationState {
  list: Notification[];
  newNotification?: Notification;
}
