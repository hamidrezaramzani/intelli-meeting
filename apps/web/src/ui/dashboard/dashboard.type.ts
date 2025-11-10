import type { ReactNode } from "react";

export interface DashboardProps {
  children: ReactNode;
  title: string;
  backUrl?: string;
}
