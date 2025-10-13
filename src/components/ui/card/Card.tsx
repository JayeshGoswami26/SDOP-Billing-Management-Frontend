import React from "react";
import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        "rounded-3xl border  p-6 shadow-sm   dark:text-white border-gray-200 dark:border-white/10",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
