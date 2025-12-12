import { useState, useRef, useCallback, useEffect } from 'react';
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
 * Shared hook for slot-based animations (both carousel scroll and slot machine spin)
 * Eliminates duplication between use-sponsors-scroll and use-slot-machine
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

  // Sync ref with state
  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);

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
        scrollRef.current.style.transition = 'none';
        scrollRef.current.style.transform = `translateY(-${columnOffset * cardHeight}px)`;
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

      // Reset with column offsets
      scrollRefs.forEach((scrollRef, index) => {
        if (scrollRef.current) {
          const columnOffset = columnOffsets[index];
          scrollRef.current.style.transition = 'none';
          scrollRef.current.style.transform = `translateY(-${columnOffset * CARD_HEIGHT}px)`;
        }
      });

      // Force reflow
      void document.body.offsetHeight;

      // Animate each slot
      scrollRefs.forEach((scrollRef, index) => {
        if (scrollRef.current) {
          const columnOffset = columnOffsets[index];
          const targetIndex = targetIndices?.[index] || 0;
          const totalSpins = config.minRotations * itemsCount + columnOffset + targetIndex;
          const targetPosition = -(totalSpins * CARD_HEIGHT);

          const currentSlot = scrollRef.current;
          const handleTransitionEnd = (e: TransitionEvent) => {
            if (e.propertyName === 'transform') {
              handleSlotComplete(index);
              currentSlot.removeEventListener('transitionend', handleTransitionEnd);
            }
          };

          setTimeout(() => {
            if (scrollRef.current) {
              scrollRef.current.style.transition = `transform ${config.duration}ms ${config.easing}`;
              scrollRef.current.style.transform = `translateY(${targetPosition}px)`;
              scrollRef.current.addEventListener('transitionend', handleTransitionEnd);
            }
          }, 10);
        }
      });

      setTimeout(() => {
        setIsAnimating(false);
        isAnimatingRef.current = false;
      }, config.duration);
    },
    [itemsCount, config, handleSlotComplete, getCardHeight]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsAnimating(false);
      isAnimatingRef.current = false;
      setCompletedSlots(new Set());
      scrollRefs.forEach((scrollRef) => {
        if (scrollRef.current) {
          scrollRef.current.style.transition = 'none';
          scrollRef.current.style.transform = 'translateY(0)';
        }
      });
    };
  }, []);

  return {
    isAnimating,
    completedSlots,
    scrollRefs,
    startAnimation,
    resetSlots,
  };
}

