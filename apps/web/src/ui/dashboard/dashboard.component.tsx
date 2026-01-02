import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoCloseOutline } from "react-icons/io5";

import type { DashboardProps } from "./dashboard.type";

import { DashboardSidebar } from "./sub-components";
import DashboardHeader from "./sub-components/dashboard-header/dashboard-header.component";

export const Dashboard = ({ children, title, backUrl }: DashboardProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const goToHome = () => {
    router.push("/");
  };
  return (
    <div className="w-full flex justify-center overflow-x-hidden">
      <div className="w-full h-auto min-h-screen flex flex-col md:flex-row items-stretch p-4 sm:p-5">
        <div className="hidden md:flex md:flex-col md:w-2/12 lg:w-2/12 shrink-0 relative bg-white border border-slate-800 rounded-2xl md:rounded-r-none px-3">
          <button className="mt-4" type="button" onClick={goToHome}>
            <div className="w-full p-3 flex items-center cursor-pointer">
              <div className="w-3/12 flex justify-start">
                <img
                  alt={t("common:logoAlt")}
                  className="w-18"
                  src="/logo.png"
                />
              </div>
              <div className="w-9/12 flex flex-col items-start gap-1">
                <h1 className="text-xl text-slate-800 font-bold">
                  {t("common:title")}
                </h1>
                <p className="text-xs font-roboto  font-body text-slate-600">
                  {t("common:tagline.aiPowered")}
                </p>
              </div>
            </div>
          </button>

          <div className="w-full mt-8">
            <DashboardSidebar />
          </div>
        </div>

        <div className="w-full md:flex-1 py-4 px-4 sm:px-6 bg-white border-slate-800 border md:border-l-0 rounded-2xl md:rounded-l-none h-auto">
          <DashboardHeader
            backUrl={backUrl}
            title={title}
            onMenuToggle={() => setIsSidebarOpen((prev) => !prev)}
            isMenuOpen={isSidebarOpen}
          />
          <div className="h-auto">{children}</div>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white border-r border-slate-800 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <button type="button" onClick={goToHome}>
                <div className="flex items-center gap-3">
                  <img
                    alt={t("common:logoAlt")}
                    className="w-8"
                    src="/logo.png"
                  />
                  <span className="text-base text-slate-800 font-bold">
                    {t("common:title")}
                  </span>
                </div>
              </button>
              <button
                className="p-2"
                type="button"
                onClick={() => setIsSidebarOpen(false)}
              >
                <IoCloseOutline className="text-2xl text-slate-800" />
              </button>
            </div>
            <div className="mt-6">
              <DashboardSidebar onNavigate={() => setIsSidebarOpen(false)} />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
