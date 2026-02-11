import { Button } from "@intelli-meeting/shared-ui";
import { useTranslation } from "react-i18next";

import type { UserProfile } from "@/services/api/auth/auth.type";

interface ProfileTableProps {
  user: UserProfile | null;
  onEditProfile: () => void;
}

export const ProfileTable = ({ user, onEditProfile }: ProfileTableProps) => {
  const { t } = useTranslation("profile");

  if (!user) {
    return (
      <div className="text-center text-gray-500 py-8">
        {t("profile:table.noData", "No profile data available")}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">
          {t("profile:preview.title", "Current Profile")}
        </h3>
        <Button variant="secondary" onClick={onEditProfile}>
          {t("profile:preview.editButton", "Edit Profile")}
        </Button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("profile:table.field", "Field")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("profile:table.value", "Value")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {t("profile:table.name", "Name")}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {user.first_name} {user.last_name}
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {t("profile:table.email", "Email")}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {user.email}
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {t("profile:table.bio", "Bio")}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              <div className="max-w-xs truncate">{user.bio || "-"}</div>
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {t("profile:table.memberSince", "Member Since")}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "N/A"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
