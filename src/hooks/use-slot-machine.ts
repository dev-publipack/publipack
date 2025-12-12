import { Sponsor } from "@/shared";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useSlotAnimation } from "@/shared/hooks/use-slot-animation";
import { TIMING, GAME_RULES, EASING } from "@/shared/lib/game-config";

interface UseSlotMachineProps {
  sponsors: Sponsor[];
  onComplete?: (result: { winner: Sponsor | null; isWin: boolean }) => void;
}

export function useSlotMachine({ sponsors, onComplete }: UseSlotMachineProps) {
  const [isComplete, setIsComplete] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const spinResultRef = useRef<{ winner: Sponsor | null; isWin: boolean } | null>(null);

  const handleSlotAnimationComplete = useCallback(() => {
    setIsComplete(true);
    
    setTimeout(() => {
      if (onComplete && spinResultRef.current) {
        onComplete(spinResultRef.current);
      }
    }, TIMING.RESULT_DISPLAY_DELAY);
  }, [onComplete]);

  const animation = useSlotAnimation({
    itemsCount: sponsors.length,
    onComplete: handleSlotAnimationComplete,
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

  const startSpin = useCallback(() => {
    if (animation.isAnimating || sponsors.length === 0) return;

    setIsComplete(false);
    const winResult = Math.random() < GAME_RULES.WIN_PROBABILITY;
    setIsWin(winResult);

    const winners = selectWinners(winResult);
    spinResultRef.current = {
      winner: winResult ? sponsors[winners[0]] : null,
      isWin: winResult,
    };

    animation.startAnimation(winners);
  }, [animation, sponsors, selectWinners]);

  // Auto-start on mount
  useEffect(() => {
    const timer = setTimeout(startSpin, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const extendedSponsors = useMemo(
    () => Array(GAME_RULES.MIN_SLOT_COPIES).fill(sponsors).flat(),
    [sponsors]
  );

  return {
    isSpinning: animation.isAnimating,
    isComplete,
    isWin,
    spinRefs: animation.scrollRefs,
    extendedSponsors,
    startSpin,
  };
}