/* eslint-disable max-lines-per-function */
/* eslint-disable @eslint-react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { IconButton } from "@intelli-meeting/shared-ui";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { LuCalendar1, LuCalendarCheck2 } from "react-icons/lu";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { Calendar } from "react-multi-date-picker";

import { getBounceEffect } from "@/lib/helpers";
import { useReadDashboardMeetingsScheduleQuery } from "@/services";
import { Table } from "@/ui";
import { useTranslation } from "react-i18next";

export const DashboardDailySchedule = () => {
  const today = new Date();

  const { t } = useTranslation();

  const [currentDate, setCurrentDate] = useState(today);
  const [showCalendar, setShowCalendar] = useState(false);

  const { data: meetings, isLoading } = useReadDashboardMeetingsScheduleQuery({
    candidateDate: currentDate.toISOString(),
  });

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
    return `${dayNames[date.getDay()]} ${date.getDate()} ${
      monthNames[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  const handleScheduleDateSelect = (
    mode: "next" | "prev" | "select",
    selectedDate?: Date,
  ) => {
    if (mode === "prev") {
      const newDate = new Date();
      newDate.setDate(currentDate.getDate() - 1);
      setCurrentDate(newDate);
      return;
    }

    if (mode === "next") {
      const newDate = new Date();
      newDate.setDate(currentDate.getDate() - 1);
      setCurrentDate(newDate);
      return;
    }

    if (!selectedDate) {
      console.error("Selected date not found");
      return;
    }

    setCurrentDate(selectedDate);
  };

  const changeDateToToday = () => setCurrentDate(new Date());

  return (
    <motion.div
      className="bg-white border border-slate-800 w-full my-5 rounded-md p-5"
      {...getBounceEffect(0)}
    >
      <div className="flex flex-col gap-2 mb-8">
        <div className="w-full flex justify-between">
          <h1 className="text-2xl font-roboto font-bold text-slate-800">
            {t("dashboard:dailySchedule.title")}
          </h1>
        </div>
        <p className="text-slate-600">
          {t("dashboard:dailySchedule.description")}
        </p>
      </div>
      <div className="flex flex-col items-center w-full">
        <div className="flex items-center gap-4 w-full justify-between">
          <button
            className="px-3 py-1 text-slate-600 text-2xl font-roboto cursor-pointer"
            type="button"
            onClick={() => handleScheduleDateSelect("prev")}
          >
            <MdChevronLeft />
          </button>
          <div className="flex gap-3 items-center">
            <IconButton title="Go to today" onClick={changeDateToToday}>
              <LuCalendar1 className="text-xl" />
            </IconButton>
            {visibleDays.map((day, idx) => (
              <div
                key={idx}
                onClick={() =>
                  handleScheduleDateSelect("select", new Date(day))
                }
              >
                <div
                  className={`w-12 h-12 rounded-full flex flex-col items-center justify-center cursor-pointer
                  ${
                    day.toDateString() === currentDate.toDateString()
                      ? "bg-slate-800 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <div className="text-xs font-roboto ">{DAYS[day.getDay()]}</div>
                  {formatDay(day)}
                </div>
              </div>
            ))}
            <div className="relative">
              <IconButton
                title="Select a date from date picker"
                onClick={() => setShowCalendar((prevShow) => !prevShow)}
              >
                <LuCalendarCheck2 className="text-xl" />
              </IconButton>
              {showCalendar ? (
                <Calendar
                  className="top-15 right-0 absolute"
                  value={currentDate}
                  onChange={(date) =>
                    handleScheduleDateSelect("select", date?.toDate())
                  }
                />
              ) : null}
            </div>
          </div>
          <button
            className="px-3 py-1 text-slate-600 text-2xl font-roboto cursor-pointer"
            type="button"
            onClick={() => handleScheduleDateSelect("next")}
          >
            <MdChevronRight />
          </button>
        </div>
      </div>
      <div className="w-full mt-8">
        <Table
          data={meetings || []}
          title={formatFullDate(currentDate)}
          columns={[
            {
              key: "title",
              label: t("dashboard:dailySchedule.columns.title"),
              render: (row) => (
                <Link href={`/meeting/${row.id}`}>{row.title}</Link>
              ),
            },
            { key: "date", label: t("dashboard:dailySchedule.columns.date") },
            {
              key: "startTime",
              label: t("dashboard:dailySchedule.columns.startTime"),
            },
            {
              key: "endTime",
              label: t("dashboard:dailySchedule.columns.endTime"),
            },
          ]}
          description="..."
          loading={isLoading}
        />
      </div>
    </motion.div>
  );
};
