import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

import { Vortex } from "../../components/ui/vortex/vortex";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative bg-themeBackgroundColor z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}

        {/* Right Section */}

        <div className="items-center hidden w-full h-full lg:w-1/2 bg-black dark:bg-white/5 lg:grid relative overflow-hidden">
          <Vortex
          rangeY={400}
          backgroundColor="#000000"
          className="flex items-center flex-col justify-center px-2 md:px-10 py-4 h-full"
          >
            <div className=" flex items-center justify-center z-1">
              <div className="flex flex-col items-center max-w-lg">
                <div className="mb-4 flex flex-col items-center gap-4 justify-center">
                  {/* <img
                    width={100}
                    height={48}
                    src="images/logo/Logo5.png"
                    alt="Logo"
                  /> */}
                  <img
                    width={350}
                    height={48}
                      src="images/logo/Logo5.png"
                    alt="Logo"
                  />
                </div>
                {/* <p className="text-center text-4xl text-white dark:text-white">
                  Carina Softlabs | HRMS
                </p> */}
              </div>
            </div>
          </Vortex>
        </div>

        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>

        {/* Right Section */}
      </div>
    </div>
  );
}
