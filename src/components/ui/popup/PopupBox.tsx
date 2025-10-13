import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean; // New prop to control close button visibility
  isFullscreen?: boolean; // Default to false for backwards compatibility
  title?: string;
}

const PopupBox = ({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true, // Default to true for backwards compatibility
  isFullscreen = false,
  title,
}: AddDocumentModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const contentClasses = isFullscreen
    ? "w-full h-full"
    : "relative w-full rounded-3xl bg-white/50 dark:bg-white/[0.09] shadow-xl backdrop-blur-xl";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center overflow-y-auto z-[99999]">
        {!isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 h-full w-full bg-white/[0.03] dark:bg-white/[0.03] backdrop-blur-[32px]"
            onClick={onClose}
          ></motion.div>
        )}

        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`${contentClasses}${className ? ` ${className}` : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mx-6 py-3 border-b border-gray-200">
            <h2 className="text-3xl font-medium text-gray-700 dark:text-gray-100">
              {title || "Add"}
            </h2>
            {showCloseButton && (
              <motion.button
                whileHover={{ rotate: 30, scale: 1.1 }}
                whileTap={{ scale: 0.95, rotate: -90 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={onClose}
                className="z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 border-gray-400 text-gray-600 border-2 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <X className="h-6 w-6" />
              </motion.button>
            )}
          </div>

          <div>
            {isLoading ? (
              children
            ) : (
              <div className="p-6 space-y-4 animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PopupBox;
