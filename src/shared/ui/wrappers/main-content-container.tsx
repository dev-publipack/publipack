import React from 'react';
import { LightsRow } from '@/components/lights';
import { Spin2WinHeader } from './spin-2-win-header';
import { ChainBlock } from '../chain-block';
import { useSlotMachine } from '@/hooks/use-slot-machine';
import { Sponsor } from '@/shared/types';
import { cn } from '@/shared/lib/utils';

interface MainContentContainerWrapperProps {
  sponsors: Sponsor[];
  onComplete?: (result: { winner: Sponsor | null; isWin: boolean }) => void;
}

export function MainContentContainerWrapper({ 
  sponsors, 
  onComplete 
}: MainContentContainerWrapperProps) {
  const {
    isSpinning,
    isComplete,
    isWin,
    spinRefs,
    extendedSponsors,
  } = useSlotMachine({ 
    sponsors, 
    onComplete,
  });

  return (
    <div className="relative w-full h-full z-10">
      <Spin2WinHeader text="! WINNER !" />
      <div className="relative w-full h-full">
        {/* Gradient background layer */}
        <div
          className="absolute -inset-4 rounded-[80px] z-1 bg-machine-gradient shadow-[0_0_10px_5px_rgba(255,255,255,0.85),inset_0_0_20px_5px_rgba(255,255,255,0.85)]"
          style={{
            background: 'radial-gradient(50% 50% at 50% 50%, #FFF7FB 50%, #FFA2DC 100%)',
            top: '-20%',
            bottom: '-4%',
            left: '-4%',
            right: '-4%',
          }}
        />
        <LightsRow pattern={[true, false, true, false, true]} />
        
        <div
          className={cn(
            "relative z-5 w-full h-full rounded-[60px] border-4 border-[#FF8B00] overflow-hidden transition-all duration-1000",
            isComplete && isWin ? "bg-gradient-to-b from-[#3FD2A1] to-[#44D1F8]" : "bg-[#FFEDD9]"
          )}
        >
          {/* Three Slot Columns */}
          <div className="relative grid grid-cols-3 gap-0 w-full h-full">
            {[0, 1, 2].map((slotIndex) => (
              <div
                key={slotIndex}
                className="relative w-full h-full flex items-center justify-center overflow-hidden"
              >
                {/* Scrolling Sponsors */}
                <div
                  ref={spinRefs[slotIndex]}
                  className="absolute top-0 left-0 w-full"
                  style={{
                    transform: "translateY(0)",
                  }}
                >
                  {extendedSponsors.map((sponsor, index) => (
                    <div
                      key={`${slotIndex}-${index}`}
                      className="w-full h-[200px] flex flex-col items-center justify-center p-4 gap-2"
                    >
                      <div className="relative w-full flex-1 flex items-center justify-center">
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      {sponsor.text && (
                        <p className="font-body text-[#111D21] text-center line-clamp-2 text-lg">
                          {sponsor.text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Left Divider - between slot 1 and slot 2 */}
            <svg 
              className="absolute left-[33.33%] top-0 h-full pointer-events-none z-10"
              style={{ transform: 'translateX(-50%)' }}
              width="18" 
              height="100%" 
              viewBox="0 0 18 215" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path d="M16.5 0.791275C-3.94631 33.7188 -3.04865 178.394 16.5 213.791" stroke="#FFA2DC" strokeWidth="3" />
            </svg>

            {/* Right Divider - between slot 2 and slot 3 */}
            <svg 
              className="absolute left-[66.66%] top-0 h-full pointer-events-none z-10"
              style={{ transform: 'translateX(-50%)' }}
              width="18" 
              height="100%" 
              viewBox="0 0 18 215" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path d="M1.31305 0.791275C21.7594 33.7188 20.8617 178.394 1.31306 213.791" stroke="#FFA2DC" strokeWidth="3" />
            </svg>
          </div>
        </div>

        {/* ChainBlock positioned to overlap bottom of content */}
        <ChainBlock text='SPIN NOW' />
      </div>
    </div>
  );
}