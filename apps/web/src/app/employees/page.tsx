import type { Metadata } from "next";

import { createPageTitle } from "@/lib/metadata";

import EmployeesPage from "./page.client";

export const metadata: Metadata = {
  title: createPageTitle("Employees"),
};

export default function EmployeesRoute() {
  return <EmployeesPage />;
}
