import { useState } from "react";
import { HiOutlineMenuAlt3, HiOutlineBell } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full flex justify-between items-center p-3">
      <nav className="bg-brand-800 w-full">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:text-brand-300 "
          >
            <span className="sr-only">Open main menu</span>
            <HiOutlineBell className="text-3xl" />
          </button>
          <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-lg font-regular whitespace-nowrap text-white">
              Intelli Meetings
            </span>
          </a>

          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:text-brand-300 "
          >
            <span className="sr-only">Open main menu</span>
            <HiOutlineMenuAlt3 className="text-3xl" />
          </button>

          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } w-full md:block md:w-auto absolute top-0 left-0 h-screen bg-white`}
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4  gap-5 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
              <li>
                <button
                  className="cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IoCloseOutline className="text-3xl" />
                </button>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-white bg-brand-800 rounded md:bg-transparent md:text-brand-800 md:p-0"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-brand-800 md:p-0"
                >
                  About us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-brand-800 md:p-0"
                >
                  Contact me
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-brand-800 md:p-0"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
