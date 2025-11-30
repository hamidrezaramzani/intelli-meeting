"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineUsers } from "react-icons/hi";
import {
  MdDashboard,
  MdEvent,
  MdOutlineRecordVoiceOver,
  MdSettings,
} from "react-icons/md";

export const DashboardSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <MdDashboard size={20} />, link: "/dashboard" },
    { name: "Meetings", icon: <MdEvent size={20} />, link: "/meetings" },
    {
      name: "Audios",
      icon: <MdOutlineRecordVoiceOver size={20} />,
      link: "/audios",
    },
    {
      name: "Employees",
      icon: <HiOutlineUsers size={20} />,
      link: "/employees",
    },
    { name: "Settings", icon: <MdSettings size={20} />, link: "/settings" },
  ];

  return (
    <div className="flex flex-col gap-1 h-full">
      {menuItems.map((item) => {
        const isActive = pathname.startsWith(item.link);

        return (
          <Link
            href={item.link}
            key={item.name}
            className={`flex text-lg items-center gap-3 px-4 py-2.5 mb-8 rounded-xl font-medium transition-all
              ${isActive ? "bg-slate-800 text-white" : "text-slate-700 hover:bg-slate-200"}
            `}
          >
            <div className="text-lg">{item.icon}</div>
            {item.name}
          </Link>
        );
      })}
    </div>
  );
};
