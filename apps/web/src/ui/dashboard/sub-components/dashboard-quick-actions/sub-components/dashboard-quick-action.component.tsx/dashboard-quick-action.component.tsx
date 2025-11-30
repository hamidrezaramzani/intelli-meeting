import { Button } from "@intelli-meeting/shared-ui";
import { useRouter } from "next/navigation";
import { LuMoveRight } from "react-icons/lu";

import type { DashboardQuickActionProps } from "./dashboard-quick-action.type";

export const DashboardQuickAction = ({
  title,
  link,
}: DashboardQuickActionProps) => {
  const router = useRouter();
  return (
    <Button
      className="text-left h-14 uppercase"
      onClick={() => router.push(link)}
    >
      <div className="flex justify-between items-center">
        <span>{title}</span>
        <div>
          <LuMoveRight className="text-xl" />
        </div>
      </div>
    </Button>
  );
};
