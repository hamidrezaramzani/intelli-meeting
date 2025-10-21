import { useState, type ReactNode } from "react";
import { HiOutlineBell, HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import type { HeaderProps } from "./header.type";
import { Button } from "../../components";

export const Header = ({ menus }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderMenuItems = (
    getContainer: (menu: HeaderProps["menus"][number]) => ReactNode
  ) => {
    return menus.map((menu) => getContainer(menu));
  };

  return (
    <header className="w-full flex justify-between items-center">
      <nav className="w-full bg-white">
        <div className="w-full hidden md:flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex gap-12">
            {renderMenuItems((menu) => (
              <div key={menu.id}>
                <a className="text-black" href={menu.link}>
                  {menu.title}
                </a>
              </div>
            ))}
          </div>
          <a href="#" className="flex justify-center items-center">
            <span className="self-center text-lg font-regular whitespace-nowrap text-black">
              Intelli Meetings
            </span>
          </a>

          <div className="hidden md:flex gap-3">
            <Button>Login</Button>
            <Button>Register</Button>
          </div>
        </div>
        <div className="flex justify-between md:hidden py-4">
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-black rounded-lg md:hidden hover:text-brand-700 "
          >
            <span className="sr-only">Open main menu</span>
            <HiOutlineMenuAlt2 className="text-3xl" />
          </button>

          <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-lg font-regular whitespace-nowrap text-black">
              Intelli Meetings
            </span>
          </a>

          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-black rounded-lg md:hidden hover:text-brand-700 "
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
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IoCloseOutline className="text-3xl" />
                </button>
              </li>
              {renderMenuItems((menu) => (
                <li key={menu.id}>
                  <a
                    href={menu.title}
                    className="block py-2 px-3 text-black rounded"
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
