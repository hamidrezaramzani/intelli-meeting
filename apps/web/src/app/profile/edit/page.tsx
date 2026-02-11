"use client";
import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useGetProfileQuery, useUpdateProfileMutation } from "@/services";
import { Dashboard } from "@/ui";

import { EditProfileForm } from "../_components";

const ProfileEditPage = () => {
  const { data: profileData, isLoading } = useGetProfileQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const { t } = useTranslation("profile");

  const router = useRouter();
  useAuthRedirect({
    onRedirect: () => router.push("/sign-in"),
    type: "unlogged",
  });

  const onSubmit = async (data: any) => {
    try {
      const updateData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        bio: data.bio,
        ...(data.password && { password: data.password }),
      };

      await toast.promise(updateProfile(updateData).unwrap(), {
        pending: t("profile:messages.updating"),
        success: {
          render: ({ data: responseData }) => {
            return responseData?.message || t("profile:messages.updated");
          },
        },
        error: t("profile:messages.updateFailed"),
      });
      router.push("/profile");
    } catch (updateError) {
      console.error("Profile update failed:", updateError);
    }
  };

  if (isLoading) {
    return (
      <Dashboard title={t("profile:title")}>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">{t("common:loading")}</div>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard backUrl="/profile" title={t("profile:title")}>
      <EditProfileForm
        defaultValue={profileData?.user}
        isLoading={isUpdating}
        onSubmit={onSubmit}
      />
    </Dashboard>
  );
};

export default ProfileEditPage;
