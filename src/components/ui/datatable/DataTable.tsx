/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion } from "framer-motion";
import { FolderPen } from "lucide-react";
import SearchBar from "../searchbar/SearchBar";
import Button from "../button/Button";

type TableColumn<T> = {
  key: keyof T;
  header: string;
  render?: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  showSearch?: boolean;
  showActionButton?: boolean;
  showFilter?: boolean;
  filter?: any;
  // Pagination props
  totalPages?: number;
  currentPage?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  filterDirection?: "right" | "left" | "between";
  actionButton?: React.ReactNode;
  onSearch?: (query: string) => void;
  serverSidePagination?: boolean;
};

export default function DataTable<T extends { [key: string]: any }>({
  data,
  columns,
  title,
  showSearch = true,
  showActionButton = true,
  showFilter,
  filter,
  totalPages = 1,
  currentPage = 1,
  limit = 10,
  onPageChange,
  filterDirection = "right",
  actionButton,
  onSearch,
  serverSidePagination = false,
}: DataTableProps<T>) {
  // Calculate paginated data
  const startIdx = (currentPage - 1) * limit;
  const endIdx = startIdx + limit;
  const paginatedData = serverSidePagination
    ? data
    : totalPages > 1
    ? data.slice(startIdx, endIdx)
    : data;

  return (
    <div className="space-y-2">
      {(showSearch || showActionButton || showFilter) && (
        <motion.div
          className="flex flex-row sm:flex-row sm:items-center sm:justify-between gap-2"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div
            className={`w-full flex items-center flex-col  sm:flex-row gap-3  ${
              filterDirection === "right"
                ? "justify-end"
                : filterDirection === "left"
                ? "justify-start"
                : "justify-between"
            }`}
          >
            {title && (
              <motion.h2
                className="text-lg  sm:text-xl font-semibold text-gray-800 dark:text-white"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {title}
              </motion.h2>
            )}
            {showSearch && <SearchBar onSearch={onSearch} />}
            {showFilter && <div className="ml-2">{filter}</div>}
            {showActionButton && (actionButton ?? <ExportButton />)}
          </div>
        </motion.div>
      )}

      <div className="overflow-x-auto py-4 min-h-40">
        <motion.div
          className="custom-scrollbar overflow-x-auto rounded-t-2xl border border-gray-200 dark:border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="w-full overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[800px]  md:min-w-[1000px] custom-scrollbar">
              <thead>
                <tr className="bg-themeBackgroundColor dark:bg-white/[0.2] custom-scrollbar">
                  {columns.map((col, idx) => (
                    <th
                      key={idx}
                      className="text-center py-2 px-4 md:py-4 md:px-6 text-xs md:text-sm lg:text-sm font-medium text-gray-600 dark:text-gray-300"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-white/[0.05] custom-scrollbar">
                {paginatedData?.map((row, i) => (
                  <motion.tr
                    key={i}
                    className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition"
                    initial={{ opacity: 0, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    {columns.map((col, j) => (
                      <td
                        key={j}
                        className="py-3 px-4 text-xs md:text-sm text-gray-700 dark:text-gray-300 odd:bg-gray-100 even:bg-gray-50 dark:odd:bg-white/[0.02] dark:even:bg-white/[0.04]"
                      >
                        {col.render ? col.render(row) : (row[col.key] as any)}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-end mt-4">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Toggleable Action Button with Responsive Styles
function ExportButton() {
  const [active, setActive] = useState(false);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setActive(!active)}
      className={`
        ml-2 sm:ml-4
        ${active ? "bg-purple-600 text-white" : "bg-gray-200 text-purple-700"}
        hover:bg-indigo-700 hover:text-white
        ${
          active
            ? "dark:bg-purple-500 dark:text-white"
            : "dark:bg-white/[0.02] dark:text-white"
        }
        dark:hover:bg-indigo-600 dark:hover:text-indigo-300
        rounded-full p-2 sm:p-2.5 transition-colors
      `}
    >
      <FolderPen className="h-5 w-5" strokeWidth={1.5} />
    </Button>
  );
}

// Pagination component
function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange?: (page: number) => void;
}) {
  const handlePrev = () => {
    if (onPageChange && currentPage > 1) onPageChange(currentPage - 1);
  };
  const handleNext = () => {
    if (onPageChange && currentPage < totalPages) onPageChange(currentPage + 1);
  };
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors
          ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-white/[0.02]"
              : "bg-white text-purple-700 hover:bg-purple-100 dark:bg-white/[0.08] dark:text-indigo-300 dark:hover:bg-indigo-600"
          }
        `}
      >
        Prev
      </button>
      <span className="text-xs md:text-sm text-gray-700 dark:text-gray-200">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors
          ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-white/[0.02]"
              : "bg-white text-purple-700 hover:bg-purple-100 dark:bg-white/[0.08] dark:text-indigo-300 dark:hover:bg-indigo-600"
          }
        `}
      >
        Next
      </button>
    </div>
  );
}
