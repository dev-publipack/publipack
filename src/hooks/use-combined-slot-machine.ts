import { Sponsor } from "@/shared";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useSlotAnimation } from "@/shared/hooks/use-slot-animation";
import { TIMING, GAME_RULES, EASING } from "@/shared/lib/game-config";

interface UseCombinedSlotMachineProps {
  sponsors: Sponsor[];
  onComplete?: (result: { winner: Sponsor | null; isWin: boolean }) => void;
  isCooldown?: boolean;
}

type AnimationPhase = 'sponsors' | 'slots' | 'complete';

export function useCombinedSlotMachine({ sponsors, onComplete, isCooldown = false }: UseCombinedSlotMachineProps) {
  const [phase, setPhase] = useState<AnimationPhase>('sponsors');
  const [isComplete, setIsComplete] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const spinResultRef = useRef<{ winner: Sponsor | null; isWin: boolean } | null>(null);

  // Calculate column offsets for sponsors phase to show different brands
  const columnOffsets = useMemo(() => [
    0,
    Math.floor(sponsors.length / 3),
    Math.floor((sponsors.length * 2) / 3),
  ], [sponsors.length]);

  const handleSponsorsComplete = useCallback(() => {
    // Transition to slots phase
    setPhase('slots');
  }, []);

  const handleSlotsComplete = useCallback(() => {
    setIsComplete(true);
    setPhase('complete');
    
    setTimeout(() => {
      if (onComplete && spinResultRef.current) {
        onComplete(spinResultRef.current);
      }
    }, TIMING.RESULT_DISPLAY_DELAY);
  }, [onComplete]);

  // Animation for sponsors phase (slow scroll)
  const sponsorsAnimation = useSlotAnimation({
    itemsCount: sponsors.length,
    onComplete: handleSponsorsComplete,
    config: {
      duration: TIMING.SCROLL_DURATION,
      easing: EASING.SCROLL,
      minRotations: GAME_RULES.SCROLL_MIN_ROTATIONS,
      columnOffsets,
    },
  });

  // Animation for slots phase (fast spin)
  const slotsAnimation = useSlotAnimation({
    itemsCount: sponsors.length,
    onComplete: handleSlotsComplete,
    config: {
      duration: TIMING.SPIN_DURATION,
      easing: EASING.SPIN,
      minRotations: GAME_RULES.MIN_FULL_ROTATIONS,
    },
  });

  const selectWinners = useCallback((winResult: boolean): number[] => {
    if (winResult) {
      const winningSponsorIndex = Math.floor(Math.random() * sponsors.length);
      return [winningSponsorIndex, winningSponsorIndex, winningSponsorIndex];
    }

    const selected: number[] = [];
    const availableIndices = Array.from({ length: sponsors.length }, (_, i) => i);

    while (selected.length < 3) {
      const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      if (!selected.includes(randomIndex)) {
        selected.push(randomIndex);
      }
    }

    return selected;
  }, [sponsors.length]);

  // Reset state when cooldown changes
  useEffect(() => {
    if (isCooldown) {
      // Reset state when entering cooldown
      setHasStarted(false);
      setPhase('sponsors');
      setIsComplete(false);
      sponsorsAnimation.resetSlots();
      slotsAnimation.resetSlots();
    }
  }, [isCooldown, sponsorsAnimation, slotsAnimation]);

  // Start sponsors animation on mount (only if not in cooldown)
  useEffect(() => {
    if (isCooldown || hasStarted) {
      // Don't start animation if in cooldown or already started
      return;
    }

    const timer = setTimeout(() => {
      if (sponsors.length > 0) {
        setHasStarted(true);
        sponsorsAnimation.startAnimation();
      }
    }, TIMING.AUTO_SPIN_DELAY);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCooldown, hasStarted]);

  // Start slots animation when phase changes to 'slots'
  useEffect(() => {
    if (phase === 'slots' && sponsors.length > 0) {
      const winResult = Math.random() < GAME_RULES.WIN_PROBABILITY;
      setIsWin(winResult);

      const winners = selectWinners(winResult);
      spinResultRef.current = {
        winner: winResult ? sponsors[winners[0]] : null,
        isWin: winResult,
      };

      // Small delay before starting slots animation
      const timer = setTimeout(() => {
        slotsAnimation.startAnimation(winners);
      }, 100);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const extendedSponsors = useMemo(
    () => Array(GAME_RULES.MIN_SLOT_COPIES).fill(sponsors).flat(),
    [sponsors]
  );

  // Get active refs based on current phase
  const activeRefs = phase === 'sponsors' ? sponsorsAnimation.scrollRefs : slotsAnimation.scrollRefs;
  const isAnimating = sponsorsAnimation.isAnimating || slotsAnimation.isAnimating;

  return {
    phase,
    isAnimating,
    isComplete,
    isWin,
    hasStarted,
    scrollRefs: activeRefs,
    extendedSponsors,
    totalDuration: TIMING.COMBINED_DURATION,
    sponsorsDuration: TIMING.SCROLL_DURATION,
    slotsDuration: TIMING.SPIN_DURATION,
  };
}

