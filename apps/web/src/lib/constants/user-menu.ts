import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const getUserMenuItems = (router: AppRouterInstance) => [
  { label: "Dashboard", onClick: () => router.push("/dashboard") },
  { label: "Profile", onClick: () => router.push("/profile") },
  { label: "Meetings", onClick: () => router.push("/meetings") },
  { label: "Settings", onClick: () => router.push("/settings") },
  { label: "Logout", onClick: () => router.push("/logout") },
];
