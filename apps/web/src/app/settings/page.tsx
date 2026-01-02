import type { Metadata } from "next";

import { createPageTitle } from "@/lib/metadata";

import SettingsPage from "./page.client";

export const metadata: Metadata = {
  title: createPageTitle("Settings"),
};

export default function SettingsRoute() {
  return <SettingsPage />;
}
