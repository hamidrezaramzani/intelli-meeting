/* eslint-disable max-lines-per-function */
import type { AppDispatch, RootState } from "@intelli-meeting/store";
import type { ReactNode } from "react";

import { logout } from "@intelli-meeting/store";
import { useRef, useState } from "react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

import type { HeaderProps } from "./header.type";

import { Button } from "..";

export const Header = ({ menus, navigate }: HeaderProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const renderMenuItems = (
    getContainer: (menu: HeaderProps["menus"][number]) => ReactNode,
  ) => {
    return menus.map((menu) => getContainer(menu));
  };

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(logout());
  };

  const getUserDropdown = () => (
    <div className="relative w-12 h-12" ref={menuRef}>
      {isLoggedIn && (
        <button
          className="cursor-pointer w-12 h-12"
          type="button"
          onClick={() => setIsUserMenuOpen((prevOpen) => !prevOpen)}
        >
          <img
            alt="user"
            className="w-12 h-12 rounded-full border border-gray-200 shadow-sm"
            src="https://avatar.iran.liara.run/public"
          />
        </button>
      )}

      {isUserMenuOpen && (
        <div
          className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 z-20"
          id="dropdownAvatar"
        >
          <ul className="py-2 text-sm text-gray-700">
            <li>
              <button
                className="cursor-pointer block px-4 py-2 hover:bg-gray-100 transition-colors w-full text-left"
                type="button"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer block px-4 py-2 hover:bg-gray-100 transition-colors w-full text-left"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <header className="w-full flex justify-between items-center">
      <nav className="w-full bg-white">
        <div className="w-full hidden md:flex flex-wrap items-center justify-between py-4">
          <div className="flex gap-12">
            {renderMenuItems((menu) => (
              <div key={menu.id}>
                <a className="text-black" href={menu.link}>
                  {menu.title}
                </a>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center">
            <a className="text-lg font-regular text-black" href="/">
              Intelli Meetings
            </a>
          </div>

          <div className="md:flex items-center gap-3">
            {!isLoggedIn && (
              <div className="hidden md:flex gap-3">
                <Button onClick={() => navigate("/sign-in")}>Login</Button>
                <Button onClick={() => navigate("/sign-up")}>Register</Button>
              </div>
            )}
            {getUserDropdown()}
          </div>
        </div>
        <div className="flex justify-between md:hidden py-4">
          <button
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-black rounded-lg md:hidden hover:text-brand-700 "
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span className="sr-only">Open main menu</span>
            <HiOutlineMenuAlt2 className="text-3xl" />
          </button>

          <a
            className="flex items-center space-x-3 rtl:space-x-reverse"
            href="/"
          >
            <span className="self-center text-lg font-regular whitespace-nowrap text-black">
              Intelli Meetings
            </span>
          </a>

          {getUserDropdown()}

          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } w-full md:hidden md:w-auto absolute top-0 left-0 h-screen bg-white`}
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4  gap-5 md:space-x-8 rtl:space-x-reverse">
              <li>
                <button
                  className="cursor-pointer"
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IoCloseOutline className="text-3xl" />
                </button>
              </li>
              {renderMenuItems((menu) => (
                <li key={menu.id}>
                  <a
                    className="block py-2 px-3 text-black rounded"
                    href={menu.title}
                  >
                    {menu.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
