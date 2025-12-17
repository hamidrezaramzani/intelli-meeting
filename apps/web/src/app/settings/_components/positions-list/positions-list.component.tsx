"use client";

import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useReadManyPositionsQuery } from "@/services";
import { Table } from "@/ui";

import type { Position } from "./positions-list.type";

import { POSITIONS_COLUMNS } from "./positions-list.constant";

export const PositionsList = () => {
  const router = useRouter();

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
  const handleDelete = (position: Position) => console.log("Delete", position);

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
