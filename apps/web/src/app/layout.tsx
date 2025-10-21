import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intelli meeting",
  description:
    "AI-powered online meeting assistant that records, analyzes, and summarizes meetings, identifying who said what.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
