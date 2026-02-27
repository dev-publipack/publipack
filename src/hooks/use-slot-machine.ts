import { Sponsor } from "@/shared";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import gsap from "gsap";
import {
  TIMING,
  GAME_RULES,
  SLOT_CARD_HEIGHT,
  SLOT_VISIBLE_CARDS,
} from "@/shared/lib/game-config";

// Force translate3d on all tweens — iOS Safari degrades to 2D otherwise.
gsap.config({ force3D: true });

// Disable lag-smoothing catch-up: when iOS throttles rAF (background tab,
// scroll, or any interruption), GSAP normally fast-forwards to compensate
// — that produces the "1 frame then jump" effect. Setting 0 keeps the
// timeline running at real-time without catch-up jumps.
gsap.ticker.lagSmoothing(0);

type Phase = "sponsors" | "slots" | "complete";

interface UseSlotMachineProps {
  sponsors: Sponsor[];
  onComplete?: (result: { winner: Sponsor | null; isWin: boolean }) => void;
  autoStart?: boolean;
  onAutoSpinStarted?: () => void;
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

  // Pre-position columns at their staggered offsets on mount.
  // Without this, gsap.fromTo in runSponsorsScroll snaps columns 1 and 2
  // to startY on the first frame (visible as a jump).
  // Also set willChange here — after gsap.set applies the initial 3D transform,
  // iOS pre-rasterises the layers in idle time (600ms before autoStart fires),
  // so the first animation frame starts without a rasterisation freeze.
  useEffect(() => {
    spinRefs.forEach((scrollRef, index) => {
      if (!scrollRef.current) return;
      const offset = columnOffsets[index];
      gsap.set(scrollRef.current, {
        y: -(offset * SLOT_CARD_HEIGHT),
        force3D: true,
      });
      scrollRef.current.style.willChange = 'transform';
    });
  }, [spinRefs, columnOffsets]);

  // Pause GSAP when iOS hides the page (background tab / home button).
  // Without this, GSAP fast-forwards on resume → instant jump to end frame.
  useEffect(() => {
    const onVisibilityChange = () => {
      document.hidden
        ? gsap.globalTimeline.pause()
        : gsap.globalTimeline.resume();
    };
    const onPageHide = () => gsap.globalTimeline.pause();
    const onPageShow = () => gsap.globalTimeline.resume();

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onPageShow);
      spinRefs.forEach((r) => {
        if (r.current) gsap.killTweensOf(r.current);
      });
    };
  }, [spinRefs]);

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

    const duration = (TIMING.SPONSORS_SCROLL_DURATION ?? 5000) / 1000;
    const lastIndex = spinRefs.length - 1;

    spinRefs.forEach((scrollRef, index) => {
      if (!scrollRef.current) return;

      const offset = columnOffsets[index];
      const totalSpins = GAME_RULES.SCROLL_MIN_ROTATIONS * sponsors.length + offset;
      const startY = -(offset * SLOT_CARD_HEIGHT);
      const endY = -(totalSpins * SLOT_CARD_HEIGHT);

      gsap.killTweensOf(scrollRef.current);
      gsap.fromTo(
        scrollRef.current,
        { y: startY },
        {
          y: endY,
          duration,
          ease: "power1.inOut",
          overwrite: true,
          force3D: true,
          // Use GSAP onComplete instead of a parallel setTimeout to eliminate
          // the race condition where iOS slower timers trigger runSpin before
          // the scroll tween finishes.
          ...(index === lastIndex && {
            onComplete: () => {
              setPhase("slots");
            },
          }),
        }
      );
    });
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
    const baseDuration = (TIMING.SPIN_DURATION || 7000) / 1000;
    const slotDurations = [
      baseDuration,
      baseDuration + 0.3,
      baseDuration + 0.6,
    ];

    spinRefs.forEach((scrollRef, index) => {
      if (!scrollRef.current) return;

      const targetIndex = winners[index];
      const extraSpins = Math.floor(Math.random() * 3);
      const MIN_SPINS = GAME_RULES.MIN_FULL_ROTATIONS || 3;
      const totalSpins =
        (MIN_SPINS + extraSpins) * sponsors.length + targetIndex - CENTER_OFFSET;
      const endY = -(totalSpins * SLOT_CARD_HEIGHT);

      if (!scrollRef.current) return;
      // gsap.to from CURRENT position — no backward snap.
      // Using gsap delay instead of setTimeout: GSAP delay is tied to the
      // internal rAF ticker and is reliable on iOS; setTimeout can be
      // throttled during heavy rendering.
      gsap.to(scrollRef.current, {
        y: endY,
        duration: slotDurations[index],
        ease: "power4.out",
        overwrite: true,
        force3D: true,
        delay: index * 0.05,
      });
    });

    const maxDurationMs = Math.max(...slotDurations) * 1000;
    const settleDelay = TIMING.SPIN_SETTLE_DELAY ?? 400;

    // gsap.delayedCall is rAF-synced and respects globalTimeline pause/resume,
    // so it survives iOS background-tab throttling that would stall setTimeout.
    gsap.delayedCall((maxDurationMs + settleDelay) / 1000, () => {
      setIsSpinning(false);
      setIsComplete(true);
      setPhase("complete");

      // Release GPU layers after reels stop — holding willChange wastes
      // compositor memory when nothing is animating.
      spinRefs.forEach((r) => {
        if (r.current) r.current.style.willChange = "auto";
      });

      if (onComplete && spinResultRef.current) {
        gsap.delayedCall((TIMING.RESULT_DISPLAY_DELAY || 500) / 1000, () => {
          onComplete(spinResultRef.current!);
        });
      }
    });
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

    // User tapped "spin" mid-scroll: kill all scroll tweens and jump to spin phase.
    // sponsorsScrollTimeoutRef is no longer used for phase transition (moved to
    // GSAP onComplete), so we just kill tweens to skip ahead.
    spinRefs.forEach((r) => {
      if (r.current) gsap.killTweensOf(r.current);
    });
    setPhase("slots");
  }, [phase, sponsors.length, runSponsorsScroll, spinRefs]);

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
    hasStarted,
    spinRefs,
    startSpin,
  };
}
