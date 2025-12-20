"use client";

import { confirmation } from "@intelli-meeting/shared-ui";
import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";

import {
  useDeleteEmployeeMutation,
  useReadManyEmployeesQuery,
} from "@/services";
import { Dashboard, Table } from "@/ui";

import { getEmployeesColumns } from "./_constants";

const EmployeesPage = () => {
  const router = useRouter();

  const { t } = useTranslation();

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
      title: t("common:deleteThing", { thing: t("employee:employee") }),
      message: t("common:deleteThingConfirmation", {
        thing: t("employee:employee"),
      }),
      confirmText: t("common:yes"),
      cancelText: t("common:no"),
    });

    if (!isConfirmed) return;

    await toast.promise(
      deleteEmployee({
        params: { id: row.id },
      }).unwrap(),
      {
        pending: t("common:deletingThing", { thing: t("employee:employee") }),
        success: {
          render: () => {
            router.push("/employees");
            return t("common:thingDeleted", { thing: t("employee:employee") });
          },
        },
        error: t("common:operationFailed"),
      },
    );
  };

  return (
    <Dashboard title={t("employee:title")}>
      <Table
        data={employees}
        thing={t("employee:employee")}
        title={t("employee:title")}
        actions={[
          {
            children: <MdEdit />,
            onActionClick: ({ id }) => handleEdit(id),
            title: t("common:editThing", { thing: t("employee:employee") }),
          },
          {
            children: <MdDelete />,
            onActionClick: handleDelete,
            title: t("common:deleteThing", { thing: t("employee:employee") }),
          },
        ]}
        columns={getEmployeesColumns(t)}
        description={t("employee:description")}
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
