import type { ReactNode } from "react";

export interface MainLayoutProps {
  children: ReactNode;
  navigate: (path: string) => void;
}
