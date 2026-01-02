"use client";

import type { Tab } from "@intelli-meeting/shared-ui";

import { Tabs } from "@intelli-meeting/shared-ui";
import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { Dashboard } from "@/ui";

import { PositionsList } from "./_components";

const SettingsPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  useAuthRedirect({
    onRedirect: () => router.push("/sign-in"),
    type: "unlogged",
  });

  const tabs: Tab[] = [
    { label: t("setting:positions.title"), content: <PositionsList /> },
  ];

  return (
    <Dashboard title={t("setting:title")}>
      <Tabs defaultIndex={0} tabs={tabs} />
    </Dashboard>
  );
};

export default SettingsPage;
