import type React from "react"
import clsx from "clsx"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "error"
  className?: string
}

const BadgeCard: React.FC<BadgeProps> = ({ children, variant = "default", className }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-500 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
  }

  return (
    <span
      className={clsx(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

export default BadgeCard
