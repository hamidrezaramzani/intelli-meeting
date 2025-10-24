export type HeaderProps = {
  menus: {
    id: number;
    title: string;
    link: string;
  }[];  
  navigate: (path: string) => void
};
