import type { Audio } from "@/lib/type";
import type { TableColumn } from "@/ui";

import { formatDuration } from "@/lib/helpers";

export const AUDIOS_LIST_COLUMNS: TableColumn<Audio>[] = [
  { key: "name", label: "Name" },
  { key: "date", label: "Date" },
  {
    key: "duration",
    label: "Duration",
    render: (record) => formatDuration(record.duration),
  },
  {
    key: "status",
    label: "Status",
    render: (row: { status: string }) => {
      let colorClass = "";

      switch (row.status) {
        case "pending":
          colorClass = "bg-gray-400";
          break;
        case "processing":
          colorClass = "bg-blue-500";
          break;
        case "success":
          colorClass = "bg-green-500";
          break;
        case "failed":
          colorClass = "bg-red-500";
          break;
        default:
          colorClass = "bg-gray-400";
      }

      return (
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${colorClass}`}></span>
          <span className="capitalize">{row.status}</span>
        </div>
      );
    },
  },
  {
    key: "meeting",
    label: "Meeting",
    render: (row) => row.meeting?.title,
  },
];
