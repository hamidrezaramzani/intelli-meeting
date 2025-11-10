import { useRouter } from "next/navigation";
import { MdLogout } from "react-icons/md";

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
      <div className="w-full h-screen flex p-5">
        <div className="w-2/12 relative bg-slate-100 rounded-l-2xl py-5 px-3">
          <div className="w-11/12 absolute bottom-4">
            <div className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-slate-700 hover:bg-slate-200 cursor-pointer transition-all">
              <MdLogout />
              <span className="text-sm font-medium">Logout</span>
            </div>
          </div>
          <button type="button" onClick={goToHome}>
            <div className="w-full p-3 flex items-center cursor-pointer">
              <div className="w-3/12 flex justify-start">
                <img alt="LOGO" className="w-18" src="/logo.png" />
              </div>
              <div className="w-9/12 flex flex-col items-start gap-1">
                <h1 className="text-xl text-slate-800 font-bold">
                  Intelli Meeting
                </h1>
                <p className="text-xs font-body text-slate-600">AI-powered</p>
              </div>
            </div>
          </button>

          <div className="w-full mt-8">
            <DashboardSidebar />
          </div>
        </div>
        <div className="w-5/6 py-5 px-6 bg-slate-50 rounded-r-2xl">
          <DashboardHeader backUrl={backUrl} title={title} />
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};
