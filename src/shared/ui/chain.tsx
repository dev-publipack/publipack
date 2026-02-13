import React from 'react';

/**
 * Chain Component
 *
 * Decorative chains on the sides of the machine
 *
 * Design specs:
 * - Size: 23 × 108 px
 * - Stroke: #FFE7CA 4px
 * - Links: radial-gradient(#FFE7CA 35%, #FF8B00 100%)
 *
 * @see docs/DESIGN_SPEC.md - Section 4.1
 */
interface ChainProps {
  side?: 'left' | 'right';
  className?: string;
}

export function Chain({ side = 'left', className = '' }: ChainProps) {
  return (
    <div
      className={`
        w-[23px] h-[108px] flex flex-col gap-1
        ${className}
      `}
    >
      {/* Top mount */}
      <div className="w-full h-2 bg-gray-400 rounded-full"></div>

      {/* Chain links */}
      <div className="flex-1 flex flex-col justify-center items-center gap-2">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="w-5 h-6 bg-chain-gradient rounded-full border-4 border-orange-light"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Chain Pair Component
 *
 * Pair of chains for container sides
 */
interface ChainPairProps {
  className?: string;
}

export function ChainPair({ className = '' }: ChainPairProps) {
  return (
    <div className={`absolute top-0 w-full flex justify-between px-4 ${className}`}>
      <Chain side="left" />
      <Chain side="right" />
    </div>
  );
}
