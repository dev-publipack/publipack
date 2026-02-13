import * as React from "react";
import { cn } from "../../lib/utils";
import type { Sponsor } from "../../types";
import { CountdownTimer } from "./countdown-timer";
import { useLanguage } from "../../../providers/language-provider";
import { useSpinCountdown } from "../../../hooks/use-spin-countdown";
import { useSlotMachine } from "../../../hooks/use-slot-machine";
import { getSponsorScaleClass } from "../../lib/sponsor-scale-config";

export interface SlotMachineProps {
  sponsors: Sponsor[];
  onComplete?: (result: { winner: Sponsor | null; isWin: boolean }) => void;
  className?: string;
}

export interface SlotMachineRef {
  startSpin: () => void;
}

const SPIN_DURATION = 7000;

const SlotMachine = React.forwardRef<SlotMachineRef, SlotMachineProps>(
  ({ sponsors, onComplete, className, ...props }, ref) => {
    const { t } = useLanguage();

    const {
      isSpinning,
      isComplete,
      isWin,
      spinRefs,
      extendedSponsors,
      startSpin,
    } = useSlotMachine({ sponsors, onComplete });

    const { remainingSeconds: spinCountdown } = useSpinCountdown({
      isSpinning,
      spinDuration: SPIN_DURATION,
    });

    React.useImperativeHandle(ref, () => ({
      startSpin,
    }));

    return (
      <div
        className={cn("relative w-full mx-auto justify-center items-center flex flex-col", className)}
        {...props}
      >
        {/* Spinning Status */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-[#163446] text-center mb-6 sm:mb-8 leading-[1.14]">
          {t('slotMachine.title')}
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
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 justify-items-center items-start mb-4 sm:mb-6 md:mb-8 w-full">
            {[0, 1, 2].map((slotIndex) => (
              <div
                key={slotIndex}
                className="relative w-full h-[154px] sm:h-[176px] md:h-[198px] lg:h-[220px] xl:h-[248px] overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[22.88px]"
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
                      className="w-full h-[154px] sm:h-[176px] md:h-[198px] lg:h-[220px] xl:h-[248px] flex flex-col items-center justify-center p-3 sm:p-4 gap-2"
                    >
                      <div className={cn("relative w-full flex-1 flex items-center justify-center", getSponsorScaleClass(sponsor))}>
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      {sponsor.text && (
                        <p 
                          className="font-body text-[#111D21] text-center line-clamp-2 text-[14px] sm:text-[18px] md:text-[21px] lg:text-[24px] xl:text-[26px]"
                          style={{
                            fontFamily: 'var(--font-open-sans)',
                            fontWeight: 400,
                            lineHeight: '100%',
                            letterSpacing: '0%',
                          }}
                        >
                          {sponsor.text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="pt-6 sm:pt-8 md:pt-10 flex justify-center items-center w-full max-w-[600px] mx-auto px-4">
          {isSpinning && (
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 w-full">
              <CountdownTimer seconds={spinCountdown} showCooldown={false} initialSeconds={7} />
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-body-semibold text-black text-center leading-[1.362]">
                {t('mainScreen.countdownMessage')}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

SlotMachine.displayName = "SlotMachine";

export { SlotMachine };