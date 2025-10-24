import { Header } from "../header";
import { MENU_ITEMS } from "./main-layout.constant";
import type { MainLayoutProps } from "./main-layout.type";

export const MainLayout = ({ children, navigate}: MainLayoutProps) => (
  <div className="w-full md:w-5/6">
    <Header menus={MENU_ITEMS} navigate={navigate}  />
    <div>{children}</div>
  </div>
);
