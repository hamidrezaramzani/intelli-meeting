"use client";
import "../globals.css";
import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import {
  Dashboard,
  DashboardDailySchedule,
  DashboardStatistics,
  DashboardTimelineActivity,
} from "@/ui";
import {
  DashboardQuickActions,
  DashboardTopEmployees,
} from "@/ui/dashboard/sub-components";

const DashboardPage = () => {
  const router = useRouter();

  const { t } = useTranslation();

  useAuthRedirect({
    onRedirect: () => router.push("/sign-in"),
    type: "unlogged",
  });

  return (
    <Dashboard title={t("dashboard:title")}>
      <div className="w-full flex mt-3 gap-8">
        <div className="w-9/12 flex flex-col">
          <DashboardStatistics />
          <DashboardDailySchedule />
          <DashboardTimelineActivity />
        </div>
        <div className="w-3/12">
          <DashboardQuickActions />
          <DashboardTopEmployees />
        </div>
      </div>
    </Dashboard>
  );
};

export default DashboardPage;
