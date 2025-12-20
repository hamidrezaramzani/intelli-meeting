"use client";
import { Button, MainLayout } from "@intelli-meeting/shared-ui";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { getUserMenuItems } from "@/lib/constants/user-menu";

export default function Home() {
  const router = useRouter();

  const { t } = useTranslation<"">();

  const menuItems = getUserMenuItems(router);

  return (
    <div className="w-full flex justify-center h-screen">
      <div className="h-[calc(100vh-120px)]  w-full flex items-center flex-col mt-3">
        <MainLayout
          menuItems={menuItems}
          navigate={(path) => {
            router.push(path);
          }}
        >
          <div className="bg-white flex justify-center mt-3 flex-col items-center  h-[calc(100vh-120px)]  w-full">
            <div className="w-full pt-5 text-black flex gap-8 justify-center text-4xl font-roboto  font-black items-center mt-3">
              {t("common:title")}
            </div>

            <div className="w-full py-5 flex gap-16 justify-center text-md font-roboto  font-regular items-center">
              <p className="font-roboto text-shadow-gray-400 md:p-0 px-3 text-center">
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
