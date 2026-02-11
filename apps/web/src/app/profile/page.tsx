import type { Metadata } from "next";

import ProfilePageClient from "./page.client";

export const metadata: Metadata = {
  title: "Profile | Intelli Meeting",
  description: "Manage your profile settings",
};

const ProfilePage = () => {
  return <ProfilePageClient />;
};

export default ProfilePage;
