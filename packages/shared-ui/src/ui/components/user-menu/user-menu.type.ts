import type { MenuItem } from "../header/header.type";

export interface UserMenuProps {
  menuItems?: MenuItem[];
  guestLabel?: string;
  avatarAlt?: string;
  renderGreeting?: (name: string) => string;
}
