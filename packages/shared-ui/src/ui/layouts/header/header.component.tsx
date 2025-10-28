import type { ReactNode } from "react";

import { useState } from "react";
import { HiOutlineBell, HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";

import type { HeaderProps } from "./header.type";

import { Button } from "../../components";

export const Header = ({ menus, navigate }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const renderMenuItems = (
    getContainer: (menu: HeaderProps["menus"][number]) => ReactNode,
  ) => {
    return menus.map((menu) => getContainer(menu));
  };

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

          <div className="hidden md:flex items-center gap-3">
            <Button onClick={() => navigate("/sign-in")}>Login</Button>
            <Button onClick={() => navigate("/sign-up")}>Register</Button>
            <div className="relative">
              <button
                className="cursor-pointer"
                type="button"
                onClick={() => setIsUserMenuOpen((prevOpen) => !prevOpen)}
              >
                <img
                  alt="user"
                  className="w-12 h-12 rounded-full border border-gray-200 shadow-sm"
                  src="https://avatar.iran.liara.run/public"
                />
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 z-20"
                  id="dropdownAvatar"
                >
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <a
                        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                        href="/"
                      >
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a
                        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                        href="/settings"
                      >
                        Settings
                      </a>
                    </li>
                    <li>
                      <a
                        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                        href="/logout"
                      >
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
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

          <button
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-black rounded-lg md:hidden hover:text-brand-700 "
            type="button"
          >
            <span className="sr-only">Open main menu</span>
            <HiOutlineBell className="text-3xl" />
          </button>

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
