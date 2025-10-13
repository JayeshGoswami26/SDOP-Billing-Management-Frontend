import React, { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
// import { AddressModel } from "../../EmployeeProfile/EmployeModels/Address.Model";

export interface TableHeaderProps {
  // Header content
  title?: string | React.ReactNode;
  actionButton?: React.ReactNode;

  // Styling
  className?: string;

  // Animation
  animate?: boolean;

  // Layout options
  showBorder?: boolean;
  showShadow?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  isButton?: boolean;
  onClick: () => void;
  id?: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  title,
  actionButton,
  className,
  animate = true,
  showBorder = true,
  showShadow = true,
  padding = "md",
  isButton,
  onClick,
  id,
}) => {
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-6",
  };

  const CardWrapper = animate ? motion.div : "div";
  const cardProps = animate
    ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.2 },
      }
    : {};

  // Local state for AddressPopup
  const [showAddressPopup, setShowAddressPopup] = useState(false);

  const handleAddClick = () => {
    onClick();
    if (id === "address") {
      setShowAddressPopup(true);
    }
  };

  return (
    <CardWrapper
      {...cardProps}
      className={clsx(
        "bg-white dark:bg-black rounded-2xl",
        showBorder && "border dark:border-gray-800",
        showShadow && "shadow-md",
        paddingClasses[padding],
        className
      )}
    >
      {/* Header Section */}
      {(title || actionButton) && (
        <div className="flex items-center justify-between pb-5 border-b border-gray-200 dark:border-gray-900">
          {title &&
            (typeof title === "string" ? (
              <h1 className="capitalize text-base font-medium text-gray-600 dark:text-white/90">
                {title}
              </h1>
            ) : (
              title
            ))}
          <span
            onClick={handleAddClick}
          >
            {actionButton && actionButton}
          </span>
        </div>
      )}

      {/* Show AddressPopup only for address tab and when Add is clicked */}
      {/* {id === "address" && showAddressPopup && (
        <AddressModel
          onClose={() => setShowAddressPopup(false)}
          modalData={{ type: "Permanent Address", address: "" }}
          isOpen={showAddressPopup}
        />
      )} */}
    </CardWrapper>
  );
};

export default TableHeader;
