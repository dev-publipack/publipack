import { useState, useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { useResponsiveCardHeight } from './use-responsive-card-height';

interface SlotConfig {
  duration: number;
  easing: string;
  minRotations: number;
  columnOffsets?: number[];
}

interface UseSlotAnimationProps {
  itemsCount: number;
  onComplete?: () => void;
  config: SlotConfig;
}

interface SlotAnimationResult {
  isAnimating: boolean;
  completedSlots: Set<number>;
  scrollRefs: React.RefObject<HTMLDivElement | null>[];
  startAnimation: (targetIndices?: number[]) => void;
  resetSlots: () => void;
}

/**
 * Shared hook for slot-based animations (carousel scroll and slot machine spin).
 * Uses GSAP for reliable cross-browser animation including Safari WebKit.
 */
export function useSlotAnimation({
  itemsCount,
  onComplete,
  config,
}: UseSlotAnimationProps): SlotAnimationResult {
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedSlots, setCompletedSlots] = useState<Set<number>>(new Set());
  const isAnimatingRef = useRef(false);
  const { getCardHeight } = useResponsiveCardHeight();

  const scrollRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

  // Kill all GSAP tweens on unmount
  useEffect(() => {
    return () => {
      scrollRefs.forEach((r) => {
        if (r.current) gsap.killTweensOf(r.current);
      });
      setIsAnimating(false);
      isAnimatingRef.current = false;
      setCompletedSlots(new Set());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSlotComplete = useCallback(
    (slotIndex: number) => {
      setCompletedSlots((prev) => {
        const newSet = new Set(prev);
        newSet.add(slotIndex);
        if (newSet.size === 3 && onComplete) {
          setTimeout(onComplete, 500);
        }
        return newSet;
      });
    },
    [onComplete]
  );

  const resetSlots = useCallback(() => {
    scrollRefs.forEach((scrollRef, index) => {
      if (scrollRef.current) {
        const columnOffset = config.columnOffsets?.[index] || 0;
        const cardHeight = getCardHeight();
        gsap.killTweensOf(scrollRef.current);
        gsap.set(scrollRef.current, { y: -(columnOffset * cardHeight) });
      }
    });
  }, [config.columnOffsets, getCardHeight]);

  const startAnimation = useCallback(
    (targetIndices?: number[]) => {
      if (isAnimatingRef.current || itemsCount === 0) return;

      setIsAnimating(true);
      isAnimatingRef.current = true;
      setCompletedSlots(new Set());

      const CARD_HEIGHT = getCardHeight();
      const columnOffsets = config.columnOffsets || [0, 0, 0];
      const durationSec = config.duration / 1000;

      scrollRefs.forEach((scrollRef, index) => {
        if (!scrollRef.current) return;

        const columnOffset = columnOffsets[index];
        const targetIndex = targetIndices?.[index] || 0;
        const totalSpins = config.minRotations * itemsCount + columnOffset + targetIndex;
        const startY = -(columnOffset * CARD_HEIGHT);
        const endY = -(totalSpins * CARD_HEIGHT);

        gsap.killTweensOf(scrollRef.current);
        gsap.fromTo(
          scrollRef.current,
          { y: startY },
          {
            y: endY,
            duration: durationSec,
            ease: 'power1.inOut',
            overwrite: true,
            force3D: true,
            onComplete: () => handleSlotComplete(index),
          }
        );
      });

      setTimeout(() => {
        setIsAnimating(false);
        isAnimatingRef.current = false;
      }, config.duration + 100);
    },
    [itemsCount, config, handleSlotComplete, getCardHeight]
  );

  return {
    isAnimating,
    completedSlots,
    scrollRefs,
    startAnimation,
    resetSlots,
  };
}
