import type { TFunction } from "i18next";

import moment from "moment-jalaali";
import Link from "next/link";

import type { TableColumn } from "@/ui";

import type { Meeting } from "../_types";

export const getMeetingColumns = (t: TFunction): TableColumn<Meeting>[] => [
  {
    key: "title",
    label: t("common:column.title"),
    render: (row) => <Link href={`/meeting/${row.id}`}>{row.title}</Link>,
  },
  {
    key: "date",
    label: t("meeting:column.date"),
    render: (row) => moment(row.date).format("YYYY/MM/DD"),
  },
  { key: "start_time", label: t("meeting:column.startTime") },
  { key: "end_time", label: t("meeting:column.endTime") },
];
