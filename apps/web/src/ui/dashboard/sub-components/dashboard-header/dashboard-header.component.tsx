import { IconButton, UserMenu } from "@intelli-meeting/shared-ui";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { MdArrowBackIos, MdSettings } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";

import { getUserMenuItems } from "@/lib/constants/user-menu";
import { LanguageToggle } from "@/ui";

import type { DashboardHeaderProps } from "./dashboard-header.type";

import { DashboardNotification } from "../dashboard-notification";

const DashboardHeader = ({
  title,
  backUrl,
  onMenuToggle,
  isMenuOpen,
}: DashboardHeaderProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const menuItems = getUserMenuItems(router);
  return (
    <header className="px-3 w-full bg-slate-800 flex flex-wrap md:flex-nowrap items-center justify-between gap-3 py-3 mb-4 rounded-2xl">
      <h2 className="text-lg sm:text-xl flex pl-3 items-center gap-3 font-semibold text-white">
        {onMenuToggle && (
          <button
            className="md:hidden p-1"
            type="button"
            onClick={onMenuToggle}
          >
            {isMenuOpen ? (
              <IoCloseOutline className="text-2xl" />
            ) : (
              <HiOutlineMenuAlt2 className="text-2xl" />
            )}
          </button>
        )}
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

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-nowrap overflow-visible ml-auto">
        <DashboardNotification />

        <LanguageToggle />

        <IconButton type="button" onClick={() => router.push("/settings")}>
          <MdSettings size={22} />
        </IconButton>

        <UserMenu
          avatarAlt={t("common:avatarAlt")}
          guestLabel={t("common:guest")}
          menuItems={menuItems}
          renderGreeting={(name) => t("common:greeting", { name })}
        />
      </div>
    </header>
  );
};

export default DashboardHeader;
