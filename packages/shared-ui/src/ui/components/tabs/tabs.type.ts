import type { ReactNode } from "react";

export interface Tab {
  label: string;
  content: ReactNode;
  name?: string;
}

export interface TabsProps {
  tabs: Tab[];
  defaultIndex?: number;
  onChange?: (newTab?: string) => void;
}
