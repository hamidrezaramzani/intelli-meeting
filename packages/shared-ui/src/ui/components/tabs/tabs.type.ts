import type { ReactNode } from "react";

export interface Tab {
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultIndex?: number;
}
