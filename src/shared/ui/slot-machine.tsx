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
    const [completedSlots, setCompletedSlots] = React.useState<Set<number>>(new Set());
    
    const spinResultRef = React.useRef<{ winner: Sponsor | null; isWin: boolean } | null>(null);

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
      setCompletedSlots(new Set());
      spinResultRef.current = null;

      // Reset all slots to initial position
      spinRefs.forEach((slotRef) => {
        if (slotRef.current) {
          slotRef.current.style.transition = "none";
          slotRef.current.style.transform = "translateY(0)";
        }
      });

      void document.body.offsetHeight;

      // 50/50 chance to win or lose
      const winResult = Math.random() < 0.5;
      setIsWin(winResult);

      // Select winners based on result
      let winners: [number, number, number];
      let winningSponsorIndex: number;

      if (winResult) {
        // Win: all 3 slots show the same sponsor (3 in a row)
        winningSponsorIndex = Math.floor(Math.random() * sponsors.length);
        winners = [winningSponsorIndex, winningSponsorIndex, winningSponsorIndex];
      } else {
        // Lose: all 3 slots show different sponsors
        const availableIndices = Array.from({ length: sponsors.length }, (_, i) => i);
        const selected: number[] = [];
        
        // Select 3 different random indices
        while (selected.length < 3) {
          const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
          if (!selected.includes(randomIndex)) {
            selected.push(randomIndex);
          }
        }
        
        winners = [selected[0], selected[1], selected[2]] as [number, number, number];
        winningSponsorIndex = -1; // Not used for lose case
      }

      const SPIN_DURATION = 7000;
      const RESULT_DISPLAY_DURATION = 1500;
      
      // Store result for later use when animation completes
      spinResultRef.current = {
        winner: winResult ? sponsors[winningSponsorIndex] : null,
        isWin: winResult,
      };

      // Get card height based on viewport - matches the responsive heights in the render
      const getCardHeight = () => {
        if (typeof window === "undefined") return 248;
        const width = window.innerWidth;
        if (width >= 1280) return 248;
        if (width >= 1024) return 220;
        if (width >= 768) return 198;
        if (width >= 640) return 176;
        return 154;
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
        }
      };

      // Handle slot animation completion
      const handleSlotComplete = (slotIndex: number) => {
        setCompletedSlots((prev) => {
          const newSet = new Set(prev);
          newSet.add(slotIndex);
          
          // When all 3 slots are complete, show result and trigger onComplete
          if (newSet.size === 3) {
            setIsComplete(true);
            
            // Wait for visual result display, then call onComplete
            setTimeout(() => {
              if (onComplete && spinResultRef.current) {
                onComplete(spinResultRef.current);
              }
            }, RESULT_DISPLAY_DURATION);
          }
          
          return newSet;
        });
      };

      // Animate each slot
      spinRefs.forEach((slotRef, index) => {
        if (slotRef.current) {
          const targetIndex = winners[index];
          const minFullRotations = 7;
          const totalSpins = minFullRotations * sponsors.length + targetIndex;
          const targetPosition = -(totalSpins * CARD_HEIGHT);

          // Remove previous event listeners
          const currentSlot = slotRef.current;
          const handleTransitionEnd = (e: TransitionEvent) => {
            // Only handle transform transitions
            if (e.propertyName === "transform") {
              handleSlotComplete(index);
              currentSlot.removeEventListener("transitionend", handleTransitionEnd);
            }
          };

          setTimeout(() => {
            if (slotRef.current) {
              slotRef.current.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(0.15, 0.35, 0.25, 0.85)`;
              slotRef.current.style.transform = `translateY(${targetPosition}px)`;
              
              // Listen for transition end
              slotRef.current.addEventListener("transitionend", handleTransitionEnd);
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

    // Cleanup event listeners on unmount
    React.useEffect(() => {
      return () => {
        spinRefs.forEach((slotRef) => {
          if (slotRef.current) {
            // Remove any remaining event listeners
            const clone = slotRef.current.cloneNode(true);
            if (slotRef.current.parentNode) {
              slotRef.current.parentNode.replaceChild(clone, slotRef.current);
            }
          }
        });
      };
    }, []);

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


    return (
      <div
        ref={containerRef}
        className={cn("relative w-full mx-auto justify-center items-center flex flex-col", className)}
        {...props}
      >
        {/* Spinning Status */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-[#163446] text-center mb-6 sm:mb-8 leading-[1.14]">
          Spinning
        </h2>

        {/* Slot Machine Container */}
        <div
          className="relative w-full max-w-[900px] rounded-2xl sm:rounded-3xl md:rounded-[29px] p-4 sm:p-5 md:p-6 lg:p-8"
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
                className="relative w-full max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[320px] xl:max-w-[350px] h-[154px] sm:h-[176px] md:h-[198px] lg:h-[220px] xl:h-[248px] overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[22.88px]"
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
                      className="w-full h-[154px] sm:h-[176px] md:h-[198px] lg:h-[220px] xl:h-[248px] flex flex-col items-center justify-center p-2 sm:p-3"
                    >
                      <div
                        className={cn(
                          "relative",
                          sponsor.name === "Disney"
                            ? "w-[105px] h-[32px] sm:w-[120px] sm:h-[36px] md:w-[135px] md:h-[40px] lg:w-[150px] lg:h-[45px] xl:w-[165px] xl:h-[50px]"
                            : "w-[140px] h-[42px] sm:w-[160px] sm:h-[48px] md:w-[180px] md:h-[54px] lg:w-[200px] lg:h-[60px] xl:w-[220px] xl:h-[66px]"
                        )}
                      >
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
        
        <div className="pt-6 sm:pt-8 md:pt-10 flex justify-center items-center w-full">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "#FFFFFF",
                border: "4px solid #0C97E4",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading text-black">
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
