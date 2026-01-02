"use client";
import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useCreateEmployeeMutation } from "@/services";
import { Dashboard } from "@/ui";

import type { EmployeeFormValues } from "../_components";

import { EmployeeForm } from "../_components";

const NewEmployeeForm = () => {
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();
  const { t } = useTranslation();

  const router = useRouter();
  useAuthRedirect({
    onRedirect: () => router.push("/sign-in"),
    type: "unlogged",
  });

  const onSubmit = async (data: EmployeeFormValues) => {
    await toast.promise(createEmployee(data).unwrap(), {
      pending: t("employee:messages.creating"),
      success: {
        render: () => {
          router.push("/employees");
          return t("employee:messages.created");
        },
      },
      error: t("employee:messages.createFailed"),
    });
  };

  return (
    <Dashboard
      backUrl="/employees"
      title={t("employee:form.createTitle")}
    >
      <EmployeeForm
        defaultValue={{ fullName: "", position: "" }}
        isEdit={false}
        isLoading={isLoading}
        onSubmit={onSubmit}
      />
      ;
    </Dashboard>
  );
};

export default NewEmployeeForm;
