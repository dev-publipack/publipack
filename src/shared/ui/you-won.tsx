import * as React from "react";
import { cn } from "../lib/utils";
import { BrandLinkAnimation } from "./brand-link-animation";
import { SponsorDetail } from "./sponsor-detail";
import type { Sponsor } from "../types";

export interface YouWonProps {
  winner: Sponsor;
  onClaim?: () => void;
  onSpinAgain?: () => void;
  brandLink?: string;
  showCooldown?: boolean;
  className?: string;
}

const YouWon = React.forwardRef<HTMLDivElement, YouWonProps>(
  ({ winner, onClaim, onSpinAgain, brandLink, showCooldown = false, className, ...props }, ref) => {
    const [showSponsorDetail, setShowSponsorDetail] = React.useState(false);

    // Auto-transition to SponsorDetail after 3 seconds
    React.useEffect(() => {
      const timer = setTimeout(() => {
        setShowSponsorDetail(true);
      }, 3000);

      return () => clearTimeout(timer);
    }, []);

    const handleGiftClick = () => {
      setShowSponsorDetail(true);
    };

    const handleCloseDetail = () => {
      setShowSponsorDetail(false);
    };

    if (showSponsorDetail) {
      return (
        <SponsorDetail
          sponsor={winner}
          onClose={handleCloseDetail}
          onClaim={onClaim}
          onSpinAgain={onSpinAgain}
          showCooldown={showCooldown}
        />
      );
    }
    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full flex flex-col items-center justify-center min-h-full pb-10",
          className
        )}
        {...props}
      >
        {/* Confetti Animation Background */}
        {/* <ConfettiBackground /> */}

        {/* Brand Link at top */}
        <div className="mb-4 sm:mb-6 flex flex-col items-center">
          <BrandLinkAnimation brandLink={brandLink} onClick={handleGiftClick} />
        </div>

        {/* YOU WON! Title */}
        <h1 className="mb-6 sm:mb-8 md:mb-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading text-[#163446] leading-[1.14] text-center">
          YOU WON!
        </h1>

        {/* Main Container */}
        <div
          className="relative z-10 w-full max-w-[900px] rounded-2xl sm:rounded-3xl md:rounded-[29px] p-4 sm:p-5 md:p-6 lg:p-8"
          style={{
            background:
              "linear-gradient(134deg, rgba(11, 141, 217, 1) 15%, rgba(45, 195, 248, 1) 100%)",
            boxShadow: "0px 4.24px 35.10px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Winning Slots - Show 5 identical slots in a row */}
          <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center items-center mb-4 sm:mb-6 md:mb-8 flex-wrap">
            {[0, 1, 2, 3, 4].map((slotIndex) => (
              <div
                key={slotIndex}
                className="relative w-full max-w-[150px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[220px] xl:max-w-[240px] h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] xl:h-[200px] overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[22.88px]"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(63, 210, 161, 1) 0%, rgba(68, 209, 248, 1) 100%)",
                  border: "3.52px solid #111D21",
                }}
              >
                {/* Winner Sponsor Logo */}
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center p-2 sm:p-3">
                  <div
                    className={cn(
                      "relative",
                      winner.name === "Disney"
                        ? "w-[60px] h-[18px] sm:w-[75px] sm:h-[22px] md:w-[90px] md:h-[26px] lg:w-[105px] lg:h-[30px] xl:w-[120px] xl:h-[34px]"
                        : "w-[80px] h-[24px] sm:w-[100px] sm:h-[30px] md:w-[120px] md:h-[35px] lg:w-[140px] lg:h-[40px] xl:w-[160px] xl:h-[45px]"
                    )}
                  >
                    <img
                      src={winner.logo}
                      alt={winner.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Congratulations Text - below container */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-[85%] font-body-semibold text-black text-center leading-[1.362] px-4 sm:px-6 mt-6 sm:mt-8 md:mt-10">
          Congratulations - You&apos;ve{" "}
          <span className="text-black font-bold">
            won {winner.name} {winner.reward}
          </span>
        </p>
      </div>
    );
  }
);
YouWon.displayName = "YouWon";

export { YouWon };
