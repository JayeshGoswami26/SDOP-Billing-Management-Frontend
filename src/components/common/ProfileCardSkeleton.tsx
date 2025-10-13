import type React from "react";
import Card from "../ui/card/Card";

const ProfileCardSkeleton: React.FC = () => {
  return (
    <Card className="bg-gradient-to-r from-themeGradientColorFrom to-themeGradientColorTo border-none p-8 relative">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-8 bg-white/20 rounded-lg w-48 mb-2 animate-pulse"></div>
          <div className="h-5 bg-white/20 rounded-lg w-64 mb-8 animate-pulse"></div>

          <div className="absolute -translate-1/2 top-[20px] md:top-[20px] lg:top-0 right-[-15%] sm:right-[20%] md:right-[20%] lg:right-[3rem]">
            <div className=" w-[100px] h-[100px]  md:w-[150px] md:h-[150px] lg:w-[150px] lg:h-[150px] rounded-full bg-white/60 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full animate-pulse"></div>
                <div>
                  <div className="h-4 bg-white/20 rounded w-24 mb-1 animate-pulse"></div>
                  <div className="h-5 bg-white/20 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCardSkeleton;
