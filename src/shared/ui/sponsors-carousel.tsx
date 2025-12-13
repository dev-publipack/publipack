import * as React from "react";
import type { Sponsor } from '../types';
import { cn } from '../lib/utils';
import { useSponsorsScroll } from '../../hooks/use-sponsors-scroll';
import { getSponsorScaleClass } from '../lib/sponsor-scale-config';

interface SponsorsCarouselProps {
  sponsors: Sponsor[];
  onComplete?: () => void;
  className?: string;
  onLoadingChange?: (isLoading: boolean) => void;
  scrollDuration?: number; // Optional custom scroll duration
}

export function SponsorsCarousel({ sponsors, onComplete, className, onLoadingChange, scrollDuration }: SponsorsCarouselProps) {
  const { scrollRefs, extendedSponsors, isScrolling } = useSponsorsScroll({
    sponsors,
    onComplete,
    onLoadingChange,
    duration: scrollDuration,
  });

  return (
    <div className={cn("relative w-full", className)}>
      {/* Three Slot Columns */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 justify-items-center items-start w-full">
        {[0, 1, 2].map((slotIndex) => (
          <div
            key={slotIndex}
            className="relative w-full h-[154px] sm:h-[176px] md:h-[198px] lg:h-[220px] xl:h-[248px] overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[22.88px]"
            style={{
              background: "#F9FAFC",
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
  );
}

