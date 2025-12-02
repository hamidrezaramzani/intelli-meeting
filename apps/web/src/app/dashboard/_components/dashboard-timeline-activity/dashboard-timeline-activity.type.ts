import type { IconType } from "react-icons";

interface ActivityItem {
  title: string;
  description: string;
  time: string;
  icon: IconType;
}

export interface ActivityTimelineProps {
  activities: ActivityItem[];
}
