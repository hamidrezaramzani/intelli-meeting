export interface MenuItem {
  label: string;
  onClick: () => void;
}

export interface MainLayoutProps {
  children: React.ReactNode;
  navigate: (path: string) => void;
  menuItems?: MenuItem[];
  headerActions?: React.ReactNode;
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
  headerVariant?: "default" | "landing";
  userMenuProps?: {
    guestLabel?: string;
    avatarAlt?: string;
    renderGreeting?: (name: string) => string;
    variant?: "default" | "landing";
  };
}
