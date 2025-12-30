"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";

import { LANGUAGE_STORAGE_KEY } from "@/lib/constants";
import { setDocumentLanguage } from "@/lib/helpers";

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
  const storedLanguage =
    typeof window !== "undefined"
      ? window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
      : null;
  const i18n = initI18n(
    storedLanguage === "fa" || storedLanguage === "en"
      ? storedLanguage
      : "en",
  );

  useEffect(() => {
    setDocumentLanguage(i18n.language?.split("-")[0] ?? "en");
  }, [i18n.language]);

  return (
    <I18nextProvider i18n={i18n}>
      <StoreProvider>{children}</StoreProvider>
    </I18nextProvider>
  );
}
