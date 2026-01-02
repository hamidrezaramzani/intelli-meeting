import type { Metadata } from "next";

import { createPageTitle } from "@/lib/metadata";

import Meeting from "./page.client";

export const metadata: Metadata = {
  title: createPageTitle("Meeting Details"),
};

export default function MeetingDetailsPage() {
  return <Meeting />;
}
