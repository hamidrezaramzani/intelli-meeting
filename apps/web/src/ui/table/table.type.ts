import type { ReactNode } from "react";
import type React from "react";

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (row: T) => ReactNode;
  width?: number;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  title: string;
  description: string;
  formPath?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  error?: boolean;
  refetch?: () => void;
  actions?: (React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onActionClick?: (record: T) => void;
  })[];
}
