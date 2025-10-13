"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { format, subMonths, subYears } from "date-fns";

export interface DateRangeProps {
  currentDate: string;
  setCurrentDate: (date: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export default function DateRange({
  currentDate,
  setCurrentDate,
  activeFilter,
  setActiveFilter,
}: DateRangeProps) {
  const filters = [
    "This Month",
    "Last Month",
    "This Year",
    "Last Year",
    "Total",
  ];

  useEffect(() => {
    const today = new Date();
    let dateText = "";

    switch (activeFilter) {
      case "This Month":
        dateText = format(today, "MMMM yyyy");
        break;
      case "Last Month":
        dateText = format(subMonths(today, 1), "MMMM yyyy");
        break;
      case "This Year":
        dateText = format(today, "yyyy");
        break;
      case "Last Year":
        dateText = format(subYears(today, 1), "yyyy");
        break;
      case "Total":
        dateText = "Total";
        break;
      default:
        dateText = "";
    }

    setCurrentDate(dateText);
  }, [activeFilter, setCurrentDate]);

  return (
    <header className="border-b-[0.5px] dark:border-white/[0.09] md:flex md:justify-between flex flex-col md:flex-row ">
      <div className="flex  items-center  justify-between pl-0 md:pl-4 px-4 py-2 gap-2">
        <span className="text-lg  font-medium text-[#5A5A5A] min-w-[120px] md:text-center">
          {currentDate}
        </span>
      </div>

      <motion.nav
        layout
        className="flex items-center space-x-2 pl-0 md:pl-4 px-4 py-2 relative overflow-x-auto"
      >
        {filters.map((filter) => {
          const isActive = activeFilter === filter;

          return (
            <motion.button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`relative min-w-[6rem] md:min-w-0 md:w-auto flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 ${
                isActive
                  ? "text-white bg-[#534CAA]"
                  : "text-gray-700 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.09] dark:text-white hover:text-themeGradientColorFrom dark:hover:text-white "
              }`}
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 0.97 }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilterBackground"
                  className="absolute inset-0 rounded-xl bg-[#534CAA] z-[-1]"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
              {filter}
            </motion.button>
          );
        })}
      </motion.nav>
    </header>
  );
}
