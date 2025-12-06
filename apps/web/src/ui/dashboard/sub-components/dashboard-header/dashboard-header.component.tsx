import { IconButton, UserMenu } from "@intelli-meeting/shared-ui";
import { useRouter } from "next/navigation";
import { MdArrowBackIos, MdSettings } from "react-icons/md";

import { getUserMenuItems } from "@/lib/constants/user-menu";

import type { DashboardHeaderProps } from "./dashboard-header.type";

import { DashboardNotification } from "../dashboard-notification";

const DashboardHeader = ({ title, backUrl }: DashboardHeaderProps) => {
  const router = useRouter();
  const menuItems = getUserMenuItems(router);
  return (
    <header className="px-3 w-full bg-slate-800 flex items-center justify-between py-3 mb-4 rounded-2xl">
      <h2 className="text-xl flex pl-3 items-center gap-4 font-semibold  text-white">
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
        <DashboardNotification />

        <IconButton type="button" onClick={() => router.push("/settings")}>
          <MdSettings size={22} />
        </IconButton>

        <UserMenu menuItems={menuItems} />
      </div>
    </header>
  );
};

export default DashboardHeader;
