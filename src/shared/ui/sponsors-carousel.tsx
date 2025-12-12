import * as React from "react";
import type { Sponsor } from '../types';
import { cn } from '../lib/utils';
import { useSponsorsScroll } from '../../hooks/use-sponsors-scroll';

interface SponsorsCarouselProps {
  sponsors: Sponsor[];
  onComplete?: () => void;
  className?: string;
  onLoadingChange?: (isLoading: boolean) => void;
}

export function SponsorsCarousel({ sponsors, onComplete, className, onLoadingChange }: SponsorsCarouselProps) {
  const { scrollRefs, extendedSponsors, isScrolling } = useSponsorsScroll({
    sponsors,
    onComplete,
  });

  React.useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isScrolling);
    }
  }, [isScrolling, onLoadingChange]);

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
              {extendedSponsors.map((sponsor, index) => {
                // Get scale factor based on sponsor.scale property
                const scale: 'small' | 'medium' | 'large' | 'xlarge' = sponsor.scale || 'large';
                
                // Check if logo needs additional 10% increase
                const needsExtra10Percent = 
                  sponsor.logo === "/images/preply-logo.svg" ||
                  sponsor.logo === "/images/disney-land.svg";
                
                // Check if logo needs additional 20% + 10% increase (workaway)
                const needsExtra20Percent = 
                  sponsor.logo === "/images/workaway-info.svg";
                
                // Define maximum container dimensions based on scale (increased by 15% + 10% + 10% + 15%, xlarge = 150% + 10% + 10% + 15%)
                const scaleClasses: Record<'small' | 'medium' | 'large' | 'xlarge', string> = {
                  small: needsExtra20Percent
                    ? "max-w-[235px] max-h-[127px] sm:max-w-[304px] sm:max-h-[143px] md:max-w-[357px] md:max-h-[164px] lg:max-w-[406px] lg:max-h-[182px] xl:max-w-[460px] xl:max-h-[200px]"
                    : needsExtra10Percent
                      ? "max-w-[177px] max-h-[97px] sm:max-w-[230px] sm:max-h-[109px] md:max-w-[269px] md:max-h-[124px] lg:max-w-[307px] lg:max-h-[138px] xl:max-w-[350px] xl:max-h-[152px]"
                      : "max-w-[161px] max-h-[87px] sm:max-w-[209px] sm:max-h-[99px] md:max-w-[245px] md:max-h-[113px] lg:max-w-[279px] lg:max-h-[125px] xl:max-w-[317px] xl:max-h-[138px]",
                  medium: needsExtra10Percent
                    ? "max-w-[230px] max-h-[115px] sm:max-w-[275px] sm:max-h-[127px] md:max-w-[308px] md:max-h-[140px] lg:max-w-[343px] lg:max-h-[154px] xl:max-w-[378px] xl:max-h-[168px]"
                    : "max-w-[209px] max-h-[105px] sm:max-w-[250px] sm:max-h-[115px] md:max-w-[281px] md:max-h-[128px] lg:max-w-[312px] lg:max-h-[140px] xl:max-w-[344px] xl:max-h-[153px]",
                  large: "max-w-[289px] max-h-[137px] sm:max-w-[332px] sm:max-h-[148px] md:max-w-[375px] md:max-h-[161px] lg:max-w-[416px] lg:max-h-[173px] xl:max-w-[458px] xl:max-h-[185px]",
                  xlarge: "max-w-[376px] max-h-[178px] sm:max-w-[434px] sm:max-h-[192px] md:max-w-[489px] md:max-h-[209px] lg:max-w-[543px] lg:max-h-[225px] xl:max-w-[597px] xl:max-h-[242px]"
                };

                return (
                  <div
                    key={index}
                    className="w-full h-[154px] sm:h-[176px] md:h-[198px] lg:h-[220px] xl:h-[248px] flex flex-col items-center justify-center p-3 sm:p-4"
                  >
                    <div className={cn("relative w-full h-full flex items-center justify-center", scaleClasses[scale])}>
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

