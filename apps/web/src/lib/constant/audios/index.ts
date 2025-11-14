import type { Audio } from "@/lib/type";
import type { TableColumn } from "@/ui";

export const AUDIOS_LIST_COLUMNS: TableColumn<Audio>[] = [
  { key: "name", label: "Name" },
  { key: "date", label: "Date" },
  { key: "duration", label: "Duration" },
  { key: "file_path", label: "File" },
  { key: "meeting", label: "Meeting", render: (row) => row.meeting?.title },
];
