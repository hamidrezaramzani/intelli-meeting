import type { MenuItem } from "../../layouts/main-layout/main-layout.type";

export interface HeaderProps {
  menus: {
    id: number;
    title: string;
    link: string;
  }[];
  isLoggedIn?: boolean;
  onLogout?: () => void;
  navigate: (url: string) => void;
  menuItems?: MenuItem[];
}
