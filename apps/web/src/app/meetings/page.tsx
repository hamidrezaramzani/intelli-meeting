import type { Metadata } from "next";

import { createPageTitle } from "@/lib/metadata";

import MeetingsPage from "./page.client";

export const metadata: Metadata = {
  title: createPageTitle("Meetings"),
};

export default function MeetingsRoute() {
  return <MeetingsPage />;
}
