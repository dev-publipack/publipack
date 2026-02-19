'use client';

import React from 'react';
import { cn } from '@/shared/lib/utils';
import {
  CHASE_PATTERNS,
  BLINK_PATTERNS,
  FADE_PATTERNS,
} from './glow-pattern';

const LIGHT_ON = '/design/lights/light-on.svg';
const LIGHT_OFF = '/design/lights/light-off.svg';

/** Screen state → lantern animation */
export type LanternState = 'idle' | 'spinning' | 'winner' | 'loser';

/** Legacy: glow pattern type (for backward compat) */
export type GlowPatternType = 'static' | 'chase' | 'winner';

const STATE_CONFIG: Record<
  LanternState,
  { patterns: boolean[][]; intervalMs: number }
> = {
  idle: { patterns: CHASE_PATTERNS, intervalMs: 300 },
  spinning: { patterns: CHASE_PATTERNS, intervalMs: 100 },
  winner: { patterns: BLINK_PATTERNS, intervalMs: 250 },
  loser: { patterns: FADE_PATTERNS, intervalMs: 600 },
};

interface LanternRowProps {
  /** Screen state → auto pattern + interval */
  lanternState?: LanternState;
  /** @deprecated Use lanternState. Manual pattern override */
  pattern?: boolean[];
  /** @deprecated Use lanternState. Manual glow type */
  glowPattern?: GlowPatternType;
  /** For winner/chase: animation interval ms (overridden by lanternState) */
  intervalMs?: number;
  className?: string;
}

export function LanternRow({
  lanternState,
  pattern = [true, false, true, false, true],
  glowPattern = 'static',
  intervalMs = 200,
  className,
}: LanternRowProps) {
  const [patternIndex, setPatternIndex] = React.useState(0);

  const defaultStaticPattern = [true, false, true, false, true] as boolean[];
  const safePattern = Array.isArray(pattern) ? pattern : defaultStaticPattern;

  const resolved =
    lanternState !== undefined
      ? STATE_CONFIG[lanternState]
      : glowPattern === 'winner'
        ? { patterns: BLINK_PATTERNS, intervalMs }
        : glowPattern === 'chase'
          ? { patterns: CHASE_PATTERNS, intervalMs }
          : { patterns: [safePattern], intervalMs: 0 };

  const { patterns, intervalMs: resolvedInterval } = resolved;
  const rawPattern = patterns[patternIndex];
  const currentPattern = Array.isArray(rawPattern)
    ? rawPattern
    : [false, false, false, false, false];
  const isAnimating = patterns.length > 1;

  React.useEffect(() => {
    if (!isAnimating) {
      setPatternIndex(0);
      return;
    }
    const id = setInterval(() => {
      setPatternIndex((prev) => (prev + 1) % patterns.length);
    }, resolvedInterval);
    return () => clearInterval(id);
  }, [isAnimating, patterns.length, resolvedInterval]);

  return (
    <div
      className={cn('flex items-center justify-center gap-7', className)}
      role="img"
      aria-label="Decorative lantern row"
    >
      {currentPattern.map((isOn, index) => (
        <div
          key={index}
          className={cn(
            'w-5 h-5 transition-shadow duration-300',
            isOn &&
              (isAnimating
                ? 'animate-lantern-pulse'
                : 'shadow-[0_0_12px_4px_rgba(255,227,194,0.55),0_0_20px_8px_rgba(255,176,81,0.4)]')
          )}
        >
          <img
            src={isOn ? LIGHT_ON : LIGHT_OFF}
            alt=""
            className="w-full h-full object-contain"
            aria-hidden
          />
        </div>
      ))}
    </div>
  );
}
