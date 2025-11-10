import Link from "next/link";
import { MdDashboard, MdEvent, MdGroups, MdSettings } from "react-icons/md";

export const DashboardSidebar = () => {
  const menuItems = [
    { name: "Dashboard", icon: <MdDashboard size={20} />, link: "/dashboard" },
    { name: "Meetings", icon: <MdEvent size={20} />, link: "/meetings" },
    { name: "Users", icon: <MdGroups size={20} />, link: "/audios" },
    { name: "Settings", icon: <MdSettings size={20} />, link: "/settings" },
  ];

  return (
    <div className="flex flex-col gap-1">
      {menuItems.map((item) => (
        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-200 cursor-pointer transition-all"
          key={item.name}
        >
          {item.icon}
          <Link className="text-sm font-medium" href={item.link}>
            {item.name}
          </Link>
        </div>
      ))}
    </div>
  );
};
