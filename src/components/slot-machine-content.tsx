'use client';

import React from 'react';
import { Sponsor } from '@/shared/types';
import {
  SLOT_CARD_HEIGHT,
  SLOT_VISIBLE_CARDS,
  MACHINE_WIDTH,
} from '@/shared/lib/game-config';
import { GAME_RULES } from '@/shared/lib/game-config';

interface SlotMachineContentProps {
  spinRefs: React.RefObject<HTMLDivElement | null>[];
  sponsors: Sponsor[];
}

export function SlotMachineContent({ spinRefs, sponsors }: SlotMachineContentProps) {
  const minCards =
    (GAME_RULES.MIN_FULL_ROTATIONS + 3) * sponsors.length;

  const slotHeight = SLOT_CARD_HEIGHT * SLOT_VISIBLE_CARDS;

  return (
    <div
      className="relative grid grid-cols-3 gap-0 w-full mx-auto rounded-[60px] overflow-hidden border-4 border-[#FF8B00]"
      style={{
        maxWidth: MACHINE_WIDTH,
        boxShadow:
          '0 4px 20px rgba(0,0,0,0.12), 0 0 10px 5px rgba(255,255,255,0.85), inset 0 2px 6px rgba(255,255,255,0.7), inset 0 -1px 3px rgba(0,0,0,0.08), inset 8px 0 16px -8px rgba(255,255,255,0.5), inset -8px 0 16px -8px rgba(255,255,255,0.5)',
      }}
    >
      {[0, 1, 2].map((slotIndex) => (
        <div
          key={slotIndex}
          className="relative w-full overflow-hidden isolate"
          style={{
            height: `${slotHeight}px`,
            backgroundColor: '#FFEDD9',
          }}
        >
          <div
            ref={spinRefs[slotIndex]}
            className="absolute top-0 left-0 w-full overflow-hidden"
            style={{ transform: 'translateY(0)' }}
          >
            {Array.from({ length: minCards }, (_, index) => {
              const sponsor = sponsors[index % sponsors.length];
              return (
                <div
                  key={`${slotIndex}-${index}`}
                  className="w-full flex flex-col items-center justify-center py-1"
                  style={{ height: `${SLOT_CARD_HEIGHT}px` }}
                >
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="object-contain"
                    style={{ maxHeight: '26px', maxWidth: '60%' }}
                  />
                  {sponsor.text && (
                    <p
                      className="text-[#111D21] text-center line-clamp-2 text-xs mt-0.5"
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {sponsor.text}
                    </p>
                  )}
                  <div
                    className="w-10 h-px mt-1"
                    style={{ backgroundColor: '#B5B5B5' }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <svg
        className="absolute top-0 pointer-events-none z-10"
        style={{
          left: 'calc(100% / 3)',
          transform: 'translateX(-50%)',
          height: `${slotHeight}px`,
          width: 18,
        }}
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
        className="absolute top-0 pointer-events-none z-10"
        style={{
          left: 'calc(200% / 3)',
          transform: 'translateX(-50%)',
          height: `${slotHeight}px`,
          width: 18,
        }}
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