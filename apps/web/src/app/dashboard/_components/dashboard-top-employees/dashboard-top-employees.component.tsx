import { motion } from "motion/react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { getBounceEffect } from "@/lib/helpers";
import { useReadDashboardTopEmployeesQuery } from "@/services";
import { EmptyState } from "@intelli-meeting/shared-ui";

export const DashboardTopEmployees = () => {
  const { t } = useTranslation();

  const { data: employees } = useReadDashboardTopEmployeesQuery({});
  return (
    <motion.div
      {...getBounceEffect(1)}
      className="relative flex flex-col border border-slate-800 rounded-md w-full bg-white p-5 mt-6"
    >
      <div className="flex flex-col gap-2 mb-5">
        <div className="w-full flex justify-between">
          <h1 className="text-2xl font-roboto font-bold text-slate-800">
            {t("dashboard:topEmployees.title")}
          </h1>
        </div>
        <p className="text-slate-600">
          {t("dashboard:topEmployees.description")}
        </p>
      </div>
      <div className="w-full flex flex-col justify-center">
        {employees && employees?.length ? (
          employees?.map((employee) => (
            <div
              className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 hover:bg-slate-50 py-4 transition rounded-md"
              key={employee.employeeName}
            >
              <div className="flex gap-5 items-center">
                <div>
                  <Image
                    height={48}
                    width={48}
                    alt="user"
                    className="w-12 rounded-md"
                    src={`https://avatar.iran.liara.run/username?username=${employee.employeeName.replace(" ", "")}`}
                  />
                </div>
                <div className="flex justify-center flex-col">
                  <h3 className="text-md font-roboto  text-slate-700">
                    {employee.employeeName}
                  </h3>
                  <p className="text-xs font-roboto  text-slate-500">
                    {employee.position.title}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-roboto  text-slate-600">
                  {employee.totalTime} MIN
                </p>
              </div>
            </div>
          ))
        ) : (
          <EmptyState title="There are no employees" description="" />
        )}
      </div>
    </motion.div>
  );
};
