import type { ReactNode } from "react";

import type { MenuItem } from "../../layouts/main-layout/main-layout.type";
import type { UserMenuProps } from "../user-menu/user-menu.type";

export interface HeaderProps {
  menus: {
    id: number;
    title: string;
    link: string;
  }[];
  brandLabel: string;
  brandHref: string;
  loginLabel: string;
  registerLabel: string;
  openMenuLabel: string;
  variant?: "default" | "landing";
  isLoggedIn?: boolean;
  onLogout?: () => void;
  navigate: (url: string) => void;
  menuItems?: MenuItem[];
  actions?: ReactNode;
  userMenuProps?: Omit<UserMenuProps, "menuItems">;
}
