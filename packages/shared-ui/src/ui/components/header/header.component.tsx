/* eslint-disable max-lines-per-function */
import type { RootState } from "@intelli-meeting/store";
import type { ReactNode } from "react";

import { useRef, useState } from "react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

import type { HeaderProps } from "./header.type";

import { Button, UserMenu } from "..";

export const Header = ({
  menus,
  navigate,
  menuItems,
  actions,
  brandLabel,
  brandHref,
  loginLabel,
  registerLabel,
  openMenuLabel,
  variant = "default",
  userMenuProps,
}: HeaderProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const isLanding = variant === "landing";
  const navBg = isLanding
    ? "bg-transparent backdrop-blur-md"
    : "bg-white";
  const textColor = isLanding ? "text-slate-100" : "text-black";
  const mobileBg = isLanding ? "bg-slate-900/95 text-slate-100" : "bg-white";
  const brandClasses = `${textColor} text-lg font-roboto font-semibold`;
  const linkClasses = `${textColor} hover:opacity-80 transition-colors text-sm sm:text-base font-medium`;
  const userMenuVariant = userMenuProps?.variant ?? (isLanding ? "landing" : "default");

  const renderMenuItems = (
    getContainer: (menu: HeaderProps["menus"][number]) => ReactNode,
  ) => {
    return menus.map((menu) => getContainer(menu));
  };

  const renderUserDropdown = () => (
    <div className="relative w-12 h-12" ref={menuRef}>
      {isLoggedIn && menuItems && (
        <UserMenu
          menuItems={menuItems}
          variant={userMenuVariant}
          {...userMenuProps}
        />
      )}
    </div>
  );

  return (
    <header className="w-full flex justify-between items-center relative z-50">
      <nav
        className={`w-full relative ${navBg} ${isLanding ? "rounded-2xl border border-white/10 px-4 py-3" : ""}`}
      >
        <div className="w-full hidden md:flex flex-wrap items-center justify-between py-3">
          <div className="flex gap-8 lg:gap-12 items-center">
            {renderMenuItems((menu) => (
              <div key={menu.id}>
                <a className={linkClasses} href={menu.link}>
                  {menu.title}
                </a>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center">
            <a className={brandClasses} href={brandHref}>
              {brandLabel}
            </a>
          </div>

          <div className="md:flex items-center gap-3">
            {actions}
            {!isLoggedIn && (
              <div className="hidden md:flex gap-3">
                <Button
                  fullWidth={false}
                  variant={isLanding ? "secondary" : "default"}
                  className={
                    isLanding
                      ? "rounded-full border border-white/30 bg-white/10 px-4 py-2 text-white hover:bg-white/20"
                      : undefined
                  }
                  onClick={() => navigate("/sign-in")}
                >
                  {loginLabel}
                </Button>
                <Button
                  fullWidth={false}
                  variant="primary"
                  className={
                    isLanding
                      ? "rounded-full px-4 py-2 bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                      : undefined
                  }
                  onClick={() => navigate("/sign-up")}
                >
                  {registerLabel}
                </Button>
              </div>
            )}
            {renderUserDropdown()}
          </div>
        </div>
        <div className="flex justify-between md:hidden py-4 items-center">
          <button
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm font-roboto  text-black rounded-lg md:hidden hover:text-brand-700 "
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span className="sr-only">{openMenuLabel}</span>
            <HiOutlineMenuAlt2
              className={`text-3xl font-roboto ${textColor}`}
            />
          </button>

          <a
            className="flex items-center space-x-3 rtl:space-x-reverse"
            href={brandHref}
          >
            <span className={`self-center text-lg font-roboto font-semibold whitespace-nowrap ${textColor}`}>
              {brandLabel}
            </span>
          </a>

          <div className="flex items-center gap-3">
            {actions}
            {renderUserDropdown()}
          </div>
        </div>

        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:hidden md:w-auto fixed inset-0 h-screen ${mobileBg} z-40`}
        >
          <div className="flex justify-end p-4">
            <button
              className="cursor-pointer"
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label={openMenuLabel}
            >
              <IoCloseOutline
                className={`text-3xl font-roboto ${textColor}`}
              />
            </button>
          </div>
          <ul className="flex flex-col font-medium px-6 md:p-0 gap-5 md:space-x-8 rtl:space-x-reverse overflow-y-auto">
            {renderMenuItems((menu) => (
              <li key={menu.id}>
                <a
                  className={`block py-2 px-3 ${textColor} rounded`}
                  href={menu.link}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {menu.title}
                </a>
              </li>
            ))}
            {!isLoggedIn && (
              <li className="flex gap-3">
                <Button
                  fullWidth={false}
                  variant={isLanding ? "secondary" : "default"}
                  className={
                    isLanding
                      ? "rounded-full border border-white/30 bg-white/10 px-4 py-2 text-white hover:bg-white/20"
                      : "w-full"
                  }
                  onClick={() => {
                    navigate("/sign-in");
                    setIsMenuOpen(false);
                  }}
                >
                  {loginLabel}
                </Button>
                <Button
                  fullWidth={false}
                  variant="primary"
                  className={
                    isLanding
                      ? "rounded-full px-4 py-2 bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                      : "w-full"
                  }
                  onClick={() => {
                    navigate("/sign-up");
                    setIsMenuOpen(false);
                  }}
                >
                  {registerLabel}
                </Button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};
