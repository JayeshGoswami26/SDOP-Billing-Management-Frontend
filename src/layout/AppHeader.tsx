import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";
import CheckInButton from "../components/header/CheckInButton";

import { useSelector } from "react-redux";


// const iconVariants = {
//   initial: { opacity: 0, scale: 0.8, rotate: -90 },
//   animate: { opacity: 1, scale: 1, rotate: 0 },
//   exit: { opacity: 0, scale: 0.8, rotate: 90 },
// };

const AppHeader: React.FC = () => {

  const currentUser = useSelector((state: any) => state.auth.user);


  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-themeBackgroundColor border-themeBorderColor z-99999 dark:border-gray-500 dark:bg-black lg:border-b-1 ">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-themeBorderColor dark:border-gray-500 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          {/* Side Button */}

          <AnimatePresence>
            <div className="flex items-center lg:hidden scale-50">
              <div className="">
                <div id="menuToggle" className="lg:hidden">
                  <input
                    id="checkbox"
                    type="checkbox"
                    onChange={handleToggle}
                    checked={isMobileOpen}
                    readOnly
                  />
                  <label className="toggle" htmlFor="checkbox">
                    <div className="bar bg-themeDisableIconColor dark:bg-white bar--top"></div>
                    <div className="bar bg-themeDisableIconColor dark:bg-white bar--middle"></div>
                    <div className="bar bg-themeDisableIconColor dark:bg-white bar--bottom"></div>
                  </label>
                </div>
              </div>


              {/* <div className="">
                <img
                  className="w-8 h-8"
                  src={`/public/images/logo/CSL-Monogram.svg`}
                  alt=""
                />
              </div> */}
            </div>
          </AnimatePresence>

          <div className="">
            <h1 className="text-black dark:text-white"> {currentUser?.role || 'User'} Dashboard</h1>
          </div>

          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z"
                fill="currentColor"
              />
            </svg>
          </button>

        </div>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={`${isApplicationMenuOpen ? "flex flex-wrap sm:flex-nowrap" : "hidden"
              } items-center justify-center w-full gap-2 md:gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
          >
            <div className="flex flex-wrap sm:flex-nowrap items-center 2xsm:gap-3">

              {/* <!-- Dark Mode Toggler --> */}
              {/* <ThemeToggleButton /> */}
            </div>
            {/* <!-- User Area --> */}
            <UserDropdown />
          </motion.div>
        </AnimatePresence>
      </div>
    </header>
  );
};

export default AppHeader;
