import * as React from "react";
import Lottie from "lottie-react";
import { cn } from "../lib/utils";
import type { Sponsor } from "../types";
import { WinButtons } from "./win-buttons";

type LottieAnimationData = {
  v?: string;
  fr?: number;
  ip?: number;
  op?: number;
  w?: number;
  h?: number;
  nm?: string;
  ddd?: number;
  assets?: unknown[];
  layers?: unknown[];
  [key: string]: unknown;
};

export interface SponsorDetailProps {
  sponsor: Sponsor;
  onClose?: () => void;
  onClaim?: () => void;
  onSpinAgain?: () => void;
  showCooldown?: boolean;
  className?: string;
}

export const SponsorDetail = React.forwardRef<
  HTMLDivElement,
  SponsorDetailProps
>(({ sponsor, onClose, onClaim, onSpinAgain, showCooldown = false, className, ...props }, ref) => {
  const [giftData, setGiftData] = React.useState<LottieAnimationData | null>(null);
  const lottieRef = React.useRef<any>(null);

  React.useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch("/animations/Gift box.json");
        if (response.ok) {
          const data = await response.json();
          if (data && (data.v || data.layers)) {
            setGiftData(data);
          }
        }
      } catch (error) {
        console.warn("Failed to load animation:", error);
      }
    };

    loadAnimation();
  }, []);

  React.useEffect(() => {
    if (lottieRef.current && lottieRef.current.setSpeed) {
      lottieRef.current.setSpeed(0.65);
    }
  }, [giftData]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full flex flex-col items-center justify-center min-h-screen py-8 px-4",
        className
      )}
      style={{
        background:
          "linear-gradient(136deg, rgba(246, 248, 251, 1) 12%, rgba(255, 207, 178, 1) 100%)",
      }}
      {...props}
    >
      {/* Close button */}
      {/* {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:opacity-80 transition-opacity"
          aria-label="Close"
        >
          <span className="text-2xl sm:text-3xl">×</span>
        </button>
      )} */}

      {/* White Container */}
      <div
        className="relative w-full max-w-[900px] rounded-2xl sm:rounded-3xl md:rounded-[32px] p-6 sm:p-8 md:p-10"
        style={{
          background: "#FFFFFF",
          boxShadow: "0px 4px 33.10px 0px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Sponsor Logo */}
        <div className="flex items-center justify-center mb-4 sm:mb-6 w-full">
          <div className="relative w-72 h-24 sm:w-48 sm:h-32 md:w-56 md:h-40 lg:w-64 lg:h-48">
            <img
              src={sponsor.logo}
             alt={sponsor.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Gift Animation - Lottie */}
        {giftData && (
          <div className="flex items-center justify-center w-full">
            <div className="w-full max-w-[500px] h-64 sm:h-80 md:h-96 lg:h-[28rem] flex items-center justify-center">
              <Lottie
                lottieRef={lottieRef}
                animationData={giftData}
                loop={false}
                autoplay={true}
                className="w-full h-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Win Buttons - outside container */}
      <div className="w-full max-w-[700px] mt-6 sm:mt-8">
        <WinButtons onClaim={onClaim} onSpinAgain={onSpinAgain} showCooldown={showCooldown} />
      </div>
    </div>
  );
});
SponsorDetail.displayName = "SponsorDetail";
