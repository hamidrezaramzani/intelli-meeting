import type { TFunction } from "i18next";

import type { TableColumn } from "@/ui";

export const getEmployeesColumns = (
  t: TFunction,
): TableColumn<{
  id: string;
  fullName: string;
  position: { id: string; title: string };
}>[] => [
  {
    key: "fullName",
    label: t("employee:column.fullName"),
  },
  {
    key: "position",
    label: t("employee:column.position"),
    render: (row) => row.position.title,
  },
];
