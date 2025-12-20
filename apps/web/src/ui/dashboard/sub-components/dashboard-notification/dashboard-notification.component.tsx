import { EmptyState, IconButton } from "@intelli-meeting/shared-ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiCheckDouble } from "react-icons/bi";
import { MdNotificationsNone } from "react-icons/md";
import { RiExpandDiagonalLine } from "react-icons/ri";
import { toast } from "react-toastify";

import {
  useMarkAllNotificationsAsReadMutation,
  useReadDashboardNotificationsQuery,
} from "@/services";
import { useTranslation } from "react-i18next";

export const DashboardNotification = () => {
  const { t } = useTranslation();

  const router = useRouter();

  const { data: notifications = [] } = useReadDashboardNotificationsQuery({});

  const [markAllNotificationsAsRead] = useMarkAllNotificationsAsReadMutation();

  const [open, setOpen] = useState(false);

  const handleMarkAllNotificationsAsReadClick = async () => {
    await toast.promise(markAllNotificationsAsRead({}).unwrap(), {
      pending: "Marking all notifications as read…",
      error: "Failed to mark notifications as read. Please try again.",
      success: "All notifications marked as read",
    });
  };

  const handleOpenNotificationsListClick = () => {
    router.push("/notifications");
  };

  return (
    <div className="relative">
      <IconButton onClick={() => setOpen(!open)}>
        <MdNotificationsNone size={22} />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-0 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </IconButton>

      {open && (
        <div className="p-4 rounded-md absolute border border-slate-300 right-0 mt-2 w-96 bg-white text-slate-800 flex flex-col max-h-144 overflow-y-auto z-50">
          <div className="w-full mb-3 flex justify-between items-center">
            <h3>{t("dashboard:notifications.title")}</h3>
            <div className="flex gap-2 items-center">
              {notifications && notifications.length > 0 && (
                <IconButton
                  size="sm"
                  title={t("dashboard:notifications.marksAllRead")}
                  onClick={handleMarkAllNotificationsAsReadClick}
                >
                  <BiCheckDouble className="text-xl" />
                </IconButton>
              )}

              <IconButton
                size="sm"
                title={t("dashboard:notifications.allNotifications")}
                onClick={handleOpenNotificationsListClick}
              >
                <RiExpandDiagonalLine className="text-xl" />
              </IconButton>
            </div>
          </div>
          {notifications.length === 0 && (
            <EmptyState
              title={t("dashboard:notifications.allCaughtUp")}
              description={t("dashboard:notifications.youHaveNoNotifications")}
            />
          )}
          {notifications.map((n) => (
            <div
              className="p-3 rounded-md hover:bg-slate-50 cursor-pointer flex gap-4 items-center"
              key={n.id}
            >
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center w-full">
                  <span className="font-semibold text-sm font-roboto ">
                    {n.title}
                  </span>
                  <span className="text-slate-400 text-xs font-roboto ">
                    {n.timeAgo}
                  </span>
                </div>
                <span className="text-xs font-roboto  text-slate-500">
                  {n.message}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
