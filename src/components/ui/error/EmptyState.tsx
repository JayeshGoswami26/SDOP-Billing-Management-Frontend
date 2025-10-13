import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon  } from 'lucide-react';
import clsx from 'clsx';

interface EmptyStateProps {
  icon?: typeof DivideIcon;
  imageUrl?: string; // NEW: image url prop
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  error?: boolean;
  imageClassName?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  imageUrl, // NEW
  title,
  description,
  action,
  size = 'md',
  className = '',
  error = false,
  imageClassName = '',
}) => {
  const sizeClasses = {
    sm: {
      container: 'py-4', // reduced padding
      iconSize: 'w-10 h-10',
      title: 'text-lg',
      description: 'text-sm',
    },
    md: {
      container: 'py-6', // reduced padding
      iconSize: 'w-14 h-14',
      title: 'text-xl',
      description: 'text-base',
    },
    lg: {
      container: 'py-0', // reduced padding
      iconSize: 'w-[15vw] h-[15vw]',
      title: 'text-2xl',
      description: 'text-lg',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`text-center flex flex-col items-center justify-center gap-4 ${currentSize.container} ${className}`}
    >
      {/* Image or Icon */}
      {imageUrl ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="flex justify-center items-center">
            <img
              src={imageUrl}
              alt="empty state"
              className={clsx(`object-contain w-full h-full md:w-[20vw] md:h-[20vw]`,imageClassName)}
              style={{ minWidth: 48, minHeight: 48 }}
              draggable={false}
            />
          </div>
        </motion.div>
      ) : Icon ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="flex justify-center items-center">
            <Icon className={`text-indigo-500 ${currentSize.iconSize}`} />
          </div>
        </motion.div>
      ) : null}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-2 max-w-md mx-auto"
      >
        <h3 className={`font-semibold  ${currentSize.title} ${error ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{title}</h3>
        {description && (
          <p className={` leading-relaxed ${currentSize.description} ${error ? 'text-red-500 dark:text-red-400' : 'text-gray-500'}`}>{description}</p>
        )}
      </motion.div>

      {/* Action Button */}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-2"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm
              ${action.variant === 'secondary' 
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
              }
              ${size === 'sm' ? 'text-sm px-3 py-1.5' : size === 'lg' ? 'text-lg px-6 py-3' : 'text-base px-4 py-2'}
            `}
          >
            {action.label}
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;