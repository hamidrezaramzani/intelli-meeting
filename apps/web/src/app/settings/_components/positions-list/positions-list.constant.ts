import type { TFunction } from "i18next";

import type { TableColumn } from "@/ui";

export const getPositionColumns = (
  t: TFunction,
): TableColumn<{ title: string }>[] => [
  {
    label: t("common:column.title"),
    key: "title",
  },
];
