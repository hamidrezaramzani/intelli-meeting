import type { Metadata } from "next";

import { createPageTitle } from "@/lib/metadata";

import EditPositionForm from "./page.client";

export const metadata: Metadata = {
  title: createPageTitle("Edit Position"),
};

export default function EditPositionPage() {
  return <EditPositionForm />;
}
