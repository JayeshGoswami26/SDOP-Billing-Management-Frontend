// components/ui/badge/StatusBadge.tsx
import React from "react";

type Status = "primary" | "info" | "success" | "error" | "warning";

interface StatusBadgeProps {
  label ?: string;
  status?: Status;
}

const statusClasses: Record<Status, string> = {
  primary: "bg-brand-100 text-brand-700",
  info: "bg-blue-100 text-blue-800",
  success: "bg-green-100 text-green-700",
  error: "bg-red-100 text-red-700",
  warning: "bg-yellow-100 text-yellow-800",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  status = "info",
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status]}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
