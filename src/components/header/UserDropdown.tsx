/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../../utils/auth";
import { BadgeAlert, LogOut, Settings, UserCog } from "lucide-react";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();


  const currentUser = useSelector((state: any) => state.auth.user);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function handleSignOut() {
    clearAuth()
    navigate("/login");
  }
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        {/* <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img src="/images/user/owner.jpg" alt="User" />
        </span> */}

        <div className="mr-[8px] font-medium text-theme-sm flex flex-col justify-center items-center gap-0">
          <span className="text-gray-500 dark:text-white text-[12px] "  > {currentUser?.name || "User Name"} </span>
          <span className="text-gray-400 text-[12px] -mt-2 " > {currentUser?.email || 'user@example.com'} </span>
        </div>
        <span className="bg-themeBlueLight dark:bg-themeBlue/50 rounded-full p-1 flex justify-center items-center" >
          <svg
            className={`stroke-themeBlue dark:stroke-themeBlue transition-transform duration-200 ${isOpen ? "rotate-180" : ""
              }`}
            width="18"
            height="20"
            viewBox="0 0 18 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute -right-[0px] sm:right-0 md:right-0 mt-[30px] flex w-[260px] flex-col rounded-2xl border border-gray-200 dark:border-white/10 p-3 shadow-theme-lg dark:shadow-inner backdrop-blur-md dark:backdrop-blur-lg bg-white/30 dark:bg-white/10 z-50"
          >
            <Dropdown
              isOpen={true}
              onClose={closeDropdown}
              className="contents"
            >
              <div>
                <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
                  {currentUser?.name || "User Name"}
                </span>
                <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
                  {currentUser?.email || "user@example.com"}
                </span>
              </div>

              <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">

                
              </ul>
              <div
                onClick={handleSignOut}
                className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                <LogOut size={20} />
                Sign out
              </div>
            </Dropdown>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
