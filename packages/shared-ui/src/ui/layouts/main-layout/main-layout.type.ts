import type { ReactNode } from "react";

export type MainLayoutProps = {
  children: ReactNode;
  navigate: (path: string) => void;
};
