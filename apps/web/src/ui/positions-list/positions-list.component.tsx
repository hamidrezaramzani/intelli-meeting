"use client";

import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Meeting } from "@/lib/type";

import { useReadManyPositionsQuery } from "@/services";
import { Table } from "@/ui";

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

  const handleEdit = (meeting: Meeting) => console.log("Edit", meeting);
  const handleDelete = (meeting: Meeting) => console.log("Delete", meeting);

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
