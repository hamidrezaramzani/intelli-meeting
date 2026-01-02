import type { Metadata } from "next";

import { createPageTitle } from "@/lib/metadata";

import NotificationPage from "./page.client";

export const metadata: Metadata = {
  title: createPageTitle("Notifications"),
};

export default function NotificationsRoute() {
  return <NotificationPage />;
}
