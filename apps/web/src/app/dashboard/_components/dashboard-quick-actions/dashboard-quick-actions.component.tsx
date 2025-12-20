import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { getBounceEffect } from "@/lib";

import { DashboardQuickAction } from "./sub-components";

export const DashboardQuickActions = () => {
  const { t } = useTranslation();
  return (
    <motion.div {...getBounceEffect(4)} className="flex flex-col gap-2 mb-4">
      <DashboardQuickAction
        link="/meetings/new"
        title={t("common:addThing", { thing: t("dashboard:meeting") })}
      />
      <DashboardQuickAction
        link="/employees/new"
        title={t("common:addThing", { thing: t("dashboard:employee") })}
      />
    </motion.div>
  );
};
