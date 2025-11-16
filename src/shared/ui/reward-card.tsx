import * as React from "react";
import { cn } from "../lib/utils";

export interface RewardCardProps {
  sponsorName: string;
  reward: string;
  logoUrl?: string;
  logoAlt?: string;
  className?: string;
}

const RewardCard = React.forwardRef<HTMLDivElement, RewardCardProps>(
  ({ sponsorName, reward, logoUrl, logoAlt, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-lg sm:rounded-xl md:rounded-[14.68px] bg-white w-full h-auto min-h-[100px] sm:min-h-[120px] md:min-h-[140px] lg:min-h-[160px] flex flex-col items-center justify-start pt-2 sm:pt-2 md:pt-3 lg:pt-3 shadow-sm sm:shadow-md",
          className
        )}
        {...props}
      >
        {logoUrl && (
          <div className="relative w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[70px] md:h-[70px] lg:w-[80px] lg:h-[80px] mb-1 sm:mb-1.5 md:mb-2 flex-shrink-0">
            <img
              src={logoUrl}
              alt={logoAlt || sponsorName}
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-[#163446] text-center leading-[1.36] mt-auto mb-0.5 sm:mb-1 md:mb-1 px-1 sm:px-2">
          {sponsorName}
        </h3>
        <p className="text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold text-[#163446] text-center leading-[1.36] mb-1.5 sm:mb-2 md:mb-2.5 px-1 sm:px-2">
          {reward}
        </p>
      </div>
    );
  }
);
RewardCard.displayName = "RewardCard";

export { RewardCard };

