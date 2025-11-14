import * as React from "react";
import { cn } from "../lib/utils";
import type { Sponsor } from "../types";

export interface SlotMachineProps {
  sponsors: Sponsor[];
  onComplete?: (result: { winner: Sponsor | null; isWin: boolean }) => void;
  onReset?: () => void;
  className?: string;
}

export interface SlotMachineRef {
  startSpin: () => void;
}

const SlotMachine = React.forwardRef<SlotMachineRef, SlotMachineProps>(
  ({ sponsors, onComplete, className, ...props }, ref) => {
    const [isSpinning, setIsSpinning] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [isComplete, setIsComplete] = React.useState(false);
    const [isWin, setIsWin] = React.useState(false);

    const spinRefs = [
      React.useRef<HTMLDivElement>(null),
      React.useRef<HTMLDivElement>(null),
      React.useRef<HTMLDivElement>(null),
    ];

    const startSpin = React.useCallback(() => {
      if (isSpinning || sponsors.length === 0) return;

      setIsSpinning(true);
      setIsComplete(false);
      setIsWin(false);
      setProgress(0);

      // Reset all slots to initial position
      spinRefs.forEach((slotRef) => {
        if (slotRef.current) {
          slotRef.current.style.transition = "none";
          slotRef.current.style.transform = "translateY(0)";
        }
      });

      void document.body.offsetHeight;

      // Select random winners
      const winners: [number, number, number] = [
        Math.floor(Math.random() * sponsors.length),
        Math.floor(Math.random() * sponsors.length),
        Math.floor(Math.random() * sponsors.length),
      ];

      const winResult = true;
      // winners.every((w) => w === winners[0]);
      setIsWin(winResult);

      const SPIN_DURATION = 3000;
      const RESULT_DISPLAY_DURATION = 1500;
      // Get card height based on viewport - matches the responsive heights in the render
      const getCardHeight = () => {
        if (typeof window === "undefined") return 450;
        const width = window.innerWidth;
        if (width >= 1280) return 450;
        if (width >= 1024) return 400;
        if (width >= 768) return 360;
        if (width >= 640) return 320;
        return 280;
      };
      const CARD_HEIGHT = getCardHeight();
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progressPercent = Math.min((elapsed / SPIN_DURATION) * 100, 100);
        setProgress(progressPercent);

        if (elapsed < SPIN_DURATION) {
          requestAnimationFrame(animate);
        } else {
          // Spin complete, show result
          setIsSpinning(false);
          setProgress(100);

          setTimeout(() => {
            setIsComplete(true);

            if (onComplete) {
              setTimeout(() => {
                onComplete({
                  winner: winResult ? sponsors[winners[1]] : null,
                  isWin: winResult,
                });
              }, 500);
            }
          }, RESULT_DISPLAY_DURATION);
        }
      };

      // Animate each slot
      spinRefs.forEach((slotRef, index) => {
        if (slotRef.current) {
          const targetIndex = winners[index];
          const minFullRotations = 7;
          const totalSpins = minFullRotations * sponsors.length + targetIndex;
          const targetPosition = -(totalSpins * CARD_HEIGHT);

          setTimeout(() => {
            if (slotRef.current) {
              slotRef.current.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
              slotRef.current.style.transform = `translateY(${targetPosition}px)`;
            }
          }, 10);
        }
      });

      requestAnimationFrame(animate);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSpinning, sponsors, onComplete]);

    React.useImperativeHandle(ref, () => ({
      startSpin,
    }));

    // Auto-start spin on mount
    React.useEffect(() => {
      const timer = setTimeout(startSpin, 500);
      return () => clearTimeout(timer);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Create extended sponsor list for seamless scrolling
    const MIN_COPIES = 15;
    const extendedSponsors = Array(MIN_COPIES).fill(sponsors).flat();

    const containerRef = React.useRef<HTMLDivElement>(null);

    const showResultOverlay = !isSpinning && progress === 100;

    return (
      <div
        ref={containerRef}
        className={cn("relative w-full", className)}
        {...props}
      >
        {/* Spinning Status */}
        <h2 className="text-3xl md:text-5xl lg:text-[101px] font-heading text-[#163446] text-center mb-6 leading-[1.14]">
          Spinning
        </h2>

        {/* Slot Machine Container */}
        <div
          className="relative w-full max-w-[1200px] mx-auto rounded-2xl sm:rounded-3xl md:rounded-[29px] p-4 sm:p-5 md:p-6 lg:p-8"
          style={{
            background:
              "linear-gradient(137deg, rgba(11, 141, 217, 1) 4%, rgba(45, 195, 248, 1) 100%)",
            boxShadow: "0px 4.24px 35.10px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Three Slot Columns */}
          <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center items-start mb-4 sm:mb-6 md:mb-8">
            {[0, 1, 2].map((slotIndex) => (
              <div
                key={slotIndex}
                className="relative w-full max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[320px] xl:max-w-[350px] h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] xl:h-[450px] overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[22.88px]"
                style={{
                  background:
                    isComplete && isWin
                      ? "linear-gradient(180deg, rgba(63, 210, 161, 1) 0%, rgba(68, 209, 248, 1) 100%)"
                      : "#F9FAFC",
                  border: "3.52px solid #111D21",
                }}
              >
                {/* Scrolling Cards */}
                <div
                  ref={spinRefs[slotIndex]}
                  className="absolute top-0 left-0 w-full"
                  style={{
                    transform: "translateY(0)",
                  }}
                >
                  {extendedSponsors.map((sponsor, index) => (
                    <div
                      key={index}
                      className="w-full h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] xl:h-[450px] flex flex-col items-center justify-center p-3 sm:p-4"
                    >
                      <div className="relative w-[120px] h-[40px] sm:w-[150px] sm:h-[50px] md:w-[180px] md:h-[55px] lg:w-[200px] lg:h-[60px] xl:w-[214.52px] xl:h-[67.22px] mb-2 sm:mb-3 md:mb-4">
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Indicator - Below slots */}
        </div>
        <div className="pt-10 flex justify-center items-center w-full">
          <div className="relative w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px] xl:w-[303px] xl:h-[303px]">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "#FFFFFF",
                border: "4px solid #0C97E4",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-[93.17px] font-heading text-black">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
SlotMachine.displayName = "SlotMachine";

export { SlotMachine };
