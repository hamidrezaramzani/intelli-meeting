"use client";
import { useAuthRedirect } from "@intelli-meeting/store";
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { useReadOneEmployeeQuery, useUpdateEmployeeMutation } from "@/services";
import { Dashboard } from "@/ui";

import type { EmployeeFormValues } from "../_components";

import { EmployeeForm } from "../_components";

const EditEmployeePage = () => {
  const { id } = useParams();

  const { data: employee } = useReadOneEmployeeQuery(
    id ? { params: { id } } : skipToken,
  );

  const [updateEmployee, { isLoading }] = useUpdateEmployeeMutation();

  const router = useRouter();

  useAuthRedirect({
    onRedirect: () => router.push("/sign-in"),
    type: "unlogged",
  });

  const onSubmit = async (data: EmployeeFormValues) => {
    await toast.promise(updateEmployee({ data, params: { id } }).unwrap(), {
      pending: "Updating employee...",
      success: {
        render: () => {
          router.push("/employees");
          return "Employee updated successfully!";
        },
      },
      error: "Error while updating employee. Please try again.",
    });
  };

  return (
    <Dashboard backUrl="/employees" title="Edit employees">
      <EmployeeForm
        isEdit
        isLoading={isLoading}
        onSubmit={onSubmit}
        defaultValue={{
          fullName: employee?.fullName || "",
          position: employee?.position?.id || "",
        }}
      />
      ;
    </Dashboard>
  );
};

export default EditEmployeePage;
