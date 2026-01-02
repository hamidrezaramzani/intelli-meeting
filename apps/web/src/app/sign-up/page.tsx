import type { Metadata } from "next";

import { createPageTitle } from "@/lib/metadata";

import SignUpPage from "./page.client";

export const metadata: Metadata = {
  title: createPageTitle("Sign Up"),
};

export default function SignUpRoute() {
  return <SignUpPage />;
}
