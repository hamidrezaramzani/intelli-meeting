"use client";

import { Login } from "@intelli-meeting/shared-ui";
import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const SignInPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  useAuthRedirect({
    onRedirect: () => router.push("/"),
    type: "logged",
  });

  return (
    <div className="w-full min-h-screen flex justify-center items-center px-4 py-8">
      <Login
        navigate={router.push}
        copy={{
          title: t("common:auth.signIn"),
          description: t("common:auth.signInDescription"),
          emailLabel: t("common:form.email"),
          emailPlaceholder: t("common:placeholders.email"),
          passwordLabel: t("common:form.password"),
          passwordPlaceholder: t("common:placeholders.password"),
          submitLabel: t("common:auth.signIn"),
          noAccountPrompt: t("common:auth.noAccountPrompt"),
          signUpLabel: t("common:auth.signUp"),
        }}
        toastMessages={{
          pending: t("common:auth.signInPending"),
          error: t("common:auth.signInError"),
          success: t("common:auth.signInSuccess"),
        }}
        validationMessages={{
          invalidEmail: t("common:validation.invalidEmail"),
          passwordMinLength: t("common:validation.passwordMinLength"),
        }}
        links={{
          homeUrl: "/",
          signUpUrl: "/sign-up",
        }}
      />
    </div>
  );
};

export default SignInPage;
