import type { Metadata } from "next";

import { createPageTitle } from "@/lib/metadata";

import NewEmployeeForm from "./page.client";

export const metadata: Metadata = {
  title: createPageTitle("New Employee"),
};

export default function NewEmployeePage() {
  return <NewEmployeeForm />;
}
