"use client";
import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { useCreateEmployeeMutation } from "@/services";
import { Dashboard } from "@/ui";

import type { EmployeeFormValues } from "../_components";

import { EmployeeForm } from "../_components";

const NewEmployeeForm = () => {
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();

  const router = useRouter();
  useAuthRedirect({
    onRedirect: () => router.push("/sign-in"),
    type: "unlogged",
  });

  const onSubmit = async (data: EmployeeFormValues) => {
    await toast.promise(createEmployee(data).unwrap(), {
      pending: "Creating employee...",
      success: {
        render: () => {
          router.push("/employees");
          return "Employee created successfully!";
        },
      },
      error: "Error while creating employee. Please try again.",
    });
  };

  <Dashboard backUrl="/employees" title="New employee">
    <EmployeeForm
      defaultValue={{ fullName: "", position: "" }}
      isEdit={false}
      isLoading={isLoading}
      onSubmit={onSubmit}
    />
    ;
  </Dashboard>;
};

export default NewEmployeeForm;
