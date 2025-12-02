import type { FC } from "react";

export interface StatItem {
  title: string;
  value: number | string;
  icon: FC<any>;
}

