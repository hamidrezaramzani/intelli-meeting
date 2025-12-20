/* eslint-disable max-lines-per-function */
import type { RootState } from "@intelli-meeting/store";
import type { ReactNode } from "react";

import { useRef, useState } from "react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

import type { HeaderProps } from "./header.type";

import { Button, UserMenu } from "..";

export const Header = ({ menus, navigate, menuItems }: HeaderProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const renderMenuItems = (
    getContainer: (menu: HeaderProps["menus"][number]) => ReactNode,
  ) => {
    return menus.map((menu) => getContainer(menu));
  };

  const renderUserDropdown = () => (
    <div className="relative w-12 h-12" ref={menuRef}>
      {isLoggedIn && menuItems && <UserMenu menuItems={menuItems} />}
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
            <a
              className="text-lg font-roboto  font-regular text-black"
              href="/"
            >
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
            {renderUserDropdown()}
          </div>
        </div>
        <div className="flex justify-between md:hidden py-4">
          <button
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm font-roboto  text-black rounded-lg md:hidden hover:text-brand-700 "
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span className="sr-only">Open main menu</span>
            <HiOutlineMenuAlt2 className="text-3xl  font-roboto" />
          </button>

          <a
            className="flex items-center space-x-3 rtl:space-x-reverse"
            href="/"
          >
            <span className="self-center text-lg font-roboto  font-regular whitespace-nowrap text-black">
              Intelli Meetings
            </span>
          </a>

          {renderUserDropdown()}
        </div>

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
                <IoCloseOutline className="text-3xl font-roboto" />
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
      </nav>
    </header>
  );
};
