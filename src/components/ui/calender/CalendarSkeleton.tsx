"use client"

import { motion } from "framer-motion"

interface CalendarSkeletonProps {
  showHeader?: boolean
  showDaysOfWeek?: boolean
  animationDelay?: number
}

const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

export function CalendarSkeleton({
  showHeader = true,
  showDaysOfWeek = true,
  animationDelay = 0,
}: CalendarSkeletonProps) {
  // Generate 42 skeleton days (6 weeks × 7 days)
  const skeletonDays = Array.from({ length: 42 }, (_, index) => index)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: animationDelay,
        duration: 0.3,
        staggerChildren: 0.02,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  const pulseVariants = {
    pulse: {
      opacity: [0.4, 0.8, 0.4],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <motion.div
      className="p-4 bg-white dark:bg-white/[0.03] rounded-2xl md:rounded-3xl shadow-sm border border-gray-200 dark:border-white/10 w-[80vw] md:max-w-[80vw] lg:w-[30vw] xl:w-[34vw] mx-auto lg:p-3 "
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Skeleton */}
      {showHeader && (
        <motion.div className="flex items-center justify-between mb-6 lg:mb-4" variants={itemVariants}>
          {/* Previous button skeleton */}
          <motion.div className="p-2 rounded bg-gray-200 dark:bg-white/10" variants={pulseVariants} animate="pulse">
            <div className="h-4 w-4 bg-gray-300 dark:bg-white/20 rounded" />
          </motion.div>

          {/* Month/Year skeleton */}
          <motion.div
            className="h-6 w-32 bg-gray-200 dark:bg-white/10 rounded lg:h-5"
            variants={{
              pulse: {
                opacity: [0.4, 0.8, 0.4],
                transition: {
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: [0.4, 0, 0.6, 1],
                }
              }
            }}
            animate="pulse"
          />

          {/* Next button skeleton */}
          <motion.div className="p-2 rounded bg-gray-200 dark:bg-white/10" variants={pulseVariants} animate="pulse">
            <div className="h-4 w-4 bg-gray-300 dark:bg-white/20 rounded" />
          </motion.div>
        </motion.div>
      )}

      {/* Days of week skeleton */}
      {showDaysOfWeek && (
        <motion.div className="grid grid-cols-7 gap-2 mb-2 text-center lg:gap-1" variants={itemVariants}>
          {DAYS_OF_WEEK.map((day, index) => (
            <motion.div
              key={day}
              className="h-4 bg-gray-200 dark:bg-white/10 rounded"
              variants={pulseVariants}
              animate="pulse"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </motion.div>
      )}

      {/* Calendar grid skeleton */}
      <motion.div className="grid grid-cols-7 gap-2 lg:gap-1" variants={containerVariants}>
        {skeletonDays.map((_, index) => (
          <motion.div
            key={index}
            className="relative aspect-square p-1 md:p-2 lg:p-[5px] rounded-sm md:rounded-lg lg:rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-white/[0.03]"
            variants={itemVariants}
          >
            <div className="flex flex-col items-start justify-between h-full">
              {/* Date number skeleton */}
              <motion.div
                className="h-3 w-4 bg-gray-200 dark:bg-white/20 rounded md:h-4 md:w-6"
                variants={pulseVariants}
                animate="pulse"
                style={{ animationDelay: `${index * 0.05}s` }}
              />

              {/* Random content skeleton (events/labels) */}
              {Math.random() > 0.7 && (
                <motion.div
                  className="h-2 w-8 bg-indigo-200 dark:bg-indigo-800/50 rounded-full md:h-3 md:w-12 lg:h-2 lg:w-10"
                  variants={pulseVariants}
                  animate="pulse"
                  style={{ animationDelay: `${index * 0.05 + 0.2}s` }}
                />
              )}

              {/* Time skeleton for some days */}
              {Math.random() > 0.8 && (
                <motion.div
                  className="h-2 w-6 bg-gray-300 dark:bg-white/30 rounded md:h-2 md:w-8"
                  variants={pulseVariants}
                  animate="pulse"
                  style={{ animationDelay: `${index * 0.05 + 0.4}s` }}
                />
              )}
            </div>

            {/* Today indicator skeleton */}
            {index === 15 && (
              <motion.div
                className="absolute inset-0 rounded-sm md:rounded-lg lg:rounded-xl ring-2 ring-indigo-300 dark:ring-indigo-600 ring-opacity-50"
                variants={pulseVariants}
                animate="pulse"
              />
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Loading indicator */}
      {/* <motion.div className="flex justify-center mt-4" variants={itemVariants}>
        <motion.div className="flex space-x-1" variants={containerVariants}>
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="h-2 w-2 bg-indigo-400 dark:bg-indigo-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div> */}
    </motion.div>
  )
}

export default CalendarSkeleton
