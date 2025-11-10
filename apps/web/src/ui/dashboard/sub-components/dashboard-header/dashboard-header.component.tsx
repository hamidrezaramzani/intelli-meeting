import { useRouter } from "next/navigation";
import {
  MdArrowBackIos,
  MdNotificationsNone,
  MdSettings,
} from "react-icons/md";

import type { DashboardHeaderProps } from "./dashboard-header.type";

const DashboardHeader = ({ title, backUrl }: DashboardHeaderProps) => {
  const router = useRouter();

  return (
    <header className="w-full flex items-center justify-between py-3 rounded-2xl">
      <h2 className="text-lg flex items-center gap-4 font-semibold text-slate-800">
        {backUrl && (
          <button
            className="cursor-pointer"
            type="button"
            onClick={() => router.push(backUrl)}
          >
            <MdArrowBackIos />
          </button>
        )}
        {title}
      </h2>

      <div className="flex items-center gap-4">
        <button
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          type="button"
        >
          <MdNotificationsNone size={22} className="text-slate-600" />
        </button>

        <button
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          type="button"
        >
          <MdSettings size={22} className="text-slate-600" />
        </button>

        <div className="w-9 h-9 rounded-full bg-slate-300 flex items-center justify-center text-sm font-semibold text-white cursor-pointer hover:opacity-90 transition">
          HR
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
