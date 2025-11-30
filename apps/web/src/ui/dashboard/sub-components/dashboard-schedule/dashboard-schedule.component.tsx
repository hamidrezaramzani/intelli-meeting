/* eslint-disable @eslint-react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { motion } from "motion/react";
import { useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import { getBounceEffect } from "@/lib/helpers";
import { Table } from "@/ui";

import type { DailyScheduleProps } from "./dashboard-schedule.type";

export const DashboardDailySchedule = ({ meetings }: DailyScheduleProps) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

  const getVisibleDays = (date: Date) => {
    const days = [];
    for (let i = -4; i <= 4; i++) {
      const d = new Date(date);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const visibleDays = getVisibleDays(currentDate);

  const formatDay = (date: Date) => date.getDate();

  const formatFullDate = (date: Date) => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${dayNames[date.getDay()]} ${date.getDate()} ${monthNames[date.getMonth()]
      } ${date.getFullYear()}`;
  };

  return (
    <motion.div
      className="bg-white border border-slate-800 w-full mt-5 rounded-md p-5"
      {...getBounceEffect(0)}
    >
      <div className="flex flex-col gap-2 mb-8">
        <div className="w-full flex justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Daily Schedule</h1>
        </div>
        <p className="text-slate-600">
          Here are all the sessions scheduled for the selected day
        </p>
      </div>
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center gap-4 w-full justify-between">
          <button
            className="px-3 py-1 text-slate-600 text-2xl cursor-pointer"
            type="button"
            onClick={() =>
              setCurrentDate((d) => {
                const newDate = new Date(d);
                newDate.setDate(d.getDate() - 1);
                return newDate;
              })
            }
          >
            <MdChevronLeft />
          </button>
          <div className="flex gap-3">
            {visibleDays.map((day, idx) => (
              <div key={idx} onClick={() => setCurrentDate(new Date(day))}>
                <div
                  className={`w-12 h-12 rounded-full flex flex-col items-center justify-center cursor-pointer
                  ${day.toDateString() === currentDate.toDateString()
                      ? "bg-slate-800 text-white"
                      : "bg-gray-200 text-gray-700"
                    }`}
                >
                  <div className="text-xs">{DAYS[day.getDay()]}</div>
                  {formatDay(day)}
                </div>
              </div>
            ))}
          </div>
          <button
            className="px-3 py-1 text-slate-600 text-2xl cursor-pointer"
            type="button"
            onClick={() =>
              setCurrentDate((d) => {
                const newDate = new Date(d);
                newDate.setDate(d.getDate() + 1);
                return newDate;
              })
            }
          >
            <MdChevronRight />
          </button>
        </div>
      </div>
      <div className="w-full mt-8">
        <Table
          data={meetings}
          title={formatFullDate(currentDate)}
          columns={[
            { key: "title", label: "Title" },
            { key: "createDate", label: "Create date" },
            { key: "startTime", label: "Start time" },
            { key: "audios", label: "Audios" },
          ]}
          description="..."
        />
      </div>
    </motion.div>
  );
};
