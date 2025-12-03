import { motion } from "motion/react";

import { getBounceEffect } from "@/lib";

import { DashboardQuickAction } from "./sub-components";

export const DashboardQuickActions = () => {
  return (
    <motion.div {...getBounceEffect(4)} className="flex flex-col gap-2 mb-4">
      <DashboardQuickAction link="/meetings/new" title="Add Meeting" />
      <DashboardQuickAction link="/meetings/new" title="Add Employee" />
    </motion.div>
  );
};
