import type { TableColumn } from "@/ui";

export const EMPLOYEES_LIST_COLUMNS: TableColumn<{
  fullName: string;
  position: { id: string; title: string };
}>[] = [
  {
    key: "fullName",
    label: "Fullname",
  },
  {
    key: "position",
    label: "Position",
    render: (row) => row.position.title,
  },
];
