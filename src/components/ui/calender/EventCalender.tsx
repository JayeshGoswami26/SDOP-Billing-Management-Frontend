"use client"
 
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
 
interface CalendarEvent {
  time: string
  type?: "event" | "holiday" | "special"
  title?: string
}
 
interface CalendarDay {
  date: number
  isCurrentMonth: boolean
  isToday?: boolean
  events?: CalendarEvent[]
  holidays?: CalendarEvent[]
  specialLabel?: string
}
 
interface CalendarProps {
  onDateSelect?: (date: Date) => void
  eventsByDate?: Record<string, CalendarEvent[]>
  holidaysByDate?: Record<string, CalendarEvent[]>
  specialLabelsByDate?: Record<string, string>
  currentMonth?: number
  currentYear?: number
  onMonthChange?: (month: number, year: number) => void
}
 
const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
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
]
 
export function Calendar({
  onDateSelect,
  eventsByDate = {},
  holidaysByDate = {},
  specialLabelsByDate = {},
  currentMonth: propMonth,
  currentYear: propYear,
  onMonthChange,
}: CalendarProps) {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(() => {
    if (propMonth !== undefined && propYear !== undefined) {
      return new Date(propYear, propMonth, 1)
    }
    return new Date()
  })
 
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
 
  useEffect(() => {
    if (
      propMonth !== undefined &&
      propYear !== undefined &&
      (currentDate.getMonth() !== propMonth || currentDate.getFullYear() !== propYear)
    ) {
      setCurrentDate(new Date(propYear, propMonth, 1))
    }
  }, [propMonth, propYear])
 
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
 
  const generateCalendarDays = (): CalendarDay[] => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
    const firstDayOfWeek = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()
 
    const days: CalendarDay[] = []
    const prevMonth = new Date(currentYear, currentMonth - 1, 0)
    const prevMonthDays = prevMonth.getDate()
 
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({ date: prevMonthDays - i, isCurrentMonth: false })
    }
 
    for (let date = 1; date <= daysInMonth; date++) {
      const isToday =
        date === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        events: eventsByDate[date.toString()],
        holidays: holidaysByDate[date.toString()],
        specialLabel: specialLabelsByDate[date.toString()],
      })
    }
 
    const remainingDays = 42 - days.length
    for (let date = 1; date <= remainingDays; date++) {
      days.push({ date, isCurrentMonth: false })
    }
 
    return days
  }
 
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1))
      if (onMonthChange) {
        onMonthChange(newDate.getMonth(), newDate.getFullYear())
      }
      return newDate
    })
  }
 
  const handleDateClick = (day: CalendarDay) => {
    if (day.isCurrentMonth) {
      const clickedDate = new Date(currentYear, currentMonth, day.date)
      setSelectedDate(clickedDate)
      if (onDateSelect) onDateSelect(clickedDate)
    }
  }
 
  const calendarDays = generateCalendarDays()
 
  return (
    <div className="p-2 sm:p-4 bg-white dark:bg-white/[0.03] rounded-xl sm:rounded-2xl md:rounded-3xl shadow-sm border border-gray-200 dark:border-white/10 w-full max-w-full mx-auto">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-1 sm:p-2 rounded dark:bg-white/[0.03]  hover:bg-gray-200 dark:hover:bg-white/50"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 text-gray-500 dark:text-white sm:w-4" />
        </button>
        <h2 className="text-sm sm:text-lg font-medium text-gray-900 dark:text-gray-100">
          {MONTHS[currentMonth]} {currentYear}
        </h2>
        <button
          onClick={() => navigateMonth("next")}
          className="p-1 sm:p-2 rounded dark:bg-white/[0.03]  hover:bg-gray-200 dark:hover:bg-white/50"
        >
          <ChevronRight className="h-3 w-3 sm:h-4 text-gray-500 dark:text-white sm:w-4" />
        </button>
      </div>
 
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="py-1">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 1)}</span>
          </div>
        ))}
      </div>
 
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {calendarDays.map((day, index) => {
          const isSelected =
            day.isCurrentMonth &&
            selectedDate &&
            day.date === selectedDate.getDate() &&
            currentMonth === selectedDate.getMonth() &&
            currentYear === selectedDate.getFullYear()
 
          const hasEvents = day.events && day.events.length > 0
          const hasHolidays = day.holidays && day.holidays.length > 0
 
          return (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`relative aspect-square p-1 sm:p-2 rounded-sm sm:rounded-lg border cursor-pointer transition-all duration-200 min-h-[40px] sm:min-h-[60px] md:h-[80px]
              ${
                day.isToday
                  ? "ring-1 sm:ring-2 ring-indigo-500 ring-opacity-50 "
                  : ""
              }
              ${
                isSelected
                  ? "bg-indigo-100 dark:bg-indigo-400/30 dark:border-indigo-700 border-indigo-500 "
                  : day.isCurrentMonth
                  ? "bg-white dark:bg-white/[0.03] "
                  : "bg-white dark:bg-white/10 border-indigo-500/50 text-indigo-500/50 "
              }
              hover:bg-gray-300 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 `}
            >
              <div className="flex flex-col items-start justify-between h-full">
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    day.isCurrentMonth
                      ? "text-gray-500 dark:text-gray-100"
                      : "text-indigo-500/40 dark:text-gray-600"
                  }`}
                >
                  {day.date}
                </span>
 
                <div className="flex flex-col gap-0.5 w-full">
                  {day.specialLabel && (
                    <div className="text-[8px] sm:text-xs font-semibold text-indigo-500 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-1 py-0.5 rounded text-center">
                      {day.specialLabel}
                    </div>
                  )}
 
                  {hasHolidays && !day.specialLabel && (
                    <div className="text-[8px] sm:text-xs font-medium text-indigo-900 dark:border-indigo-700 dark:text-indigo-100 bg-indigo-300 dark:bg-indigo-400/30  px-1 py-0.5 rounded text-center">
                      Holiday
                    </div>
                  )}
 
                  {hasEvents && !day.specialLabel && !hasHolidays && (
                    <div className="text-[8px] sm:text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1 py-0.5 rounded text-center">
                      Event
                    </div>
                  )}
 
                  {hasEvents && hasHolidays && !day.specialLabel && (
                    <div className="flex flex-col gap-0.5">
                      <div className="text-[7px] sm:text-[10px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-0.5 py-0.5 rounded text-center">
                        Holiday
                      </div>
                      <div className="text-[7px] sm:text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-0.5 py-0.5 rounded text-center">
                        Event
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}
 
export default Calendar