"use client";

import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

import { EMPLOYEES_LIST_COLUMNS } from "@/lib/constant";
import { useReadManyEmployeesQuery } from "@/services";
import { Dashboard, Table } from "@/ui";

const EmployeesPage = () => {
  const router = useRouter();

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

  const handleEdit = () => console.log("Edit");
  const handleDelete = () => console.log("Delete");

  return (
    <Dashboard title="Employees">
      <Table
        data={employees}
        title="List of employees"
        actions={[
          {
            children: <MdEdit />,
            onActionClick: () => handleEdit(),
            title: "Edit employee",
          },
          {
            children: <MdDelete />,
            onActionClick: () => handleDelete(),
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
