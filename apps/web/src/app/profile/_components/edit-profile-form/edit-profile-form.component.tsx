import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextInput } from "@intelli-meeting/shared-ui";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type {
  EditProfileFormProps,
  EditProfileFormValues,
} from "./edit-profile-form.type";

import { getEditProfileFormSchema } from "./edit-profile-form.schema";

export const EditProfileForm = ({
  onSubmit,
  isLoading,
  defaultValue,
  // eslint-disable-next-line complexity
}: EditProfileFormProps) => {
  const { t } = useTranslation("profile");

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(getEditProfileFormSchema(t)),
    defaultValues: {
      first_name: defaultValue?.first_name || "",
      last_name: defaultValue?.last_name || "",
      email: defaultValue?.email || "",
      bio: defaultValue?.bio || "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  return (
    <div className="w-full">
      <div className="w-full lg:w-3/5 p-4 sm:p-6">
        <h2 className="text-2xl font-roboto font-bold text-slate-800 mb-2">
          {t("profile:form.title")}
        </h2>

        <p className="text-slate-600 mb-6">{t("profile:form.description")}</p>

        {/* Profile Preview Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            {t("profile:preview.title", "Current Profile")}
          </h3>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-600">
                {defaultValue?.first_name?.charAt(0).toUpperCase()}
                {defaultValue?.last_name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-slate-800">
                {defaultValue?.first_name} {defaultValue?.last_name}
              </h4>
              <p className="text-slate-600">{defaultValue?.email}</p>
              {defaultValue?.bio && (
                <p className="text-slate-500 mt-2 max-w-md">
                  {defaultValue?.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label={t("profile:form.firstName")}
              type="text"
              placeholder={t("profile:placeholders.firstName")}
              {...register("first_name")}
              error={touchedFields.first_name ? errors.first_name?.message : ""}
            />

            <TextInput
              label={t("profile:form.lastName")}
              type="text"
              placeholder={t("profile:placeholders.lastName")}
              {...register("last_name")}
              error={touchedFields.last_name ? errors.last_name?.message : ""}
            />
          </div>

          <TextInput
            label={t("profile:form.email")}
            type="text"
            placeholder={t("profile:placeholders.email")}
            {...register("email")}
            error={touchedFields.email ? errors.email?.message : ""}
          />

          <div className="mb-5">
            <label className="block mb-2 text-sm font-roboto font-medium text-gray-500">
              {t("profile:form.bio")}
            </label>
            <textarea
              placeholder={t("profile:placeholders.bio")}
              rows={4}
              className={`bg-white border font-regular rounded-xl text-gray-900 text-sm font-roboto block w-full p-2.5 outline-none transition-colors
                ${errors.bio ? "border-red-500 focus:border-red-500" : "border-black focus:border-brand-500"}
              `}
              {...register("bio")}
            />
            {errors.bio && (
              <p className="mt-1 text-sm font-roboto text-red-500">
                {errors.bio.message}
              </p>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              {t("profile:form.changePassword")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label={t("profile:form.newPassword")}
                type="password"
                placeholder={t("profile:placeholders.newPassword")}
                {...register("password")}
                error={touchedFields.password ? errors.password?.message : ""}
              />

              <TextInput
                disabled={!passwordValue}
                label={t("profile:form.confirmPassword")}
                type="password"
                placeholder={t("profile:placeholders.confirmPassword")}
                {...register("confirmPassword")}
                error={
                  touchedFields.confirmPassword
                    ? errors.confirmPassword?.message
                    : ""
                }
              />
            </div>
          </div>

          <Button
            className="mt-6 w-full sm:w-96"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? t("common:saving") : t("profile:form.saveChanges")}
          </Button>
        </form>
      </div>
    </div>
  );
};
