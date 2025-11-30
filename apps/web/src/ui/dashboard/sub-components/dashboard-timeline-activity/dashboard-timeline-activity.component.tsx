import { motion } from "motion/react";
import { FC } from "react";

import type { ActivityTimelineProps } from "./dashboard-timeline-activity.type";

export const DashboardTimelineActivity = ({
  activities,
}: ActivityTimelineProps) => {
  const getBounceEffect = (coefficient: number) => ({
    animate: { y: 0, opacity: 1 },
    initial: { y: -30, opacity: 0 },
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 10,
      delay: 0.05 * coefficient,
    },
  });

  return (
    <div className="relative flex flex-col border border-slate-800 rounded-md w-full bg-white p-5">
      <div className="flex flex-col gap-2 mb-8">
        <div className="w-full flex justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Timeline</h1>
        </div>
        <p className="text-slate-600">
          Here are all the activities created for the selected day
        </p>
      </div>
      {activities.map((item, index) => (
        <motion.div
          className="flex items-start gap-4"
          key={index}
          {...getBounceEffect(index)}
        >
          <div className="flex-1 rounded-md py-4 w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-200 rounded-full flex items-center justify-center">
                <item.icon className="text-slate-700 text-xl" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-slate-800 font-medium">
                  {item.title} <span className="text-xs text-slate-500">{item.time}</span>
                </h3>
                <p className="text-slate-600 text-sm">{item.description}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
