"use client";

import { useAuthRedirect } from "@intelli-meeting/store";

import "../globals.css";
import { useRouter } from "next/navigation";

import { Dashboard } from "@/ui";

const DashboardPage = () => {
  const router = useRouter();
  useAuthRedirect({
    onRedirect: () => router.push("/sign-in"),
    type: "unlogged",
  });

  return <Dashboard title="Dashboard">Dashboard</Dashboard>;
};

export default DashboardPage;
