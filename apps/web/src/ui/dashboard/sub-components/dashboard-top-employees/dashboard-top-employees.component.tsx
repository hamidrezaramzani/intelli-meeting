import { motion } from "motion/react";
import Image from "next/image";

import { getBounceEffect } from "@/lib/helpers";

import type { DashboardTopEmpoyeesProps } from "./dashboard-top-employees.type";

export const DashboardTopEmployees = ({
  employees,
}: DashboardTopEmpoyeesProps) => (
  <motion.div
    {...getBounceEffect(1)}
    className="relative flex flex-col border border-slate-800 rounded-md w-full bg-white p-5 mb-5"
  >
    <div className="flex flex-col gap-2 mb-5">
      <div className="w-full flex justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Top employees</h1>
      </div>
      <p className="text-slate-600">Team members who actively join meetings</p>
    </div>
    <div className="w-full flex flex-col justify-center">
      {employees.map((employee) => (
        <div
          className="w-full flex justify-between items-center hover:bg-slate-50 p-4 transition rounded-md"
          key={employee.fullName}
        >
          <div className="flex gap-5 items-center">
            <div>
              <Image
                height={48}
                width={48}
                alt="user"
                className="w-12 rounded-md"
                src={`https://avatar.iran.liara.run/username?username=${employee.fullName.replace(" ", "")}`}
              />
            </div>
            <div className="flex justify-center flex-col">
              <h3 className="text-md text-slate-700">{employee.fullName}</h3>
              <p className="text-xs text-slate-500">{employee.role}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-600">
              {employee.totalMinutesAttended} MIN
            </p>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);
