import type { Metadata } from "next";

import { createPageTitle } from "@/lib/metadata";

import EditMeetingForm from "./page.client";

export const metadata: Metadata = {
  title: createPageTitle("Edit Meeting"),
};

export default function EditMeetingPage() {
  return <EditMeetingForm />;
}
