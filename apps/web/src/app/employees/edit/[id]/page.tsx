import type { Metadata } from "next";

import { createPageTitle } from "@/lib/metadata";

import EditEmployeePage from "./page.client";

export const metadata: Metadata = {
  title: createPageTitle("Edit Employee"),
};

export default function EditEmployeeRoute() {
  return <EditEmployeePage />;
}
