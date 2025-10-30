"use client";

import dynamic from "next/dynamic";

const StoreProvider = dynamic(
  () => import("@intelli-meeting/store").then((mod) => mod.StoreProvider),
  { ssr: false },
);

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StoreProvider>{children}</StoreProvider>;
}
