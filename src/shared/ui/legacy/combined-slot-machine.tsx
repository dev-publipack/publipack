import * as React from "react";
import { cn } from "../../lib/utils";
import type { Sponsor } from "../../types";
import { CountdownTimer } from "./countdown-timer";
import { useLanguage } from "../../../providers/language-provider";
import { useCombinedSlotMachine } from "../../../hooks/legacy/use-combined-slot-machine";
import { getSponsorScaleClass } from "../../lib/sponsor-scale-config";

export interface CombinedSlotMachineProps {
  sponsors: Sponsor[];
  onComplete?: (result: { winner: Sponsor | null; isWin: boolean }) => void;
  className?: string;
  isCooldown?: boolean;
}

export function CombinedSlotMachine({ sponsors, onComplete, className, isCooldown = false }: CombinedSlotMachineProps) {
  const { t } = useLanguage();
  
  const {
    phase,
    isAnimating,
    isComplete,
    isWin,
    hasStarted,
    scrollRefs,
    extendedSponsors,
    totalDuration,
  } = useCombinedSlotMachine({ sponsors, onComplete, isCooldown });

  // Track countdown from start of animation - один непрерывный таймер
  const [remainingSeconds, setRemainingSeconds] = React.useState(0);
  const startTimeRef = React.useRef<number | null>(null);
  const animationFrameRef = React.useRef<number | null>(null);

  // Start countdown when animation begins (sponsors phase starts)
  React.useEffect(() => {
    if (hasStarted && startTimeRef.current === null) {
      const now = performance.now();
      startTimeRef.current = now;
      const initialSeconds = Math.ceil(totalDuration / 1000);
      setRemainingSeconds(initialSeconds);
    }
  }, [hasStarted, totalDuration]);

  // Update countdown continuously until complete
  React.useEffect(() => {
    if (!hasStarted || !startTimeRef.current || isComplete) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const updateCountdown = () => {
      if (!startTimeRef.current) {
        return;
      }

      const elapsed = performance.now() - startTimeRef.current;
      const remaining = Math.max(0, totalDuration - elapsed);
      const seconds = Math.ceil(remaining / 1000);

      setRemainingSeconds(seconds);

      // Continue until complete (not just until isAnimating is false)
      if (remaining > 0 && !isComplete) {
        animationFrameRef.current = requestAnimationFrame(updateCountdown);
      } else {
        setRemainingSeconds(0);
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateCountdown);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [hasStarted, totalDuration, isComplete]);

  const isSponsorPhase = phase === 'sponsors';

  return (
    <div
      className={cn("relative w-full mx-auto justify-center items-center flex flex-col", className)}
    >
      {/* Title */}
      {isSponsorPhase ? (
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-[#163446] leading-[1.4] text-center mb-3 sm:mb-4">
          {t('mainScreen.title').split('?')[0]} <span className="text-[#44D2FD]">{t('mainScreen.title').split(' ').slice(-1)[0]}</span>
        </h1>
      ) : (
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-[#163446] text-center mb-6 sm:mb-8 leading-[1.14]">
          {t('slotMachine.title')}
        </h2>
      )}
      
      {/* Subtitle - показываем только в фазе спонсоров */}
      {isSponsorPhase && (
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-body-semibold max-w-[600px] text-[#163446] text-center leading-[1.362] mb-6 sm:mb-8 md:mb-10 mx-auto">
          {t('mainScreen.subtitle').split(t('mainScreen.subtitleBold'))[0]}
          <span className="text-black font-bold">{t('mainScreen.subtitleBold')}</span>
          {t('mainScreen.subtitle').split(t('mainScreen.subtitleBold'))[1]}
        </p>
      )}

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
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 justify-items-center items-start w-full">
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
                ref={scrollRefs[slotIndex]}
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

      {/* Countdown Timer - показывается от начала спонсоров до завершения слотов */}
      <div className="pt-6 sm:pt-8 md:pt-10 flex justify-center items-center w-full max-w-[600px] mx-auto px-4">
        {hasStarted && !isComplete && (
          <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 w-full">
            <CountdownTimer 
              seconds={remainingSeconds} 
              showCooldown={false} 
              initialSeconds={Math.ceil(totalDuration / 1000)} 
            />
            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-body-semibold text-black text-center leading-[1.362]">
              {t('mainScreen.countdownMessage')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

