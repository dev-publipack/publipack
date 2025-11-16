import * as React from "react";
import { cn } from "../lib/utils";
import { PrizeCard } from "./prize-card";
import { BrandLinkAnimation } from "./brand-link-animation";
import { SponsorDetail } from "./sponsor-detail";
import type { Sponsor } from "../types";

export interface YouWonProps {
  winner: Sponsor;
  onClaim?: () => void;
  onSpinAgain?: () => void;
  brandLink?: string;
  className?: string;
}

const YouWon = React.forwardRef<HTMLDivElement, YouWonProps>(
  ({ winner, onClaim, onSpinAgain, brandLink, className, ...props }, ref) => {
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
          {/* Trophy Animation */}
          <div className="flex flex-col items-center mb-4 sm:mb-6 md:mb-8"></div>

          {/* Prize Cards - Show 3 green cards in a row when winning */}
          <div className="flex flex-row gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3 justify-center items-start mb-4 sm:mb-6 md:mb-8 w-full px-1 sm:px-2">
            {[0, 1, 2].map((index) => (
              <PrizeCard
                key={index}
                sponsor={winner}
                isHighlighted={true}
                showGiftIcon={true}
                className="flex-1 min-w-0 basis-0"
              />
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
