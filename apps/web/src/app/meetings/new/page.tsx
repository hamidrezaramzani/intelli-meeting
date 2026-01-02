import type { Metadata } from "next";

import { createPageTitle } from "@/lib/metadata";

import NewMeetingForm from "./page.client";

export const metadata: Metadata = {
  title: createPageTitle("New Meeting"),
};

export default function NewMeetingPage() {
  return <NewMeetingForm />;
}
