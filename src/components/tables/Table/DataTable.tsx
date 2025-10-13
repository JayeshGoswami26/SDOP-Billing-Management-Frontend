import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
// import TableCard from "../../ui/card/TableCard";

export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  skeletonRows?: number;
  statusToggle?: (row: T) => React.ReactNode;
  getRowKey: (row: T, index: number) => string;
  rowClassName?: string;
  onRowClick?: (row: T) => void;
  title?: string | React.ReactNode;
  actionButton?: React.ReactNode;
}

function DataTable<T extends object>({
  columns,
  data,
  loading = false,
  skeletonRows = 5,
  statusToggle,
  getRowKey,
  rowClassName,
  onRowClick,
}: DataTableProps<T>) {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const onSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }: { field: keyof T }) => (
    <ChevronDown
      size={16}
      className={clsx(
        "ml-1 transition-transform duration-200",
        sortField === field
          ? sortDirection === "desc"
            ? "transform rotate-180"
            : ""
          : "opacity-0 group-hover:opacity-100"
      )}
    />
  );

  // Sort data if sortField is set
  const sortedData = React.useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  return (
   <>
    <table   className="min-w-full border-t-0 rounded-t-2xl border-separate border-spacing-0 mt-3 border dark:border-t dark:rounded-t-2xl dark:border-gray-800">
      <thead className="bg-themeBackgroundColor dark:bg-themeBackgroundColorDark text-gray-500 capitalize">
        <motion.tr
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.2 }}
          className="rounded-t-2xl"
        >
          {columns.map((col, idx) => (
            <th
              key={String(col.key)}
              scope="col"
              className={clsx(
                "px-6 py-3 text-left text-xs font-medium tracking-wider cursor-pointer group bg-themeBackgroundColor dark:bg-gray-500 dark:text-white text-gray-500 capitalize",
                idx === 0 && "rounded-tl-xl",
                idx === columns.length - 1 && "rounded-tr-2xl"
              )}
              onClick={col.sortable ? () => onSort(col.key) : undefined}
            >
              <div className="flex items-center">
                {col.label}
                {col.sortable && <SortIcon field={col.key} />}
              </div>
            </th>
          ))}
          {statusToggle && (
            <th className="px-6 py-3 rounded-tr-2xl">
              <span className="text-xs font-medium">Actions</span>
            </th>
          )}
        </motion.tr>
      </thead>
      <tbody className="bg-white text-sm dark:bg-black dark:text-white text-gray-500">
        <AnimatePresence mode="wait">
          {loading
            ? // Loading skeleton
              Array(skeletonRows)
                .fill(0)
                .map((_, index) => (
                  <motion.tr
                    key={`skeleton-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.05,
                    }}
                    className="hover:bg-slate-50 dark:hover:bg-gray-800"
                  >
                    {columns.map((col, i) => (
                      <td key={i} className={`px-6 py-4 whitespace-nowrap ${col}`}>
                        <div className="h-4 w-24 bg-slate-200 dark:bg-gray-700 rounded animate-pulse" />
                      </td>
                    ))}
                    {statusToggle && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-6 w-16 bg-slate-200 dark:bg-gray-700 rounded-full animate-pulse" />
                      </td>
                    )}
                  </motion.tr>
                ))
            : // Actual data rows
              sortedData.map((row, index) => {
                const isLast = index === sortedData.length - 1;
                return (
                  <motion.tr
                    key={getRowKey(row, index)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.03,
                    }}
                    whileHover={{
                      backgroundColor: "rgba(248, 250, 252, 0.8)",
                      transition: { duration: 0.15 },
                    }}
                    className={clsx(
                      "cursor-pointer transition-colors",
                      !isLast &&
                        "border-b border-slate-200 dark:border-gray-700"
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((col, i) => (
                      <td
                        key={i}
                        className={clsx(
                          "px-6 py-4",
                          rowClassName ? rowClassName : "whitespace-nowrap"
                        )}
                      >
                        {col.render
                          ? col.render(row, index)
                          : String(row[col.key] ?? "")}
                      </td>
                    ))}
                    {statusToggle && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {statusToggle(row)}
                      </td>
                    )}
                  </motion.tr>
                );
              })}
        </AnimatePresence>
      </tbody>
    </table>
    
    
    
    
    </>
  );
}

export default DataTable;
