import { motion } from "motion/react";
import { MdOutlineStars } from "react-icons/md";

import { getBounceEffect } from "@/lib/helpers";
import { useReadDashboardTimelineQuery } from "@/services";

export const DashboardTimelineActivity = () => {
  const { data: timeline } = useReadDashboardTimelineQuery({});

  return (
    <div className="relative flex flex-col border border-slate-800 rounded-md w-full bg-white p-5">
      <div className="flex flex-col gap-2 mb-4">
        <div className="w-full flex justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Timeline</h1>
        </div>
        <p className="text-slate-600">
          Here are all the activities timeline created for today
        </p>
      </div>
      {timeline?.map((item, index) => (
        <motion.div
          className="flex items-start gap-8"
          key={index}
          {...getBounceEffect(index)}
        >
          <div className="flex-1 rounded-md py-4 w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-200 rounded-full flex items-center justify-center">
                <MdOutlineStars />
              </div>
              <div className="flex flex-col">
                <h3 className="text-slate-800 font-medium">
                  {item.title}{" "}
                  <span className="text-xs text-slate-500 ml-3">
                    {item.timeAgo}
                  </span>
                </h3>
                <p className="text-slate-600 text-sm">{item.message}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
