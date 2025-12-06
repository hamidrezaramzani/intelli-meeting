export interface MenuItem {
  label: string;
  onClick: () => void;
}

export interface MainLayoutProps {
  children: React.ReactNode;
  navigate: (path: string) => void;
  menuItems?: MenuItem[];
}
