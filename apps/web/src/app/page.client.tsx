"use client";

import { Button, MainLayout } from "@intelli-meeting/shared-ui";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { getUserMenuItems } from "@/lib/constants/user-menu";
import { LanguageToggle } from "@/ui";

export default function HomePage() {
  const router = useRouter();

  const { t } = useTranslation<"">();

  const menuItems = getUserMenuItems(router);
  const menus = [
    {
      id: 1,
      title: t("home:navigation.home"),
      link: "/",
    },
    {
      id: 2,
      title: t("home:navigation.about"),
      link: "https://thehamidreza.ir",
    },
    {
      id: 3,
      title: t("home:navigation.contribute"),
      link: "https://github.com/hamidrezaramzani",
    },
  ];

  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="min-h-[calc(100vh-120px)] w-full flex items-center flex-col mt-3 px-4">
        <MainLayout
          brandHref="/"
          brandLabel={t("common:title")}
          menuItems={menuItems}
          menus={menus}
          registerLabel={t("common:auth.signUp")}
          headerActions={<LanguageToggle />}
          loginLabel={t("common:auth.signIn")}
          openMenuLabel={t("common:openMainMenu")}
          userMenuProps={{
            avatarAlt: t("common:avatarAlt"),
            guestLabel: t("common:guest"),
            renderGreeting: (name) => t("common:greeting", { name }),
          }}
          navigate={(path) => {
            router.push(path);
          }}
        >
          <div className="bg-white flex justify-center mt-3 flex-col items-center min-h-[calc(100vh-120px)] w-full py-8">
            <div className="w-full pt-5 text-black flex gap-4 sm:gap-8 justify-center text-3xl sm:text-4xl font-roboto font-black items-center mt-3 text-center">
              {t("common:title")}
            </div>

            <div className="w-full py-5 flex gap-6 sm:gap-16 justify-center text-md font-roboto  font-regular items-center">
              <p className="font-roboto text-shadow-gray-400 md:p-0 px-3 text-center max-w-2xl">
                {t("home:description")}
              </p>
            </div>

            <div>
              <Button>{t("home:gettingStarted")}</Button>
            </div>
          </div>
        </MainLayout>
      </div>
    </div>
  );
}
