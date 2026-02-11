/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable next/no-img-element */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useReadUserProfileQuery } from "@intelli-meeting/store";
import { useState } from "react";

import type { UserMenuProps } from "./user-menu.type";

export const UserMenu = ({
  menuItems,
  guestLabel,
  avatarAlt,
  renderGreeting,
  variant = "default",
}: UserMenuProps) => {
  const [open, setOpen] = useState(false);
  const { data } = useReadUserProfileQuery({});
  const employeeName =
    data?.user?.first_name && data?.user?.last_name
      ? `${data.user.first_name} ${data.user.last_name}`
      : data?.user?.name || guestLabel || "";
  const avatarUrl = `https://api.dicebear.com/9.x/miniavs/svg?seed=${employeeName.replace(" ", "")}`;
  const greeting = renderGreeting ? renderGreeting(employeeName) : employeeName;
  const isLanding = variant === "landing";

  const triggerClasses = isLanding
    ? "bg-white/10 border border-white/20 backdrop-blur text-white hover:bg-white/20"
    : "bg-slate-300 text-white hover:opacity-90";

  const dropdownClasses = isLanding
    ? "bg-slate-900/95 border-white/10 text-slate-100"
    : "bg-slate-50 border-slate-200 text-gray-700";

  return (
    <div className="relative z-50">
      <div
        className={`rounded-full flex items-center justify-center text-sm font-roboto font-semibold cursor-pointer transition shadow-lg shadow-black/20 ${triggerClasses}`}
        onClick={() => setOpen(!open)}
      >
        <img
          height={55}
          width={55}
          alt={avatarAlt}
          className="w-12 rounded-md"
          src={avatarUrl}
        />
      </div>

      {open && (
        <div
          className={`absolute right-0 mt-2 w-52 rounded-xl overflow-hidden z-20 border shadow-xl shadow-black/30 ${dropdownClasses}`}
        >
          <div
            className={`px-4 py-3 border-b ${
              isLanding
                ? "border-white/10 bg-white/5"
                : "border-slate-200 bg-slate-100"
            }`}
          >
            <p
              className={`text-sm font-roboto font-medium ${
                isLanding ? "text-slate-50" : "text-gray-800"
              }`}
            >
              {greeting}
            </p>
          </div>
          <ul
            className={`text-sm font-roboto ${
              isLanding ? "text-slate-100" : "text-gray-700"
            }`}
          >
            {menuItems?.map((item, idx) => (
              <li
                className={`px-4 py-2 cursor-pointer transition ${
                  isLanding ? "hover:bg-white/10" : "hover:bg-slate-200"
                }`}
                key={idx}
                onClick={() => {
                  setOpen(false);
                  item.onClick();
                }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
