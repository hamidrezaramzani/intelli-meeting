"use client";

import type { Tab } from "@intelli-meeting/shared-ui";

import { Tabs } from "@intelli-meeting/shared-ui";
import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";

import { Dashboard } from "@/ui";

import { PositionsList } from "./_components";

const SettingsPage = () => {
  const router = useRouter();
  useAuthRedirect({
    onRedirect: () => router.push("/sign-in"),
    type: "unlogged",
  });

  const tabs: Tab[] = [{ label: "Positions", content: <PositionsList /> }];

  return (
    <Dashboard title="Settings">
      <Tabs defaultIndex={0} tabs={tabs} />
    </Dashboard>
  );
};

export default SettingsPage;
