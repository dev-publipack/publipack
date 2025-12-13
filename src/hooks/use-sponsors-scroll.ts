import { Sponsor } from "@/shared";
import { useRef, useEffect, useMemo } from "react";
import { useSlotAnimation } from "@/shared/hooks/use-slot-animation";
import { TIMING, GAME_RULES, EASING } from "@/shared/lib/game-config";

export const SCROLL_DURATION = TIMING.SCROLL_DURATION;

interface UseSponsorsScrollProps {
  sponsors: Sponsor[];
  onComplete?: () => void;
  onLoadingChange?: (isLoading: boolean) => void;
  duration?: number; // Optional custom duration for slow scrolling
}

export function useSponsorsScroll({ sponsors, onComplete, onLoadingChange, duration }: UseSponsorsScrollProps) {
  const hasStartedRef = useRef(false);
  
  // Calculate column offsets to show different brands in each column
  const columnOffsets = useMemo(() => [
    0,
    Math.floor(sponsors.length / 3),
    Math.floor((sponsors.length * 2) / 3),
  ], [sponsors.length]);

  const animation = useSlotAnimation({
    itemsCount: sponsors.length,
    onComplete,
    config: {
      duration: duration ?? TIMING.SCROLL_DURATION,
      easing: EASING.SCROLL,
      minRotations: GAME_RULES.SCROLL_MIN_ROTATIONS,
      columnOffsets,
    },
  });

  // Sync loading state immediately when animation state changes
  useEffect(() => {
    onLoadingChange?.(animation.isAnimating);
  }, [animation.isAnimating, onLoadingChange]);

  // Reset on mount
  useEffect(() => {
    hasStartedRef.current = false;
    animation.resetSlots();
  }, []);

  // Auto-start when ready
  useEffect(() => {
    if (sponsors.length === 0 || hasStartedRef.current) return;

    const timer = setTimeout(() => {
      const refsReady = animation.scrollRefs.every(ref => ref.current !== null);
      if (!hasStartedRef.current && !animation.isAnimating && refsReady) {
        hasStartedRef.current = true;
        animation.startAnimation();
      }
    }, TIMING.AUTO_SPIN_DELAY);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sponsors.length]);

  const extendedSponsors = useMemo(
    () => Array(GAME_RULES.MIN_SLOT_COPIES).fill(sponsors).flat(),
    [sponsors]
  );

  return {
    isScrolling: animation.isAnimating,
    scrollRefs: animation.scrollRefs,
    extendedSponsors,
    startScroll: animation.startAnimation,
  };
}

