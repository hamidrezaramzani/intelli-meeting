"use client";

import { confirmation } from "@intelli-meeting/shared-ui";
import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";

import {
  useDeleteEmployeeMutation,
  useReadManyEmployeesQuery,
} from "@/services";
import { Dashboard, Table } from "@/ui";

import { EMPLOYEES_LIST_COLUMNS } from "./_constants";

const EmployeesPage = () => {
  const router = useRouter();

  const [deleteEmployee] = useDeleteEmployeeMutation();

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data } = useReadManyEmployeesQuery({
    query: {
      limit,
      page,
    },
  });

  const employees = data?.employees || [];
  const total = data?.total || 0;

  useAuthRedirect({
    onRedirect: () => router.push("/sign-in"),
    type: "unlogged",
  });

  const handleEdit = (id: string) => router.push(`/employees/edit/${id}`);
  const handleDelete = async (row: {
    id: string;
    fullName: string;
    position: { id: string; title: string };
  }) => {
    const isConfirmed = await confirmation({
      title: "Delete employee",
      message: "Do you want to delete this employee?",
      confirmText: "Yes",
      cancelText: "No",
    });

    if (!isConfirmed) return;

    await toast.promise(
      deleteEmployee({
        params: { id: row.id },
      }).unwrap(),
      {
        pending: "Updating audio text...",
        success: {
          render: () => {
            router.push("/employees");
            return "Deleting employee was successfully!";
          },
        },
        error: "Failed to delete employee. Please try again.",
      },
    );
  };

  return (
    <Dashboard title="Employees">
      <Table
        data={employees}
        title="List of employees"
        actions={[
          {
            children: <MdEdit />,
            onActionClick: ({ id }) => handleEdit(id),
            title: "Edit employee",
          },
          {
            children: <MdDelete />,
            onActionClick: handleDelete,
            title: "Delete employee",
          },
        ]}
        columns={EMPLOYEES_LIST_COLUMNS}
        description="This table shows all employees inside your organization"
        formPath="/employees/new"
        pagination={{
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          onPageChange: setPage,
        }}
      />
    </Dashboard>
  );
};

export default EmployeesPage;
