import React from 'react';

interface MachineContainerProps {
  children: React.ReactNode;
  /** Optional slot for light bulbs at top of pink container */
  topSlot?: React.ReactNode;
  variant?: 'default' | 'expanded';
}

// 20% extra height at top only (for light bulbs)
const TOP_EXTENSION_RATIO = 0.2;

const PADDING = 24; // p-6

export function MachineContainer({
  children,
  topSlot,
  variant = 'default',
}: MachineContainerProps) {
  const baseHeight = variant === 'expanded' ? 398 : 281;
  const topExtension = Math.round(baseHeight * TOP_EXTENSION_RATIO);

  return (
    <div
      className="relative w-full max-w-[398px]"
      style={{ height: `${baseHeight}px` }}
    >
      {/* Top extension - above layout flow, doesn't affect Y centering */}
      {topSlot && (
        <div
          className="absolute left-0 right-0 flex justify-center px-6"
          style={{
            bottom: '100%',
            height: `${topExtension}px`,
            paddingTop: PADDING,
          }}
        >
          {topSlot}
        </div>
      )}
      {/* Main container - symmetric padding, centered correctly */}
      <div
        className="h-full rounded-[70px] flex flex-col items-center px-6 py-6"
      >
        <div className="flex-1 flex items-end justify-center w-full min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}
