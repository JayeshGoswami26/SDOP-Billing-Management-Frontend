"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import clsx from "clsx"


interface StatCardProps {
  totalHours?: string
  label?: string
  className?: string
  isLoading?: boolean
}

const SkeletonBlock: React.FC<{ width: string; height: string }> = ({ width, height }) => {
  return (
    <motion.div
      className={clsx("rounded bg-gray-300 dark:bg-gray-700 overflow-hidden relative", width, height)}
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 100%)",
        backgroundSize: "200% 100%",
      }}
      animate={{ backgroundPosition: "200% 0" }}
      transition={{
        duration: 2.5, // Slower and smoother shimmer
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    />
  )
}

const contentVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

const BadgeCard: React.FC<StatCardProps> = ({ totalHours, label, className = "", isLoading = false }) => {
  const baseClass =
    "bg-themeBackgroundColor dark:bg-white/[0.05] rounded-xl shadow w-[20vw] gap-1.5 py-4 flex flex-col items-center justify-center border dark:border-white/10 min-w-[150px] max-w-[250px]" // Added min/max width for better responsiveness

  return (
    <motion.div
      className={clsx(baseClass, className)}
      layout // Enables smooth layout transitions for the card itself
      transition={{ type: "spring", stiffness: 300, damping: 30 }} // Smooth transition for size/position changes
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={contentVariants}
            transition={{ duration: 0.3 }} // Fast fade for loading state
            className="flex flex-col items-center justify-center gap-1.5"
          >
            <SkeletonBlock width="w-28" height="h-7" />
            <SkeletonBlock width="w-36" height="h-4" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={contentVariants}
            transition={{ duration: 0.3 }} // Fast fade for content
            className="flex flex-col items-center justify-center gap-1.5"
          >
            <p className="text-2xl sm:text-3xl md:text-xl lg:text-lg xl:text-xl font-semibold text-gray-800 dark:text-white">
              {totalHours}
            </p>
            <p className="text-sm sm:text-base md:text-sm lg:text-xs xl:text-sm text-gray-500 dark:text-white/50 text-center">
              {label}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default BadgeCard
