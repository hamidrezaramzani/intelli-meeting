/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
"use client";

import { Button, IconButton } from "@intelli-meeting/shared-ui";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
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
  loading,
  rowStyles,
  thing = "",
}: TableProps<T>) => {
  const router = useRouter();

  const { t } = useTranslation();

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
    <div className="w-full">
      <div className="w-full flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center my-5">
        <div className="flex-1">
          <h2 className="text-2xl font-roboto font-bold text-slate-900">
            {title}
          </h2>
          <p className="font-body text-sm font-roboto  text-slate-500 mt-2">
            {description}
          </p>
        </div>
        <div className="flex sm:justify-end">
          {formPath && (
            <Button onClick={() => router.push(formPath)}>
              {t("common:addThing", { thing })}
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                className="px-6 py-3 text-left text-sm font-roboto  font-medium text-gray-700"
                key={String(col.key)}
              >
                {col.label.toUpperCase()}
              </th>
            ))}
            {(onEdit || onDelete || actions) && (
              <th className="px-6 py-3 text-left align-middle text-sm font-roboto  font-medium text-gray-700">
                {t("common:actions")}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <tr className="hover:bg-gray-50" key={index}>
                  {columns.map((col) => (
                    <td
                      width={col.width}
                      className="px-6 py-4 whitespace-nowrap text-sm font-roboto  text-gray-800"
                      key={String(col.key)}
                    >
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                  {(onEdit || onDelete || actions) && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-roboto  flex gap-2">
                      <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                    </td>
                  )}
                </tr>
              ))
            : data.map((row, rowIndex) => (
                <tr
                  className={`hover:bg-gray-50 align-middle ${rowStyles ? rowStyles(row) : ""}`}
                  key={rowIndex}
                >
                  {columns.map((col) => (
                    <td
                      width={col.width}
                      className="px-6 py-4 align-middle text-sm font-roboto  text-gray-800 "
                      key={String(col.key)}
                    >
                      {col.render
                        ? col.render(row)
                        : String(row[col.key] || "")}
                    </td>
                  ))}

                  {(onEdit || onDelete || actions) && (
                    <td className="px-6 py-4 flex gap-2 align-middle h-full items-center text-sm font-roboto  text-center">
                      {onEdit && (
                        <IconButton
                          size="sm"
                          type="button"
                          onClick={() => onEdit(row)}
                        >
                          <MdEdit size={17} />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton
                          size="sm"
                          type="button"
                          onClick={() => onDelete(row)}
                        >
                          <MdDelete size={17} />
                        </IconButton>
                      )}

                      {actions?.map((button, index) => {
                        if (button.show && !button?.show(row)) {
                          return null;
                        }

                        return (
                          <IconButton
                            type="button"
                            {...button}
                            className="text-lg font-roboto  cursor-pointer mr-3"
                            // eslint-disable-next-line @eslint-react/jsx-key-before-spread, @eslint-react/no-array-index-key
                            key={index}
                            onClick={() => button.onActionClick?.(row)}
                            // eslint-disable-next-line @eslint-react/no-children-prop
                            children={
                              button.children || button?.render?.(row) || null
                            }
                          />
                        );
                      })}
                    </td>
                  )}
                </tr>
              ))}

          {error && (
            <tr className="text-center py-4">
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}>
                <span className="px-6 py-6 block text-center text-red-400 text-sm font-roboto ">
                  {t("common:table.unableToFetchData")}
                </span>
                {refetch && (
                  <IconButton
                    className="w-24"
                    fullWidth={false}
                    type="button"
                    variant="secondary"
                    onClick={refetch}
                  >
                    <MdRefresh fontSize={22} />
                  </IconButton>
                )}
              </td>
            </tr>
          )}

          {data.length === 0 && !error && !loading && (
            <tr>
              <td
                className="px-6 py-4 text-center text-gray-400 text-sm font-roboto "
                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
              >
                {t("common:table.notDataFound")}
              </td>
            </tr>
          )}
        </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2 mt-4">
          <Button
            className="w-24"
            disabled={pagination.currentPage === 1}
            fullWidth={false}
            onClick={handlePrev}
          >
            {t("common:pagination.previous")}
          </Button>
          <span className="flex items-center px-2 text-sm font-roboto  text-gray-700">
            {t("common:pagination.pageOf", {
              current: pagination.currentPage,
              total: pagination.totalPages,
            })}
          </span>
          <Button
            className="w-24"
            disabled={pagination.currentPage === pagination.totalPages}
            fullWidth={false}
            onClick={handleNext}
          >
            {t("common:pagination.next")}
          </Button>
        </div>
      )}
    </div>
  );
};
