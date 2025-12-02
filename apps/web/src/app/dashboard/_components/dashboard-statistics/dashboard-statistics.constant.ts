import {
  MdOutlineCameraEnhance,
  MdOutlineTextsms,
  MdPendingActions,
} from "react-icons/md";

import type { DashboardStatisticsResponse } from "@/services";

export const getDashboardStatistics = (
  statistics?: DashboardStatisticsResponse,
) => [
  {
    title: "All meetings",
    icon: MdOutlineCameraEnhance,
    value: statistics?.allMeetingsCount || "00",
  },
  {
    title: "Processed audios",
    icon: MdOutlineTextsms,
    value: statistics?.processedAudiosCount || "00",
  },
  {
    title: "Future meetings",
    icon: MdPendingActions,
    value: statistics?.futureMeetingsCount || "00",
  },
];
