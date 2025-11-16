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
  className?: string;
}

export const SponsorDetail = React.forwardRef<
  HTMLDivElement,
  SponsorDetailProps
>(({ sponsor, onClose, onClaim, onSpinAgain, className, ...props }, ref) => {
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
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:opacity-80 transition-opacity"
          aria-label="Close"
        >
          <span className="text-2xl sm:text-3xl">×</span>
        </button>
      )}

      {/* White Container - according to Figma */}
      <div
        className="relative w-full max-w-[975px] mx-auto rounded-[41px] p-6 sm:p-8 md:p-10 lg:p-12"
        style={{
          background: "#FFFFFF",
          boxShadow: "0px 4px 33.10px 0px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* YOU WON! Title - according to Figma */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[117.62px] font-heading text-[#0A5980] leading-[1.4] text-center mb-6 sm:mb-8 md:mb-10">
          YOU WON!
        </h1>

        {/* Congratulations Text - according to Figma */}
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[55.81px] font-body-semibold text-black text-center leading-[1.362] mb-8 sm:mb-10 md:mb-12 px-4">
          Congratulations - You&apos;ve{" "}
          <span className="font-bold">
            won a Gift Card of {sponsor.name} {sponsor.reward}
          </span>
        </p>

        {/* Sponsor Logo above gift */}
        <div className="flex items-center justify-center mb-4 sm:mb-6 w-full">
          <div className="relative w-[200px] h-[60px] sm:w-[250px] sm:h-[75px] md:w-[300px] md:h-[90px] lg:w-[368px] lg:h-[115px]">
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
                <div className="w-full max-w-[655px] h-[400px] sm:h-[500px] md:h-[600px] lg:h-[636px] flex items-center justify-center">
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
      <div className="w-full max-w-[720px] mx-auto mt-6 sm:mt-8 md:mt-10">
        <WinButtons onClaim={onClaim} onSpinAgain={onSpinAgain} />
      </div>
    </div>
  );
});
SponsorDetail.displayName = "SponsorDetail";
