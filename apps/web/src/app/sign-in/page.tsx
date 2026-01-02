import type { Metadata } from "next";

import { createPageTitle } from "@/lib/metadata";

import SignInPage from "./page.client";

export const metadata: Metadata = {
  title: createPageTitle("Sign In"),
};

export default function SignInRoute() {
  return <SignInPage />;
}
