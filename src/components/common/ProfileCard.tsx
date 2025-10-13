/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { motion } from "framer-motion";
import { LogIn, LogOut, Coffee, User } from "lucide-react";
import Card from "../ui/card/Card";
import { ProfileCardProps } from "../../types/common/ProfileCardProps";
import { useState } from "react";
import { useSelector } from "react-redux";

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  shiftTime,
  profileImage,
  punchInTime,
  punchOutTime,
  breakTime,
}) => {

  const [imageError, setImageError] = useState(false);
  const currentUser = useSelector((state: any) => state.auth.user);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative rounded-3xl bg-gradient-to-r from-themeGradientColorFrom to-themeGradientColorTo text-white border-none p-8 flex-1 min-h-[230px]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2">Hi, {name || "User Name"}</h2>
            <p className="text-lg text-purple-100 mb-8">
              My Shift : {shiftTime}
            </p>

            <div className="absolute -translate-1/2 top-[20px] md:top-[20px] lg:top-0 right-[-15%] sm:right-[20%] md:right-[20%] lg:right-[3rem]">
              <div className={`w-[100px] h-[100px]  md:w-[150px] md:h-[150px] lg:w-[150px] lg:h-[150px] rounded-full overflow-hidden border-[0.6rem] border-themeBackgroundColor dark:border-black ${imageError ? "bg-white dark:bg-[#242424] p-5 flex items-center justify-center" : ""}`}>
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "images/user/UserSVG.svg";
                      setImageError(true);
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-white flex items-center justify-center">
                    <User className="w-16 h-16 text-[#413b8c]" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {/* Punch In */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <LogIn className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-purple-100">Punch In Time</p>
                  <p className="font-semibold">{punchInTime}</p>
                </div>
              </div>

              {/* Punch Out */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <LogOut className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-purple-100">Punch Out Time</p>
                  <p className="font-semibold">{punchOutTime}</p>
                </div>
              </div>

              {/* Break */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Coffee className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-purple-100">Punch Break Time</p>
                  <p className="font-semibold">{breakTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProfileCard;
