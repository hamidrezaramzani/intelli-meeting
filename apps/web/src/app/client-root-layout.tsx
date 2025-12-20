"use client";

import dynamic from "next/dynamic";
import { I18nextProvider } from "react-i18next";

import { initI18n } from "../i18n";

const StoreProvider = dynamic(
  () => import("@intelli-meeting/store").then((mod) => mod.StoreProvider),
  { ssr: false },
);

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const i18n = initI18n("fa");
  return (
    <I18nextProvider i18n={i18n}>
      <StoreProvider>{children}</StoreProvider>
    </I18nextProvider>
  );
}
