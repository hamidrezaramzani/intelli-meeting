import type { TFunction } from "i18next";

import {
  MdOutlineCameraEnhance,
  MdOutlineTextsms,
  MdPendingActions,
} from "react-icons/md";

import type { DashboardStatisticsResponse } from "@/services";

export const getDashboardStatistics = (
  t: TFunction,
  statistics?: DashboardStatisticsResponse,
) => [
  {
    title: t("dashboard:statistical.allMeetings"),
    icon: MdOutlineCameraEnhance,
    value: statistics?.allMeetingsCount || "00",
  },
  {
    title: t("dashboard:statistical.processedAudios"),
    icon: MdOutlineTextsms,
    value: statistics?.processedAudiosCount || "00",
  },
  {
    title: t("dashboard:statistical.futureMeetings"),
    icon: MdPendingActions,
    value: statistics?.futureMeetingsCount || "00",
  },
];
