import moment from "moment-jalaali";
import Link from "next/link";

import type { TableColumn } from "@/ui";

import type { Meeting } from "../_types";

export const MEETINGS_LIST_COLUMNS: TableColumn<Meeting>[] = [
  {
    key: "title",
    label: "Title",
    render: (row) => <Link href={`/meeting/${row.id}`}>{row.title}</Link>,
  },
  {
    key: "date",
    label: "Date",
    render: (row) => moment(row.date).format("YYYY/MM/DD"),
  },
  { key: "start_time", label: "Start Time" },
  { key: "end_time", label: "End Time" },
];
