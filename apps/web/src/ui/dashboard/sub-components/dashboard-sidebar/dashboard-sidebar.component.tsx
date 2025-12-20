"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { HiOutlineUsers } from "react-icons/hi";
import { MdDashboard, MdEvent, MdSettings } from "react-icons/md";

export const DashboardSidebar = () => {
  const { t } = useTranslation();

  const pathname = usePathname();

  const menuItems = [
    {
      name: t("dashboard:sidebar.dashboard"),
      icon: <MdDashboard size={20} />,
      link: "/dashboard",
    },
    {
      name: t("dashboard:sidebar.meetings"),
      icon: <MdEvent size={20} />,
      link: "/meetings",
    },
    {
      name: t("dashboard:sidebar.employees"),
      icon: <HiOutlineUsers size={20} />,
      link: "/employees",
    },
    {
      name: t("dashboard:sidebar.settings"),
      icon: <MdSettings size={20} />,
      link: "/settings",
    },
  ];

  return (
    <div className="flex flex-col gap-1 h-full">
      {menuItems.map((item) => {
        const isActive = pathname.startsWith(item.link);

        return (
          <Link
            href={item.link}
            key={item.name}
            className={`flex font-roboto text-lg font-roboto  items-center gap-3 px-4 py-2.5 mb-8 rounded-xl font-medium transition-all
              ${isActive ? "bg-slate-800 text-white" : "text-slate-700 hover:bg-slate-200"}
            `}
          >
            <div className="text-lg font-roboto ">{item.icon}</div>
            {item.name}
          </Link>
        );
      })}
    </div>
  );
};
