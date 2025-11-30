import Link from "next/link";

import type { Meeting } from "@/lib/type";
import type { TableColumn } from "@/ui";

export const MEETINGS_LIST_COLUMNS: TableColumn<Meeting>[] = [
  {
    key: "title",
    label: "Title",
    render: (row) => <Link href={`/meeting/${row.id}`}>{row.title}</Link>,
  },
  { key: "date", label: "Date" },
  { key: "start_time", label: "Start Time" },
];
