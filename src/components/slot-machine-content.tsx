'use client';

import React from 'react';
import { Sponsor } from '@/shared/types';
import { SLOT_CARD_HEIGHT, SLOT_VISIBLE_CARDS } from '@/shared/lib/game-config';

interface SlotMachineContentProps {
  spinRefs: React.RefObject<HTMLDivElement | null>[];
  extendedSponsors: Sponsor[];
}

export function SlotMachineContent({
  spinRefs,
  extendedSponsors,
}: SlotMachineContentProps) {
  return (
    <div className="relative grid grid-cols-3 gap-0 w-full">
      {[0, 1, 2].map((slotIndex) => (
        <div
          key={slotIndex}
          className="relative w-full overflow-hidden"
          style={{ height: `${SLOT_CARD_HEIGHT * SLOT_VISIBLE_CARDS}px` }}
        >
          <div
            ref={spinRefs[slotIndex]}
            className="absolute top-0 left-0 w-full"
            style={{ transform: 'translateY(0)' }}
          >
            {extendedSponsors.map((sponsor, index) => (
              <div
                key={`${slotIndex}-${index}`}
                className="w-full flex flex-col items-center justify-center py-1.5"
                style={{ height: `${SLOT_CARD_HEIGHT}px` }}
              >
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="object-contain"
                  style={{ maxHeight: '32px', maxWidth: '60%' }}
                />
                {sponsor.text && (
                  <p className="font-body text-[#111D21] text-center line-clamp-2 text-xs mt-0.5">
                    {sponsor.text}
                  </p>
                )}
                <div className="w-10 h-px mt-1" style={{ backgroundColor: '#B5B5B5' }} />
              </div>
            ))}
          </div>
        </div>
      ))}

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
        <path
          d="M16.5 0.791275C-3.94631 33.7188 -3.04865 178.394 16.5 213.791"
          stroke="#FFA2DC"
          strokeWidth="3"
        />
      </svg>

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
        <path
          d="M1.31305 0.791275C21.7594 33.7188 20.8617 178.394 1.31306 213.791"
          stroke="#FFA2DC"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}