import React from 'react';
import { MainContentContainerWrapper } from '../shared/ui/wrappers/main-content-container';

/**
 * Spinner Component
 *
 * Rotating wheel with 9 offer sectors (3×3)
 *
 * Design specs:
 * - Size: 336 × 219 px
 * - Border radius: 60px
 * - Internal fill: #FFEDD9
 * - Stroke: #FF8B00 4px
 * - Center lines: #FFA2DC 3px
 * - Offers font: Roboto 900, 15px, UPPERCASE
 *
 * @see docs/DESIGN_SPEC.md - Section 5, 6
 */
interface SpinnerProps {
  offers: string[];
  isSpinning?: boolean;
  rotation?: number;
}

export function Spinner({
  offers,
  isSpinning = false,
  rotation = 0,
}: SpinnerProps) {
  return (
    <div className="relative w-[336px] h-[219px]">
      {/* Inner container */}
      <MainContentContainerWrapper>
        {/* 3×3 grid for offers */}
        <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2 gap-1">
          {offers.map((offer, index) => (
            <div
              key={index}
              className="flex items-center justify-center text-center"
            >
              <span className="font-roboto font-black text-[15px] text-black uppercase leading-tight">
                {offer}
              </span>
            </div>
          ))}
        </div>

        {/* Center lines (pointers) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[3px] bg-pink-bright -translate-x-1/2"></div>
          {/* Horizontal line */}
          <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-pink-bright -translate-y-1/2"></div>
        </div>
      </MainContentContainerWrapper>
    </div>
  );
}
