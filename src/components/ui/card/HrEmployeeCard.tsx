import React from "react";
import { MoreVertical, Phone, Mail, Calendar, IndianRupee } from "lucide-react";
import { HR_EMPLOYEE_CARDS_TYPE } from "../../../types/HrEmployee.type";
import { Link } from "react-router-dom";

interface HrEmployeeCardProps {
  employee: HR_EMPLOYEE_CARDS_TYPE;
  onMenuClick?: (employee: HR_EMPLOYEE_CARDS_TYPE) => void;
}

const HrEmployeeCard: React.FC<HrEmployeeCardProps> = ({
  employee,
  onMenuClick,
}) => {
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-");
    } catch {
      return dateString;
    }
  };

  const IMAGE_URL = import.meta.env.VITE_IMAGE_URL

  const formatSalary = (salary: number): string => {
    return new Intl.NumberFormat("en-US").format(salary);
  };

  const handleCardClick = () => {
    if (employee.onClick) {
      employee.onClick();
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMenuClick) {
      onMenuClick(employee);
    }
  };

  const truncate = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div
      className="bg-white  dark:bg-themeBackgroundColorDark rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow duration-200 cursor-pointer w-full max-w-[80vw] sm:max-w-full "
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleCardClick();
        }
      }}
      aria-label={`Employee card for ${employee.name}`}
    >
      {/* Header Section */}
      <div className="flex relative items-start justify-between mb-6">
        <div className="flex items-center fle xl:flex-row space-x-1 lg:space-x-2 xl:space-x-4">
          <div className="relative w-14 h-14 lg:w-[4vw] lg:h-[4vw]">
            <img
              src={`${IMAGE_URL}/${employee.image}`}
              alt={`${employee.name} profile`}
              className=" w-full h-full rounded-full object-cover bg-gray-200 dark:bg-gray-700"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "images/user/UserSVG.svg";
              }}
            />
          </div>
          <div className="">
            <h3 className="text-sm   lg:text-[1.2vw] 2xl:text-[1.1vw] font-semibold text-gray-900 dark:text-white mb-1">
              {employee.name}
            </h3>
            <div className="space-y-1">
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs   lg:text-[0.8vw]">
                {/* <Phone className="w-3 h-3 mr-1" /> */}
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs lg:text-[0.8vw] 2xl:text-[0.5vw]">
                {/* <Mail className="w-3 h-3 mr-1" /> */}
                <span className="truncate">{truncate(employee.email, 20)}</span>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handleMenuClick}
          className="p-1 hover:bg-gray-100 absolute top-0 right-0 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4 lg:w-5 lg:text-[0.8vw] text-gray-500 dark:text-gray-300" />
        </button>
      </div>

      {/* Department and Designation */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className=" text-xs  lg:text-[0.8vw] text-gray-500 dark:text-gray-400 mb-1">
            Department
          </p>
          <p className="font-medium  text-xs lg:text-[0.8vw] text-gray-900 dark:text-white">
            {employee.department}
          </p>
        </div>
        <div>
          <p className=" text-xs  lg:text-[0.8vw] text-gray-500 dark:text-gray-400 mb-1">
            Designation
          </p>
          <p className="font-medium  text-xs lg:text-[0.8vw] text-gray-900 dark:text-white">
            {employee.designation}
          </p>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-xs  lg:text-[0.8vw] text-gray-500 dark:text-gray-400 mb-1">
            Date of Joining
          </p>
          <p className="font-medium text-xs lg:text-[0.8vw] text-gray-900 dark:text-white flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(employee.joiningDate)}
          </p>
        </div>
        <div>
          <p className="text-xs  lg:text-[0.8vw] text-gray-500 dark:text-gray-400 mb-1">
            Date of Last Increment
          </p>
          <p className="font-medium text-xs lg:text-[0.8vw]  text-gray-900 dark:text-white flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(employee.dateofLastIncrement)}
          </p>
        </div>
      </div>

      {/* Current Salary */}
      <div className="text-center mb-6">
        <p className="text-xs  lg:text-[0.8vw] text-gray-500 dark:text-gray-400 mb-1">
          Current Salary
        </p>
        <p className="text-xs lg:text-[0.8vw] font-bold text-gray-900 dark:text-white flex items-center justify-center">
          <IndianRupee className="w-5 h-5 mr-1 lg:w-[0.8vw] lg:h-[0.8vw]" />
          {formatSalary(employee.currentSalary)}
        </p>
      </div>

      {/* View Details Button */}
      <Link to={`/hr-employee/${employee.id}`}>
        <button
          className="w-full text-sm lg:text-[0.8vw] bg-blue-100 dark:bg-gray-500 text-themeBlue dark:text-white font-medium py-3 px-4  rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-themeBlue focus:ring-offset-2"
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
        >
          View Details
        </button>
      </Link>
    </div>
  );
};

export default HrEmployeeCard;
