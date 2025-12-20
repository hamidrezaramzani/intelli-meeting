"use client";

import { confirmation } from "@intelli-meeting/shared-ui";
import { useAuthRedirect } from "@intelli-meeting/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  useDeletePositionMutation,
  useReadManyPositionsQuery,
} from "@/services";
import { Table } from "@/ui";

import type { Position } from "./positions-list.type";

import { getPositionColumns } from "./positions-list.constant";

export const PositionsList = () => {
  const { t } = useTranslation();

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
      title: t("common:deleteThing", {
        thing: t("setting:positions.position"),
      }),
      message: t("common:deleteThingConfirmation", {
        thing: t("setting:positions.position"),
      }),
      confirmText: t("common:yes"),
      cancelText: t("common:no"),
    });

    if (!isConfirmed) return;

    await toast.promise(
      deletePosition({ params: { id: position.id } }).unwrap(),
      {
        pending: t("common:thingDeleted", {
          thing: t("setting:positions.position"),
        }),
        success: {
          render: () => {
            router.push("/settings?tab=positions");
            return t("common:thingDeleted", {
              thing: t("setting:positions.position"),
            });
          },
        },
        error: t("common:operationFailed"),
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
      title={t("setting:positions.title")}
      columns={getPositionColumns(t)}
      description={t("setting:positions.description")}
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
