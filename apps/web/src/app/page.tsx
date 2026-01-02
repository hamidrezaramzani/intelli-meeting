import type { Metadata } from "next";

import { createPageTitle } from "@/lib/metadata";

import HomePage from "./page.client";

export const metadata: Metadata = {
  title: createPageTitle("Home"),
};

export default function Home() {
  return <HomePage />;
}
