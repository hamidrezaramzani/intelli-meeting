"use client";

import { confirmation } from "@intelli-meeting/shared-ui";
import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import {
  useDeletePositionMutation,
  useReadManyPositionsQuery,
} from "@/services";
import { Table } from "@/ui";

import type { Position } from "./positions-list.type";

import { POSITIONS_COLUMNS } from "./positions-list.constant";

export const PositionsList = () => {
  const router = useRouter();

  const [deletePosition] = useDeletePositionMutation();

  const [page, setPage] = useState(1);

  const limit = 10;
  const { data } = useReadManyPositionsQuery({
    query: {
      limit,
      page,
    },
  });

  const total = data?.total || 0;

  const positions = data?.positions || [];

  const handleEdit = (position: Position) =>
    router.push(`/positions/edit/${position.id}`);
  const handleDelete = async (position: Position) => {
    const isConfirmed = await confirmation({
      title: "Delete position",
      message: "Do you want to delete this position?",
      confirmText: "Yes",
      cancelText: "No",
    });

    if (!isConfirmed) return;

    await toast.promise(
      deletePosition({ params: { id: position.id } }).unwrap(),
      {
        pending: "Deleting employee...",
        success: {
          render: () => {
            router.push("/settings?tab=positions");
            return "Employee deleted successfully!";
          },
        },
        error: "Error while deleting employee. Please try again.",
      },
    );
  };

  useAuthRedirect({
    onRedirect: () => router.push("/sign-in"),
    type: "unlogged",
  });

  return (
    <Table
      data={positions}
      title="List of positions"
      columns={POSITIONS_COLUMNS}
      description="This table show you all of positions that you saved before"
      formPath="/positions/new"
      onDelete={handleDelete}
      onEdit={handleEdit}
      pagination={{
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        onPageChange: setPage,
      }}
    />
  );
};
