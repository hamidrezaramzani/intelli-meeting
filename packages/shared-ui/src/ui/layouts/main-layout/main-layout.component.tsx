import type { MainLayoutProps } from "./main-layout.type";

import { Header } from "../header";
import { MENU_ITEMS } from "./main-layout.constant";

export const MainLayout = ({
  children,
  navigate,
  isLoggedIn,
  onLogout,
}: MainLayoutProps) => (
  <div className="w-full md:w-5/6">
    <Header
      menus={MENU_ITEMS}
      navigate={navigate}
      isLoggedIn={isLoggedIn}
      onLogout={onLogout}
    />
    <div>{children}</div>
  </div>
);
