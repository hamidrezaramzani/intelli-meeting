import { IconButton } from "@intelli-meeting/shared-ui";
import Image from "next/image";
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
        <IconButton>
          <MdNotificationsNone size={22} />
        </IconButton>

        <IconButton type="button">
          <MdSettings size={22} />
        </IconButton>

        <div className="w-24 rounded-full bg-slate-300 flex items-center justify-center text-sm font-semibold text-white cursor-pointer hover:opacity-90 transition">
          <Image
            height={55}
            width={55}
            alt="user"
            className="w-12 rounded-md"
            src="https://avatar.iran.liara.run/public"
          />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
