import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { TFunction } from "i18next";

export const getUserMenuItems = (
  router: AppRouterInstance,
  t?: TFunction<"common">
) => [
  { label: t?.("common:userMenu.dashboard") ?? "Dashboard", onClick: () => router.push("/dashboard") },
  { label: t?.("common:userMenu.profile") ?? "Profile", onClick: () => router.push("/profile") },
  { label: t?.("common:userMenu.meetings") ?? "Meetings", onClick: () => router.push("/meetings") },
  { label: t?.("common:userMenu.settings") ?? "Settings", onClick: () => router.push("/settings") },
  { label: t?.("common:userMenu.logout") ?? "Logout", onClick: () => router.push("/logout") },
];
