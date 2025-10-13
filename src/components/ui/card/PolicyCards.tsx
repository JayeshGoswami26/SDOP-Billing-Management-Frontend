"use client";

import type React from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, Eye, Download } from "lucide-react";
import { PolicyCardProps } from "../../../types/EmployeePolicy.types";
import { useTheme } from "../../../context/ThemeContext";
import {
  POLICY_GRADIENTS,
  POLICY_GRADIENTS_DARK,
  POLICY_DESCRIPTIONS,
} from "../../../constant/EmployeePolicy.data";

const PolicyCard: React.FC<PolicyCardProps> = ({ policy, index }) => {
  const { theme } = useTheme();
  const policyURL = import.meta.env.VITE_POLICY_URL;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  };

  const getDescription = () => {
    // If policy has a description, use it
    if (policy.description && policy.description.trim() !== "") {
      return policy.description;
    }

    // Otherwise, use the predefined description from POLICY_DESCRIPTIONS
    return (
      POLICY_DESCRIPTIONS[policy.policyType] ||
      "This policy document outlines important guidelines and procedures that all employees must follow to ensure compliance and maintain a professional work environment."
    );
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fileUrl = `${policyURL}${policy.file}`;
    window.open(fileUrl, "_blank");
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const fileUrl = `${policyURL}${policy.file}`;
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = policy.file;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: open in new tab if download fails
      const fileUrl = `${policyURL}${policy.file}`;
      window.open(fileUrl, "_blank");
    }
  };

  const gradient =
    theme === "light"
      ? POLICY_GRADIENTS[index % POLICY_GRADIENTS.length]
      : POLICY_GRADIENTS_DARK[index % POLICY_GRADIENTS_DARK.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="policy-card h-[320px] lg:h-[280px] xl:h-[320px] flex flex-col rounded-2xl shadow-sm dark:shadow-2xl overflow-hidden cursor-pointer bg-white dark:bg-white/[0.03] border border-transparent dark:border-white/[0.09] hover:border-gray-200 dark:hover:border-gray-500 transition-all duration-300"
    >
      {/* Header with gradient */}
      <div
        className="p-6 lg:p-4 xl:p-6 text-white flex flex-col justify-between min-h-[90px] lg:min-h-[80px] xl:min-h-[90px]"
        style={{ background: gradient }}
      >
        <div className="flex items-center gap-3 lg:gap-2 xl:gap-3">
          <div className="p-2 lg:p-1.5 xl:p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <FileText size={24} className="text-white lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
          </div>
          <div>
            <h3 className="text-lg lg:text-base xl:text-lg font-semibold leading-tight m-0">
              {policy.policyType}
            </h3>
            <p className="text-sm lg:text-xs xl:text-sm opacity-90 font-normal mt-1">
              Version {policy.policyVersion}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 lg:p-4 xl:p-6 flex flex-col flex-1 justify-between">
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3 lg:text-xs lg:mb-4 xl:text-sm xl:mb-6">
          {getDescription()}
        </p>

        <div className="flex gap-2 mb-3 lg:mb-2 xl:mb-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleView}
            className="flex-1 flex items-center justify-center gap-1.5 lg:gap-1 xl:gap-1.5 px-3 py-2 lg:px-2 lg:py-1.5 xl:px-3 xl:py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs lg:text-[10px] xl:text-xs font-medium rounded-lg transition-all duration-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Eye size={14} className="lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5" />
            View
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-1.5 lg:gap-1 xl:gap-1.5 px-3 py-2 lg:px-2 lg:py-1.5 xl:px-3 xl:py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs lg:text-[10px] xl:text-xs font-medium rounded-lg transition-all duration-200 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            <Download size={14} className="lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5" />
            Download
          </motion.button>
        </div>

        <div className="border-t border-gray-200 dark:border-white/[0.09] pt-4 lg:pt-3 xl:pt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 lg:gap-1 xl:gap-1.5 text-xs lg:text-[10px] xl:text-xs text-gray-400 dark:text-gray-500">
            <Calendar size={14} className="lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5" />
            <span>Last updated</span>
          </div>
          <span className="text-xs lg:text-[10px] xl:text-xs font-medium text-gray-600 dark:text-gray-300">
            {formatDate(policy.updatedAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default PolicyCard;
