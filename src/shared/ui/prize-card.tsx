import * as React from "react";
import { cn } from "../lib/utils";
import type { Sponsor } from "../types";

export interface PrizeCardProps {
  sponsor: Sponsor;
  isHighlighted?: boolean;
  showGiftIcon?: boolean;
  className?: string;
}

const MedalIcon = React.memo(() => (
  <svg
    width="81"
    height="85"
    viewBox="0 0 81 85"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
  >
    <path
      d="M58.4833 28.7832L40.425 37.8582L22.3667 28.7832L0 73.4249L13.9333 72.0499L21.0833 84.0582L40.425 45.5582L59.7667 84.0582L66.9167 72.0499L80.85 73.4249L58.4833 28.7832Z"
      fill="#0D91DB"
    />
    <path
      d="M40.425 59.0333C56.7266 59.0333 69.9417 45.8183 69.9417 29.5167C69.9417 13.2151 56.7266 0 40.425 0C24.1234 0 10.9083 13.2151 10.9083 29.5167C10.9083 45.8183 24.1234 59.0333 40.425 59.0333Z"
      fill="#FFC54D"
    />
    <path
      d="M40.4249 52.7085C53.2333 52.7085 63.6166 42.3253 63.6166 29.5169C63.6166 16.7085 53.2333 6.3252 40.4249 6.3252C27.6165 6.3252 17.2333 16.7085 17.2333 29.5169C17.2333 42.3253 27.6165 52.7085 40.4249 52.7085Z"
      fill="#E8B04B"
    />
    <path
      d="M41.525 15.583L45.375 23.283C45.5583 23.6497 45.925 23.9247 46.2916 24.0163L54.8166 25.2997C55.825 25.483 56.2833 26.6747 55.55 27.408L49.4083 33.458C49.1333 33.733 48.95 34.1913 49.0417 34.558L50.5083 43.083C50.6916 44.0913 49.5916 44.9163 48.675 44.3663L41.0666 40.333C40.7 40.1497 40.2416 40.1497 39.875 40.333L32.175 44.3663C31.2583 44.8247 30.1583 44.0913 30.3416 43.083L31.8083 34.558C31.9 34.1913 31.7166 33.733 31.4416 33.458L25.3 27.408C24.5666 26.6747 24.9333 25.3913 26.0333 25.2997L34.5583 24.0163C34.925 23.9247 35.2916 23.7413 35.475 23.283L39.325 15.583C39.7833 14.6663 41.0666 14.6663 41.525 15.583Z"
      fill="white"
    />
  </svg>
));
MedalIcon.displayName = "MedalIcon";

export const PrizeCard = React.forwardRef<HTMLDivElement, PrizeCardProps>(
  (
    {
      sponsor,
      isHighlighted = false,
      showGiftIcon = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full h-[140px] sm:h-[180px] md:h-[220px] lg:h-[280px] xl:h-[340px] 2xl:h-[403px] rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[22.88px] overflow-hidden shadow-lg",
          className
        )}
        style={{
          background: isHighlighted
            ? "linear-gradient(180deg, rgba(63, 210, 161, 1) 0%, rgba(68, 209, 248, 1) 100%)"
            : "#F9FAFC",
          border: "2px solid #111D21",
        }}
        {...props}
      >
        <div className="w-full h-full flex flex-col items-center justify-center p-1.5 sm:p-2.5 md:p-3 lg:p-4">
          {/* Medal Icon - smaller, centered above sponsor logo */}
          {showGiftIcon && (
            <div className="relative w-[20px] h-[20px] sm:w-[25px] sm:h-[25px] md:w-[30px] md:h-[30px] lg:w-[35px] lg:h-[35px] xl:w-[40px] xl:h-[40px] 2xl:w-[45px] 2xl:h-[45px] mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-8 2xl:mb-10 flex items-center justify-center">
              <MedalIcon />
            </div>
          )}

          {/* Sponsor Logo - larger */}
          <div
            className={cn(
              "relative",
              sponsor.name === "Disney"
                ? "w-[75px] h-[30px] sm:w-[105px] sm:h-[41px] md:w-[135px] md:h-[53px] lg:w-[180px] lg:h-[68px] xl:w-[210px] xl:h-[83px] 2xl:w-[255px] 2xl:h-[98px]"
                : "w-[100px] h-[40px] sm:w-[140px] sm:h-[55px] md:w-[180px] md:h-[70px] lg:w-[240px] lg:h-[90px] xl:w-[280px] xl:h-[110px] 2xl:w-[340px] 2xl:h-[130px]"
            )}
          >
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    );
  }
);
PrizeCard.displayName = "PrizeCard";
