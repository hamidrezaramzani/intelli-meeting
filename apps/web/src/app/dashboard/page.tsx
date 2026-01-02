import type { Metadata } from "next";

import { createPageTitle } from "@/lib/metadata";

import DashboardPage from "./page.client";

export const metadata: Metadata = {
  title: createPageTitle("Dashboard"),
};

export default function DashboardRoute() {
  return <DashboardPage />;
}
