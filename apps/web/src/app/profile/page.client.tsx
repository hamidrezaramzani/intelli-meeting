"use client";
import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useGetProfileQuery } from "@/services";
import { Dashboard, Table } from "@/ui";

const ProfilePageClient = () => {
  const { data: profileData, isLoading, error } = useGetProfileQuery({});
  const { t } = useTranslation("profile");

  const router = useRouter();
  useAuthRedirect({
    onRedirect: () => router.push("/sign-in"),
    type: "unlogged",
  });

  if (isLoading) {
    return (
      <Dashboard title={t("profile:title")}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">{t("common:loading")}</div>
        </div>
      </Dashboard>
    );
  }

  if (error) {
    return (
      <Dashboard title={t("profile:title")}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">
            {t("profile:messages.loadFailed")}
          </div>
        </div>
      </Dashboard>
    );
  }

  // Prepare table data for profile
  const profileDataForTable = profileData?.user
    ? [
        {
          field: t("profile:table.name", "Name"),
          value: `${profileData.user.first_name} ${profileData.user.last_name}`,
        },
        {
          field: t("profile:table.email", "Email"),
          value: profileData.user.email,
        },
        {
          field: t("profile:table.bio", "Bio"),
          value: profileData.user.bio || "-",
        },
        {
          field: t("profile:table.memberSince", "Member Since"),
          value: profileData.user.created_at
            ? new Date(profileData.user.created_at).toLocaleDateString()
            : "N/A",
        },
      ]
    : [];

  return (
    <Dashboard title={t("profile:title")}>
      <Table
        data={profileDataForTable}
        title={t("profile:title")}
        columns={[
          {
            key: "field",
            label: t("profile:table.field", "Field"),
          },
          {
            key: "value",
            label: t("profile:table.value", "Value"),
          },
        ]}
        description={t("profile:preview.title", "Current Profile")}
        formPath="/profile/edit"
      />
    </Dashboard>
  );
};

export default ProfilePageClient;
