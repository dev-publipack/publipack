import React from 'react';

/**
 * Light Component
 *
 * Base light element for win animation effects
 *
 * Design specs:
 * - Size: 20 × 20 px
 * - Light On: radial gradient with glow effect
 * - Light Off: simple gray circle
 * - Glow: rgba(255,227,194,0.55), rgba(255,176,81,0.4)
 *
 * @see docs/DESIGN_SPEC.md - Section 4.2
 */
interface LightProps {
  isOn?: boolean;
  className?: string;
}

export function Light({ isOn = false, className = '' }: LightProps) {
  return (
    <div
      className={`
        w-5 h-5 rounded-full transition-all duration-300
      ${className}
      `}
    />
  );
}
