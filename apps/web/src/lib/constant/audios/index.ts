import type { Audio } from "@/lib/type";
import type { TableColumn } from "@/ui";

export const AUDIOS_LIST_COLUMNS: TableColumn<Audio>[] = [
  { key: "title", label: "Title" },
  { key: "date", label: "Date" },
  { key: "duration", label: "Duration" },
  { key: "meeting", label: "Meeting" },
];
