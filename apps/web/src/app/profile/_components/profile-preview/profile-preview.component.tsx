import { Button } from "@intelli-meeting/shared-ui";
import { useTranslation } from "react-i18next";

import type { UserProfile } from "@/services/api/auth/auth.type";

interface ProfilePreviewProps {
  user: UserProfile | null;
  onEditProfile: () => void;
}

export const ProfilePreview = ({
  user,
  onEditProfile,
}: ProfilePreviewProps) => {
  const { t } = useTranslation("profile");

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">
          {t("profile:preview.title", "Current Profile")}
        </h3>
        <Button onClick={onEditProfile} variant="outline" size="sm">
          {t("profile:preview.editButton", "Edit Profile")}
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center">
          <span className="text-2xl font-bold text-slate-600">
            {user?.first_name?.charAt(0).toUpperCase()}
            {user?.last_name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h4 className="text-xl font-semibold text-slate-800">
            {user?.first_name} {user?.last_name}
          </h4>
          <p className="text-slate-600">{user?.email}</p>
          {user?.bio && (
            <p className="text-slate-500 mt-2 max-w-md">{user?.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
};
