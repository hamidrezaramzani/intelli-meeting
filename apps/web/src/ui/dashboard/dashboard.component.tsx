import { useRouter } from "next/navigation";

import type { DashboardProps } from "./dashboard.type";

import { DashboardSidebar } from "./sub-components";
import DashboardHeader from "./sub-components/dashboard-header/dashboard-header.component";

export const Dashboard = ({ children, title, backUrl }: DashboardProps) => {
  const router = useRouter();
  const goToHome = () => {
    router.push("/");
  };
  return (
    <div className="w-full flex justify-center">
      <div className="w-full h-auto min-h-screen flex p-5">
        <div className="w-2/12 relative bg-white border border-slate-800 rounded-l-2xl px-3">
          <button className="mt-4" type="button" onClick={goToHome}>
            <div className="w-full p-3 flex items-center cursor-pointer">
              <div className="w-3/12 flex justify-start">
                <img alt="LOGO" className="w-18" src="/logo.png" />
              </div>
              <div className="w-9/12 flex flex-col items-start gap-1">
                <h1 className="text-xl text-slate-800 font-bold">
                  Intelli Meeting
                </h1>
                <p className="text-xs font-roboto  font-body text-slate-600">
                  AI-powered
                </p>
              </div>
            </div>
          </button>

          <div className="w-full mt-8">
            <DashboardSidebar />
          </div>
        </div>
        <div className="w-5/6 py-4 px-6 bg-white border-slate-800 border-t border-r border-b rounded-r-2xl h-auto">
          <DashboardHeader backUrl={backUrl} title={title} />
          <div className="h-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};
