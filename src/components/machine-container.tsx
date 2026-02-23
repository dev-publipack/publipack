import React from 'react';
import { MACHINE_WIDTH } from '@/shared/lib/game-config';

interface MachineContainerProps {
  children: React.ReactNode;
  /** Optional slot for light bulbs at top of pink container */
  topSlot?: React.ReactNode;
  variant?: 'default' | 'expanded' | 'form';
}

// 20% extra height at top only (for light bulbs)
const TOP_EXTENSION_RATIO = 0.2;

const PADDING = 24; // p-6

const HEIGHTS = { default: 260, expanded: 290, form: 360 } as const;

export function MachineContainer({
  children,
  topSlot,
  variant = 'default',
}: MachineContainerProps) {
  const baseHeight = HEIGHTS[variant];
  const topExtension = Math.round(baseHeight * TOP_EXTENSION_RATIO);

  return (
    <div
      className="relative w-full min-h-[260px]"
      style={{ height: `${baseHeight}px`, maxWidth: MACHINE_WIDTH }}
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
        className="h-full rounded-[70px] flex flex-col items-center px-0 py-3"
      >
        <div className={`flex-1 flex ${variant === 'form' ? 'items-center' : 'items-center'} justify-center w-full min-h-0 ${variant === 'expanded' ? 'pb-4' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
