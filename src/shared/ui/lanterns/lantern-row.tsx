'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/shared/lib/utils';
import {
  CHASE_PATTERNS,
  BLINK_PATTERNS,
  FADE_PATTERNS,
} from './glow-pattern';

const LIGHT_ON = '/design/lights/light-on.svg';
const LIGHT_OFF = '/design/lights/light-off.svg';

const LIGHT_COUNT = 5;

/** Screen state → lantern animation */
export type LanternState = 'idle' | 'spinning' | 'winner' | 'loser';

/** Legacy: glow pattern type (for backward compat) */
export type GlowPatternType = 'static' | 'chase' | 'winner';

const STATE_CONFIG: Record<
  LanternState,
  { patterns: boolean[][]; intervalMs: number }
> = {
  idle:     { patterns: CHASE_PATTERNS, intervalMs: 300 },
  spinning: { patterns: CHASE_PATTERNS, intervalMs: 100 },
  winner:   { patterns: BLINK_PATTERNS, intervalMs: 250 },
  loser:    { patterns: FADE_PATTERNS,  intervalMs: 600 },
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
  // Direct DOM refs — animation drives opacity without React re-renders.
  // Each index corresponds to one of the 5 lantern positions.
  const lightOnRefs  = useRef<(HTMLImageElement | null)[]>(Array(LIGHT_COUNT).fill(null));
  const glowRefs     = useRef<(HTMLDivElement   | null)[]>(Array(LIGHT_COUNT).fill(null));

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
  const isAnimating = patterns.length > 1;

  useEffect(() => {
    // Apply one pattern frame to the DOM via direct style mutation.
    // Uses only `opacity` — GPU-composited on iOS, never triggers paint.
    const applyPattern = (frameIndex: number) => {
      const frame = patterns[frameIndex % patterns.length];
      for (let i = 0; i < LIGHT_COUNT; i++) {
        const isOn = frame[i] ?? false;
        const onEl   = lightOnRefs.current[i];
        const glowEl = glowRefs.current[i];
        if (onEl)   onEl.style.opacity   = isOn ? '1' : '0';
        if (glowEl) glowEl.style.opacity = isOn ? '1' : '0';
      }
    };

    // Always apply the first frame immediately so the initial state is correct.
    applyPattern(0);

    if (!isAnimating) return;

    // rAF instead of setInterval: rAF is synced to VSync and never accumulates
    // in a queue when iOS throttles the page. setInterval can fire multiple
    // times in burst after a throttle period, causing visible flicker.
    let idx = 1;
    let lastTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      if (now - lastTime >= resolvedInterval) {
        applyPattern(idx++);
        lastTime = now;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isAnimating, patterns, resolvedInterval]);

  // Transition duration: slightly below the interval so transitions don't
  // stack up and create a paint backlog on iOS.
  const transitionMs = isAnimating
    ? Math.max(50, Math.round(resolvedInterval * 0.7))
    : 200;
  const transitionStyle = `opacity ${transitionMs}ms ease-in-out`;

  return (
    <div
      className={cn('flex items-center justify-center gap-7', className)}
      role="img"
      aria-label="Decorative lantern row"
    >
      {Array.from({ length: LIGHT_COUNT }, (_, i) => (
        <div key={i} className="relative w-5 h-5">
          {/* Always-visible OFF state — no src swap needed */}
          <img
            src={LIGHT_OFF}
            alt=""
            className="absolute inset-0 w-full h-full object-contain"
            aria-hidden
            draggable={false}
          />

          {/* ON state: fades in/out via opacity — GPU-compositable */}
          <img
            ref={el => { lightOnRefs.current[i] = el; }}
            src={LIGHT_ON}
            alt=""
            className="absolute inset-0 w-full h-full object-contain"
            aria-hidden
            draggable={false}
            style={{
              opacity: 0,
              willChange: 'opacity',
              WebkitTransition: transitionStyle,
              transition: transitionStyle,
            }}
          />

          {/* Glow overlay: opacity replaces box-shadow animation.
              box-shadow is never GPU-composited; opacity always is. */}
          <div
            ref={el => { glowRefs.current[i] = el; }}
            aria-hidden
            style={{
              position: 'absolute',
              inset: '-8px',
              borderRadius: '50%',
              pointerEvents: 'none',
              background:
                'radial-gradient(circle, rgba(255,227,194,0.85) 0%, rgba(255,176,81,0.55) 45%, transparent 70%)',
              opacity: 0,
              willChange: 'opacity',
              WebkitTransition: transitionStyle,
              transition: transitionStyle,
            }}
          />
        </div>
      ))}
    </div>
  );
}
