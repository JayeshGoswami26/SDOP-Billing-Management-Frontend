"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarEvent {
  time: string;
  type?: "event" | "holiday" | "special";
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday?: boolean;
  events?: CalendarEvent[];
  specialLabel?: string;
}

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  eventsByDate?: Record<string, CalendarEvent[]>;
  specialLabelsByDate?: Record<string, string>;
  attendanceStatusByDate?: Record<string, string>;
  currentMonth?: number;
  currentYear?: number;
  onMonthChange?: (month: number, year: number) => void;
}

const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const bgColorMap: Record<string, string> = {
  present: "bg-green-100 dark:bg-indigo-900/20",
  holiday: "bg-yellow-100 dark:bg-yellow-900/20",
  absent: "bg-red-100 dark:bg-red-900/20",
  leave: "bg-blue-100 dark:bg-blue-900/20",
  weekend: "bg-neutral-100 dark:bg-neutral-500/50",
  late_check_in: "bg-orange-100 dark:bg-orange-900/20",
  halfday: "bg-blue-100 dark:bg-blue-900/20",
  present_on_leave: "bg-purple-100 dark:bg-purple-900/20",
  overtime: "bg-indigo-300 dark:bg-indigo-900/20",
  not_in_office: "bg-red-100 dark:bg-red-900/20",
  // Add more as needed
};

export function Calendar({
  onDateSelect,
  eventsByDate = {},
  specialLabelsByDate = {},
  attendanceStatusByDate = {},
  currentMonth: propMonth,
  currentYear: propYear,
  onMonthChange,
}: CalendarProps) {
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(() => {
    if (propMonth !== undefined && propYear !== undefined) {
      return new Date(propYear, propMonth, 1);
    }
    return new Date();
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (
      propMonth !== undefined &&
      propYear !== undefined &&
      (currentDate.getMonth() !== propMonth ||
        currentDate.getFullYear() !== propYear)
    ) {
      setCurrentDate(new Date(propYear, propMonth, 1));
    }
  }, [propMonth, propYear]);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const generateCalendarDays = (): CalendarDay[] => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days: CalendarDay[] = [];
    const prevMonth = new Date(currentYear, currentMonth - 1, 0);
    const prevMonthDays = prevMonth.getDate();

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({ date: prevMonthDays - i, isCurrentMonth: false });
    }

    for (let date = 1; date <= daysInMonth; date++) {
      const isToday =
        date === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();
      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        events: eventsByDate[date.toString()],
        specialLabel: specialLabelsByDate[date.toString()],
      });
    }

    const remainingDays = 42 - days.length;
    for (let date = 1; date <= remainingDays; date++) {
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      if (onMonthChange) {
        onMonthChange(newDate.getMonth(), newDate.getFullYear());
      }
      return newDate;
    });
  };

  const handleDateClick = (day: CalendarDay) => {
    if (day.isCurrentMonth) {
      const clickedDate = new Date(currentYear, currentMonth, day.date);
      setSelectedDate(clickedDate);
      if (onDateSelect) onDateSelect(clickedDate);
    }
  };

  // Function to get status colors and styles
  const getStatusStyles = (status: string) => {
    const statusConfig = {
      present: {
        borderColor: "border-transparent-500",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        textColor: "text-green-600 dark:text-green-400",
        labelColor:
          "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      },
      late_check_in: {
        borderColor: "border-transparent-500",
        bgColor: "bg-orange-50 dark:bg-orange-900/20",
        textColor: "text-orange-600 dark:text-orange-400",
        labelColor:
          "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
      },
      halfDay: {
        borderColor: "border-transparent-500",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        textColor: "text-blue-600 dark:text-blue-400",
        labelColor:
          "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      },
      present_on_leave: {
        borderColor: "border-transparent-500",
        bgColor: "bg-purple-50 dark:bg-purple-900/20",
        textColor: "text-purple-600 dark:text-purple-400",
        labelColor:
          "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
      },
      overtime: {
        borderColor: "border-transparent-500",
        bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
        textColor: "text-indigo-600 dark:text-indigo-400",
        labelColor:
          "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
      },
      holiday: {
        borderColor: "border-transparent-500",
        bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
        textColor: "text-yellow-600 dark:text-yellow-400",
        labelColor:
          "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
      },
      weekend: {
        borderColor: "border-transparent-500 dark:border-transparent",
        bgColor: "bg-neutral-200 dark:bg-neutral-500/50",
        textColor: "text-neutral-600 dark:text-neutral-400",
        labelColor:
          "bg-neutral-100 dark:bg-neutral-900/30 text-neutral-600 dark:text-neutral-400",
      },
      not_in_office: {
        borderColor: "border-transparent-500",
        bgColor: "bg-red-50 dark:bg-red-900/20",
        textColor: "text-red-600 dark:text-red-400",
        labelColor:
          "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
      },
      absent: {
        borderColor: "border-transparent-500",
        bgColor: "bg-red-50 dark:bg-red-900/20",
        textColor: "text-red-600 dark:text-red-400",
        labelColor:
          "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
      },
      leave: {
        borderColor: "border-transparent-500",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        textColor: "text-blue-600 dark:text-blue-400",
        labelColor:
          "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      },
    };

    return (
      statusConfig[status as keyof typeof statusConfig] || {
        borderColor: "border-gray-200 dark:border-gray-700",
        bgColor: "bg-white dark:bg-white/[0.03]",
        textColor: "text-gray-500 dark:text-gray-100",
        labelColor:
          "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400",
      }
    );
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="p-4  bg-white dark:bg-white/[0.03] rounded-2xl md:rounded-3xl shadow-sm border border-gray-200 dark:border-white/10 w-[80vw] md:max-w-[80vw] lg:w-[30vw] xl:w-[34vw] mx-auto  lg:p-3">
      <div className="flex items-center justify-between mb-6 lg:mb-4">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-white/50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 lg:text-base">
          {MONTHS[currentMonth]} {currentYear}
        </h2>
        <button
          onClick={() => navigateMonth("next")}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-white/50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 lg:gap-1">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 lg:gap-1">
        {calendarDays.map((day, index) => {
          const isSelected =
            day.isCurrentMonth &&
            selectedDate &&
            day.date === selectedDate.getDate() &&
            currentMonth === selectedDate.getMonth() &&
            currentYear === selectedDate.getFullYear();

          // Get attendance status for this day
          const dayStatus = attendanceStatusByDate[day.date.toString()];
          const statusStyles = getStatusStyles(dayStatus);

          // Determine if we should show colored border (only for non-present status)
          const shouldShowBorder =
            dayStatus && dayStatus !== "present" && day.isCurrentMonth;

          return (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`relative aspect-square p-2 md:p-2 lg:p-[5px] rounded-md  md:rounded-lg lg:rounded-xl border cursor-pointer transition-all duration-200
                ${day.isToday ? "ring-2 ring-indigo-500 ring-opacity-50 " : ""}
                ${
                  isSelected
                    ? "bg-indigo-100 dark:bg-indigo-700/20 border-indigo-500 "
                    : shouldShowBorder
                    ? `${statusStyles.bgColor} ${statusStyles.borderColor} border-2`
                    : isMobileView && day.specialLabel
                    ? `${
                        bgColorMap[day.specialLabel.toLowerCase()] ||
                        "bg-indigo-100 dark:bg-indigo-900/30"
                      } border-gray-200 dark:border-gray-700`
                    : day.isCurrentMonth
                    ? "bg-white dark:bg-white/[0.03] border-gray-200 dark:border-gray-700"
                    : "bg-white dark:bg-white/10 border-indigo-500/50 text-indigo-500/50"
                }
                
                hover:bg-gray-300/50 dark:hover:bg-gray-700`}
            >
              <div className="flex flex-col items-start justify-between h-full md:text-center">
                <span
                  className={`text-[16px] md:text-[1.8vw] lg:text-[0.8vw] font-medium md:mb-1 ${
                    shouldShowBorder
                      ? statusStyles.textColor
                      : day.isCurrentMonth
                      ? "text-gray-500 dark:text-gray-100"
                      : "text-indigo-500/40 dark:text-gray-600"
                  }`}
                >
                  {day.date}
                </span>
                {day.specialLabel && (
                  <div
                    className={`text-[4px] flex xsm:text-[8px] sm:text-[8px] md:text-[9px] lg:text-[6px] xl:text-[0.6vw] font-semibold px-0.5 py-0.5 sm:px-2 sm:py-1 md:px-5 md:py-1 lg:px-1 lg:py-[1px] xl:px-3 xl:py-[2px] rounded-xs sm:rounded-md lg:rounded-sm
                    ${
                      isMobileView
                        ? "hidden"
                        : shouldShowBorder
                        ? statusStyles.labelColor
                        : "text-indigo-500 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30"
                    }
                    `}
                  >
                    {day.specialLabel}
                  </div>
                )}

                {day.events && !day.specialLabel && (
                  <div className="text-[2vw] md:text-[1vw] lg:text-[0.5vw] text-gray-500 dark:text-gray-400 flex gap-1">
                    <span className="hidden md:inline">🕘</span>
                    <span>{day.events[0].time}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
