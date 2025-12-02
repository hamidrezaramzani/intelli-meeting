import { motion } from "motion/react";
import { MdOutlineQuestionMark } from "react-icons/md";

import { getBounceEffect } from "@/lib/helpers";
import { useReadDashboardStatisticsQuery } from "@/services";

import type { StatItem } from "./dashboard-statistics.type";

import { DashboardStatisticsSkeletonLoading } from "../dashboard-statistics-skeleton-loading";
import { getDashboardStatistics } from "./dashboard-statistics.constant";

export const DashboardStatistics = () => {
  const { data: statistics, isLoading } = useReadDashboardStatisticsQuery({});

  const items: StatItem[] = getDashboardStatistics(statistics);

  if (isLoading) return <DashboardStatisticsSkeletonLoading />;

  return (
    <div className="w-full flex gap-4">
      {items.map((item, index) => (
        <motion.div
          className="flex items-center bg-slate-800 border group w-2/6 p-5 py-6 gap-6 rounded-md"
          key={item.title}
          {...getBounceEffect(index)}
        >
          <div>
            <div className="border border-slate-200 p-3 py-5 flex items-center justify-center rounded-full">
              <item.icon className="text-slate-200 text-3xl transition-transform duration-300 group-hover:rotate-35" />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between w-full">
              <span className="text-slate-400 w-full flex gap-3 items-center text-sm">
                {item.title}
              </span>
              <button className="cursor-pointer" type="button">
                <MdOutlineQuestionMark className="text-sm text-slate-400" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <h3 className="text-4xl text-slate-200">{item.value}</h3>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
