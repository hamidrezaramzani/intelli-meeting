export interface HeaderProps {
  menus: {
    id: number;
    title: string;
    link: string;
  }[];
  isLoggedIn?: boolean;
  onLogout?: () => void;
  navigate: (path: string) => void;
}
