import type { Metadata } from "next";

import { createPageTitle } from "@/lib/metadata";

import NewPositionForm from "./page.client";

export const metadata: Metadata = {
  title: createPageTitle("New Position"),
};

export default function NewPositionPage() {
  return <NewPositionForm />;
}
