import type { FC } from "react";

interface StatItem {
  title: string;
  value: number | string;
  icon: FC<any>;
}

export interface StatisticsProps {
  items: StatItem[];
}
