import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean; // New prop to control close button visibility
  isFullscreen?: boolean; // Default to false for backwards compatibility
  error?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true, // Default to true for backwards compatibility
  isFullscreen = false,
  error
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

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
    ? "w-full h-full relative rounded-3xl bg-white/50  dark:bg-white/[0.09] shadow-xl rounded-3xl backdrop-blur-[32px] dark:backdrop-blur-[32px]"
    : "relative w-full max-w-3xl rounded-3xl bg-white/50  dark:bg-white/[0.09] shadow-xl rounded-3xl";

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999 ">
          {!isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-white/[0.03] dark:bg-white/[0.03] backdrop-blur-[32px] dark:backdrop-blur-[32px]"
              onClick={onClose}
            ></motion.div>
          )}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`${contentClasses}  ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {showCloseButton && (
              <motion.button
                whileHover={{ rotate: 90, scale: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-themeBackgroundColor/80 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-themeBackgroundColorDark/20 dark:text-white dark:hover:bg-themeBackgroundColorDark/50 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
            {/* {error && (
              <div className="absolute -translate-x-1/2 -translate-y-1/2 -top-20 left-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm mt-2">
                <strong className="font-semibold">Error:</strong> {error}
              </div>
            )} */}
            <div>{children}</div>
          </motion.div>
        </div>
      </AnimatePresence>
    </>
  );
};
