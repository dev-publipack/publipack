import { Sponsor } from "@/shared";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  TIMING,
  GAME_RULES,
  EASING,
  SLOT_CARD_HEIGHT,
  SLOT_VISIBLE_CARDS,
} from "@/shared/lib/game-config";

type Phase = "sponsors" | "slots" | "complete";

interface UseSlotMachineProps {
  sponsors: Sponsor[];
  onComplete?: (result: { winner: Sponsor | null; isWin: boolean }) => void;
  autoStart?: boolean;
  onAutoSpinStarted?: () => void;
}

function applyTransformWithReset(
  el: HTMLDivElement,
  resetTransform: string,
  animationTransform: string,
  transitionStyle: string
) {
  el.style.transition = "none";
  el.style.transform = resetTransform;


  el.offsetHeight;


  requestAnimationFrame(() => {
    el.style.transition = transitionStyle;
    el.style.transform = animationTransform;
  });
}

export function useSlotMachine({
  sponsors,
  onComplete,
  autoStart = false,
  onAutoSpinStarted,
}: UseSlotMachineProps) {
  const [phase, setPhase] = useState<Phase>("sponsors");
  const [isComplete, setIsComplete] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinResultRef = useRef<{ winner: Sponsor | null; isWin: boolean } | null>(null);
  const sponsorsScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasStartedRef = useRef(false);
  const spinStartedRef = useRef(false);

  const ref0 = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const spinRefs = useMemo(() => [ref0, ref1, ref2], []);

  const columnOffsets = useMemo(
    () => [
      0,
      Math.floor(sponsors.length / 3),
      Math.floor((sponsors.length * 2) / 3),
    ],
    [sponsors.length]
  );

  const selectWinners = useCallback((winResult: boolean): number[] => {
    if (winResult) {
      const winningSponsorIndex = Math.floor(Math.random() * sponsors.length);
      return [winningSponsorIndex, winningSponsorIndex, winningSponsorIndex];
    }

    const len = sponsors.length;
    if (len === 1) return [0, 0, 0];
    if (len === 2) return [0, 1, 0];

    const shuffled = Array.from({ length: len }, (_, i) => i)
      .sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1], shuffled[2]];
  }, [sponsors.length]);

  const runSponsorsScroll = useCallback(() => {
    if (sponsors.length === 0 || hasStartedRef.current) return;
    hasStartedRef.current = true;

    setHasStarted(true);
    setIsSpinning(true);

    const duration = TIMING.SPONSORS_SCROLL_DURATION ?? 5000;

    spinRefs.forEach((scrollRef, index) => {
      if (!scrollRef.current) return;

      const offset = columnOffsets[index];
      const totalSpins = GAME_RULES.SCROLL_MIN_ROTATIONS * sponsors.length + offset;
      const targetPosition = -(totalSpins * SLOT_CARD_HEIGHT);

      applyTransformWithReset(
        scrollRef.current,
        `translate3d(0, -${offset * SLOT_CARD_HEIGHT}px, 0)`,
        `translate3d(0, ${targetPosition}px, 0)`,
        `transform ${duration}ms ${EASING.SCROLL}`
      );
    });

    sponsorsScrollTimeoutRef.current = setTimeout(() => {
      sponsorsScrollTimeoutRef.current = null;
      setPhase("slots");
    }, duration + 100);
  }, [sponsors.length, columnOffsets, spinRefs]);

  const runSpin = useCallback(() => {
    if (sponsors.length === 0 || spinStartedRef.current) return;
    spinStartedRef.current = true;

    const winResult = Math.random() < GAME_RULES.WIN_PROBABILITY;
    setIsWin(winResult);

    const winners = selectWinners(winResult);
    spinResultRef.current = {
      winner: winResult ? sponsors[winners[0]] : null,
      isWin: winResult,
    };

    const CENTER_OFFSET = Math.floor(SLOT_VISIBLE_CARDS / 2);
    const baseDuration = TIMING.SPIN_DURATION || 7000;
    const slotDurations = [
      baseDuration,
      baseDuration + 300,
      baseDuration + 600,
    ];

    spinRefs.forEach((scrollRef, index) => {
      if (!scrollRef.current) return;

      const randomStartOffset = Math.floor(Math.random() * sponsors.length);
      const targetIndex = winners[index];
      const extraSpins = Math.floor(Math.random() * 3);
      const MIN_SPINS = GAME_RULES.MIN_FULL_ROTATIONS || 3;
      const totalSpins =
        (MIN_SPINS + extraSpins) * sponsors.length + targetIndex - CENTER_OFFSET;
      const targetPosition = -(totalSpins * SLOT_CARD_HEIGHT);

      // Небольшая задержка между колонками через setTimeout,
      // но сама анимация стартует через applyTransformWithReset (без вложенных rAF)
      const delay = index * 50;

      const startColumnSpin = () => {
        if (!scrollRef.current) return;
        applyTransformWithReset(
          scrollRef.current,
          `translate3d(0, -${randomStartOffset * SLOT_CARD_HEIGHT}px, 0)`,
          `translate3d(0, ${targetPosition}px, 0)`,
          `transform ${slotDurations[index]}ms cubic-bezier(0.25, 0.1, 0.25, 1)`
        );
      };

      if (delay > 0) {
        setTimeout(startColumnSpin, delay);
      } else {
        startColumnSpin();
      }
    });

    const maxDuration = Math.max(...slotDurations);
    const settleDelay = TIMING.SPIN_SETTLE_DELAY ?? 400;

    setTimeout(() => {
      setIsSpinning(false);
      setIsComplete(true);
      setPhase("complete");

      setTimeout(() => {
        if (onComplete && spinResultRef.current) {
          onComplete(spinResultRef.current);
        }
      }, TIMING.RESULT_DISPLAY_DELAY || 500);
    }, maxDuration + settleDelay);
  }, [sponsors, selectWinners, onComplete, spinRefs]);

  useEffect(() => {
    if (phase !== "slots" || sponsors.length === 0) return;

    const timer = setTimeout(() => runSpin(), 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, sponsors.length]);

  const startSpin = useCallback(() => {
    if (phase !== "sponsors" || sponsors.length === 0) return;

    if (!hasStartedRef.current) {
      runSponsorsScroll();
      return;
    }

    if (sponsorsScrollTimeoutRef.current) {
      clearTimeout(sponsorsScrollTimeoutRef.current);
      sponsorsScrollTimeoutRef.current = null;
    }
    setPhase("slots");
  }, [phase, sponsors.length, runSponsorsScroll]);

  useEffect(() => {
    if (!autoStart || hasStartedRef.current) return;

    const timer = setTimeout(() => {
      runSponsorsScroll();
      onAutoSpinStarted?.();
    }, TIMING.AUTO_SPIN_DELAY);
    return () => clearTimeout(timer);
  }, [autoStart, runSponsorsScroll, onAutoSpinStarted]);

  const isAnimating = phase === "sponsors" || phase === "slots";

  return {
    phase,
    isSpinning: isAnimating,
    isComplete,
    isWin,
    spinRefs,
    startSpin,
  };
}