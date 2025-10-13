"use client";

import { motion } from "framer-motion";



const TableSkeleton = ({rows = 10}: {rows: number}) => {
  return (
    <motion.div
      className="rounded-t-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0, duration: 0.6 }}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] md:min-w-[1000px] animate-pulse ">
          <thead>
            <tr className="bg-[#8a86b6] dark:bg-white/[0.03] ">
              <th className="py-4 px-6 text-left">
                <div className="h-4 w-12 bg-gray-300 dark:bg-white/10 rounded"></div>
              </th>
              <th className="py-4 px-6 text-left">
                <div className="h-4 w-20 bg-gray-300 dark:bg-white/10 rounded"></div>
              </th>
              <th className="py-4 px-6 text-left">
                <div className="h-4 w-20 bg-gray-300 dark:bg-white/10 rounded"></div>
              </th>
              <th className="py-4 px-6 text-left">
                <div className="h-4 w-20 bg-gray-300 dark:bg-white/10 rounded"></div>
              </th>
              <th className="py-4 px-6 text-left">
                <div className="h-4 w-20 bg-gray-300 dark:bg-white/10 rounded"></div>
              </th>
              <th className="py-4 px-6 text-left">
                <div className="h-4 w-20 bg-gray-300 dark:bg-white/10 rounded"></div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-300 dark:bg-white/[0.05]">
            {Array.from({ length: rows }).map((_, i) => (
              <tr
                key={i}
                className="border-b border-gray-100 dark:border-white/5  "
              >
                {/* Date column */}
                <td className="px-6 py-4">
                  <div className="h-4 w-20 bg-gray-100 dark:bg-white/10 rounded"></div>
                </td>

                {/* Punched In column */}
                <td className="px-6 py-4">
                  <div className="h-4 w-16 bg-gray-100 dark:bg-white/10 rounded"></div>
                </td>

                {/* Punched Out column */}
                <td className="px-6 py-4">
                  <div className="h-4 w-16 bg-gray-100 dark:bg-white/10 rounded"></div>
                </td>

                {/* Behaviour column - Status badge */}
                <td className="px-6 py-4">
                  <div
                    className={`h-6 w-16 rounded-full ${
                      i % 4 === 0
                        ? "bg-blue-light-100 dark:bg-blue-light-900"
                        : i % 4 === 1
                        ? "bg-error-100 dark:bg-error-900"
                        : i % 4 === 2
                        ? "bg-success-100 dark:bg-success-900"
                        : "bg-gray-100 dark:bg-white/10"
                    }`}
                  ></div>
                </td>

                {/* Break Time column */}
                <td className="px-6 py-4">
                  <div className="h-4 w-12 bg-gray-100 dark:bg-white/10 rounded"></div>
                </td>

                {/* Total Hours column */}
                <td className="px-6 py-4">
                  <div className="h-4 w-14 bg-gray-100 dark:bg-white/10 rounded"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default TableSkeleton;