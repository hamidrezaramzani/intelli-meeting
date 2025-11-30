"use client";
import "../globals.css";
import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import {
  MdOutlineCheckCircle,
  MdOutlineMail,
  MdOutlineShoppingCart,
} from "react-icons/md";

import { STASTICAL_ITEMS } from "@/lib/constant";
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

  useAuthRedirect({
    onRedirect: () => router.push("/sign-in"),
    type: "unlogged",
  });

  const today = new Date();

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

  const fakeMeetings = Array.from({ length: 10 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return {
      title: `Session ${i + 1}`,
      createDate: formatFullDate(date),
      startTime: `${9 + i}:00`,
      audios: 12,
    };
  });

  const fakeActivities = [
    {
      title: "New Order",
      description: "You have received a new order from John Doe",
      time: "2 mins ago",
      icon: MdOutlineShoppingCart,
    },
    {
      title: "Payment Completed",
      description: "Payment for order #1234 has been completed",
      time: "30 mins ago",
      icon: MdOutlineCheckCircle,
    },
    {
      title: "New Message",
      description: "You have a new message from Jane Smith",
      time: "1 hour ago",
      icon: MdOutlineMail,
    },
  ];

  const fakeEmployees = [
    {
      fullName: "Hamidreza ramzani",
      role: "Software development expert",
      totalMinutesAttended: 678,
    },
    {
      fullName: "Kamyar pourestesam",
      role: "Software development supervisor",
      totalMinutesAttended: 97,
    },
    {
      fullName: "Ashkan amiri",
      role: "Sales expert",
      totalMinutesAttended: 25,
    },
  ];

  return (
    <Dashboard title="Dashboard Home">
      <div className="w-full flex mt-3 gap-8">
        <div className="w-9/12 flex flex-col">
          <DashboardStatistics items={STASTICAL_ITEMS} />
          <DashboardDailySchedule meetings={fakeMeetings} />
        </div>
        <div className="w-3/12">
          <DashboardQuickActions />
          <DashboardTopEmployees employees={fakeEmployees} />
          <DashboardTimelineActivity activities={fakeActivities} />
        </div>
      </div>
    </Dashboard>
  );
};

export default DashboardPage;
