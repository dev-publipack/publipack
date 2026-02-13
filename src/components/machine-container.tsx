import React from 'react';

/**
 * Machine Container Component
 *
 * Main slot machine container with gradient background
 *
 * Design specs:
 * - Size: 358 × 281 px (BEGIN) / 358 × 398 px (CLAIM)
 * - Border radius: 70px
 * - Fill: radial-gradient(circle at 50% 50%, #FFF7FB 50%, #FFA2DC 100%)
 * - Shadow: multiple layers
 *
 * @see docs/DESIGN_SPEC.md - Section 5
 */
interface MachineContainerProps {
  children: React.ReactNode;
  /** Optional slot for light bulbs at top of pink container */
  topSlot?: React.ReactNode;
  variant?: 'default' | 'expanded';
}

// 20% extra height at top only (for light bulbs)
const TOP_EXTENSION_RATIO = 0.2;

export function MachineContainer({
  children,
  topSlot,
  variant = 'default',
}: MachineContainerProps) {
  const baseHeight = variant === 'expanded' ? 398 : 281;
  const topExtension = Math.round(baseHeight * TOP_EXTENSION_RATIO);
  const height = baseHeight + topExtension;
  const topPadding = 24 + topExtension; // p-6 (24px) + 20% extension

  return (
    <div
      className="w-[358px] rounded-[70px]  flex flex-col items-center px-6 pb-6"
      style={{ height: `${height}px`, paddingTop: `${topPadding}px` }}
    >
      {/* Top slot for light bulbs - 20% extension upward */}
      {topSlot && (
        <div className="shrink-0 flex justify-center w-full mb-2">
          {topSlot}
        </div>
      )}
      {/* Main content - stays at bottom, unchanged */}
      <div className="flex-1 flex items-end justify-center w-full min-h-0">
        {children}
      </div>
    </div>
  );
}
