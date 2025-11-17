/* eslint-disable max-lines-per-function */
"use client";

import { Button, IconButton } from "@intelli-meeting/shared-ui";
import { useRouter } from "next/navigation";
import { MdDelete, MdEdit, MdRefresh } from "react-icons/md";

import type { TableProps } from "./table.type";

export const Table = <T,>({
  columns,
  data,
  onEdit,
  onDelete,
  title,
  description,
  formPath,
  pagination,
  actions,
  error,
  refetch,
}: TableProps<T>) => {
  const router = useRouter();

  const handlePrev = () => {
    if (pagination && pagination.currentPage > 1) {
      pagination.onPageChange(pagination.currentPage - 1);
    }
  };

  const handleNext = () => {
    if (pagination && pagination.currentPage < pagination.totalPages) {
      pagination.onPageChange(pagination.currentPage + 1);
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <div className="w-full flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>

          <p className="font-body text-sm pt-1 pb-5 text-slate-600">
            {description}
          </p>
        </div>
        <div>
          {formPath && (
            <Button onClick={() => router.push(formPath)}>Add</Button>
          )}
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                className="px-6 py-3 text-left text-sm font-medium text-gray-700"
                key={String(col.key)}
              >
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {data.map((row, rowIndex) => (
            <tr className="hover:bg-gray-50" key={rowIndex}>
              {columns.map((col) => (
                <td
                  width={col.width}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
                  key={String(col.key)}
                >
                  {col.render ? col.render(row) : String(row[col.key] || "")}
                </td>
              ))}

              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-2">
                  {onEdit && (
                    <button
                      className="p-1 rounded hover:bg-gray-100"
                      type="button"
                      onClick={() => onEdit(row)}
                    >
                      <MdEdit size={20} className="text-blue-600" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="p-1 rounded hover:bg-gray-100"
                      type="button"
                      onClick={() => onDelete(row)}
                    >
                      <MdDelete size={20} className="text-red-600" />
                    </button>
                  )}

                  {actions?.map((button, index) => (
                    <button
                      type="button"
                      {...button}
                      className="text-lg cursor-pointer"
                      // eslint-disable-next-line @eslint-react/jsx-key-before-spread, @eslint-react/no-array-index-key
                      key={index}
                      onClick={() => button.onActionClick?.(row)}
                    />
                  ))}
                </td>
              )}
            </tr>
          ))}

          {error && (
            <tr className="text-center py-4">
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}>
                <span className="px-6 py-6 block text-center text-red-400 text-sm">
                  Unable to load table data. Please try again later.
                </span>
                {refetch && (
                  <IconButton
                    className="w-24"
                    fullWidth={false}
                    type="button"
                    variant="secondary"
                  >
                    <MdRefresh fontSize={22} />
                  </IconButton>
                )}
              </td>
            </tr>
          )}

          {data.length === 0 && !error && (
            <tr>
              <td
                className="px-6 py-4 text-center text-gray-400 text-sm"
                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4">
          <Button
            className="w-24"
            disabled={pagination.currentPage === 1}
            fullWidth={false}
            onClick={handlePrev}
          >
            Previous
          </Button>
          <span className="flex items-center px-2 text-sm text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            className="w-24"
            disabled={pagination.currentPage === pagination.totalPages}
            fullWidth={false}
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
