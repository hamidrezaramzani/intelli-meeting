/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable next/no-img-element */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useReadUserProfileQuery } from "@intelli-meeting/store";
import { useState } from "react";

import type { UserMenuProps } from "./user-menu.type";

export const UserMenu = ({ menuItems }: UserMenuProps) => {
  const [open, setOpen] = useState(false);
  const { data } = useReadUserProfileQuery({});
  const employeeName = data?.user?.name || "guest";
  const avatarUrl = `https://avatar.iran.liara.run/username?username=${employeeName.replace(" ", "")}`;

  return (
    <div className="relative">
      <div
        className="rounded-full bg-slate-300 flex items-center justify-center text-sm font-roboto  font-semibold text-white cursor-pointer hover:opacity-90 transition"
        onClick={() => setOpen(!open)}
      >
        <img
          height={55}
          width={55}
          alt="user"
          className="w-12 rounded-md"
          src={avatarUrl}
        />
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-50 border border-slate-200 rounded-lg overflow-hidden z-10">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-100">
            <p className="text-sm font-roboto  text-gray-800 font-medium">
              Hello, {employeeName}!
            </p>
          </div>
          <ul className="text-sm font-roboto  text-gray-700">
            {menuItems?.map((item, idx) => (
              <li
                className="px-4 py-2 hover:bg-slate-200 cursor-pointer transition"
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
