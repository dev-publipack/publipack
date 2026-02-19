import { Sponsor } from "@/shared";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { TIMING, GAME_RULES, SLOT_CARD_HEIGHT, SLOT_VISIBLE_CARDS } from "@/shared/lib/game-config";

interface UseSlotMachineProps {
  sponsors: Sponsor[];
  onComplete?: (result: { winner: Sponsor | null; isWin: boolean }) => void;
  autoStart?: boolean;
  /** Called when auto-start spin has been triggered (to reset parent state) */
  onAutoSpinStarted?: () => void;
}

export function useSlotMachine({
  sponsors,
  onComplete,
  autoStart = false,
  onAutoSpinStarted,
}: UseSlotMachineProps) {
  const [isComplete, setIsComplete] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinResultRef = useRef<{ winner: Sponsor | null; isWin: boolean } | null>(null);

  const spinRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const selectWinners = useCallback((winResult: boolean): number[] => {
    if (winResult) {
      const winningSponsorIndex = Math.floor(Math.random() * sponsors.length);
      return [winningSponsorIndex, winningSponsorIndex, winningSponsorIndex];
    }

    // Гарантируем что все 3 индекса разные
    const len = sponsors.length;
    if (len === 1) return [0, 0, 0]; // единственный вариант

    if (len === 2) {
      // Только два варианта — хотя бы два барабана разные
      return [0, 1, 0];
    }

    // len >= 3: выбираем 3 уникальных индекса без повторений
    const shuffled = Array.from({ length: len }, (_, i) => i)
      .sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1], shuffled[2]];
  }, [sponsors.length]);

  const startSpin = useCallback(() => {
    if (isSpinning || sponsors.length === 0) return;

    setIsComplete(false);
    setHasStarted(true);
    setIsSpinning(true);

    const winResult = Math.random() < GAME_RULES.WIN_PROBABILITY;
    setIsWin(winResult);

    const winners = selectWinners(winResult);
    spinResultRef.current = {
      winner: winResult ? sponsors[winners[0]] : null,
      isWin: winResult,
    };

    const CENTER_OFFSET = Math.floor(SLOT_VISIBLE_CARDS / 2);
    const MIN_SPINS = GAME_RULES.MIN_FULL_ROTATIONS || 3;

    const slotDurations = [
      TIMING.SPIN_DURATION || 7000,
      (TIMING.SPIN_DURATION || 7000) + 300,
      (TIMING.SPIN_DURATION || 7000) + 600,
    ];

    spinRefs.forEach((scrollRef, index) => {
      if (scrollRef.current) {
        const randomStartOffset = Math.floor(Math.random() * sponsors.length);

        scrollRef.current.style.transition = 'none';
        scrollRef.current.style.transform = `translateY(-${randomStartOffset * SLOT_CARD_HEIGHT}px)`;

        void scrollRef.current.offsetHeight;

        const targetIndex = winners[index];
        const extraSpins = Math.floor(Math.random() * 3);

        // randomStartOffset NOT included — it only affects the visual start,
        // not where the reel lands. Middle card = totalSpins + 1 = targetIndex (mod len).
        const totalSpins =
          (MIN_SPINS + extraSpins) * sponsors.length +
          targetIndex -
          CENTER_OFFSET;
        const targetPosition = -(totalSpins * SLOT_CARD_HEIGHT);

        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.style.transition = `transform ${slotDurations[index]}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
            scrollRef.current.style.transform = `translateY(${targetPosition}px)`;
          }
        }, 50);
      }
    });

    const maxDuration = Math.max(...slotDurations);
    setTimeout(() => {
      setIsSpinning(false);
      setIsComplete(true);

      setTimeout(() => {
        if (onComplete && spinResultRef.current) {
          onComplete(spinResultRef.current);
        }
      }, TIMING.RESULT_DISPLAY_DELAY || 500);
    }, maxDuration);

  }, [isSpinning, sponsors, selectWinners, onComplete]);

  useEffect(() => {
    if (!autoStart || hasStarted) return;

    const timer = setTimeout(() => {
      startSpin();
      onAutoSpinStarted?.();
    }, 500);
    return () => clearTimeout(timer);
  }, [autoStart, hasStarted, startSpin, onAutoSpinStarted]);

  const extendedSponsors = useMemo(
    () => Array(GAME_RULES.MIN_SLOT_COPIES || 5).fill(sponsors).flat(),
    [sponsors]
  );

  return {
    isSpinning,
    isComplete,
    isWin,
    spinRefs,
    extendedSponsors,
    startSpin,
  };
}