import { Sponsor } from "@/shared";
import { useState, useRef, useCallback, useEffect } from "react";

export const SCROLL_DURATION = 12000; // 12 seconds for slow, comfortable scroll
const MIN_COPIES = 15;

interface UseSponsorsScrollProps {
  sponsors: Sponsor[];
  onComplete?: () => void;
}

export function useSponsorsScroll({ sponsors, onComplete }: UseSponsorsScrollProps) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [completedSlots, setCompletedSlots] = useState<Set<number>>(new Set());
  const isScrollingRef = useRef(false);
  const hasStartedRef = useRef(false);

  const scrollRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  
  // Sync ref with state
  useEffect(() => {
    isScrollingRef.current = isScrolling;
  }, [isScrolling]);

  const getCardHeight = useCallback(() => {
    if (typeof window === "undefined") return 248;
    const width = window.innerWidth;
    if (width >= 1280) return 248;
    if (width >= 1024) return 220;
    if (width >= 768) return 198;
    if (width >= 640) return 176;
    return 154;
  }, []);

  const handleSlotComplete = useCallback(
    (slotIndex: number) => {
      setCompletedSlots((prev) => {
        const newSet = new Set(prev);
        newSet.add(slotIndex);

        if (newSet.size === 3) {
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            }
          }, 500);
        }

        return newSet;
      });
    },
    [onComplete]
  );

  const startScroll = useCallback(() => {
    if (isScrollingRef.current || sponsors.length === 0) return;

    setIsScrolling(true);
    isScrollingRef.current = true;
    setCompletedSlots(new Set());

    const CARD_HEIGHT = getCardHeight();

    // Each column starts at different sponsor index to show different brands
    const columnOffsets = [
      0, // First column starts at index 0
      Math.floor(sponsors.length / 3), // Second column offset
      Math.floor((sponsors.length * 2) / 3), // Third column offset
    ];

    // Reset slots with different starting positions
    scrollRefs.forEach((scrollRef, index) => {
      if (scrollRef.current) {
        const columnOffset = columnOffsets[index];
        scrollRef.current.style.transition = "none";
        scrollRef.current.style.transform = `translateY(-${columnOffset * CARD_HEIGHT}px)`;
      }
    });

    void document.body.offsetHeight;

    // Animate all slots to scroll through all sponsors simultaneously
    const minFullRotations = 2;
    const baseTotalSpins = minFullRotations * sponsors.length;

    scrollRefs.forEach((scrollRef, index) => {
      if (scrollRef.current) {
        // Each column has different starting offset
        const columnOffset = columnOffsets[index];
        const totalSpins = baseTotalSpins + columnOffset;
        const targetPosition = -(totalSpins * CARD_HEIGHT);

        const currentSlot = scrollRef.current;
        const handleTransitionEnd = (e: TransitionEvent) => {
          if (e.propertyName === "transform") {
            handleSlotComplete(index);
            currentSlot.removeEventListener("transitionend", handleTransitionEnd);
          }
        };

        // Start all animations at the same time
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.style.transition = `transform ${SCROLL_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            scrollRef.current.style.transform = `translateY(${targetPosition}px)`;
            scrollRef.current.addEventListener("transitionend", handleTransitionEnd);
          }
        }, 10); // Small delay to ensure DOM is ready, same for all columns
      }
    });

    setTimeout(() => {
      setIsScrolling(false);
      isScrollingRef.current = false;
    }, SCROLL_DURATION);
  }, [sponsors, handleSlotComplete, getCardHeight]);

  // Reset on mount to allow restart when component remounts
  useEffect(() => {
    hasStartedRef.current = false;
    setIsScrolling(false);
    isScrollingRef.current = false;
    setCompletedSlots(new Set());
    
    // Reset scroll positions
    scrollRefs.forEach((scrollRef) => {
      if (scrollRef.current) {
        scrollRef.current.style.transition = "none";
        scrollRef.current.style.transform = "translateY(0)";
      }
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      hasStartedRef.current = false;
      setIsScrolling(false);
      isScrollingRef.current = false;
      setCompletedSlots(new Set());
      scrollRefs.forEach((scrollRef) => {
        if (scrollRef.current) {
          scrollRef.current.style.transition = "none";
          scrollRef.current.style.transform = "translateY(0)";
        }
      });
    };
  }, []);

  // Auto-start - only once when component mounts
  useEffect(() => {
    // Reset flag on mount to allow restart
    hasStartedRef.current = false;
    
    if (sponsors.length === 0) return;
    
    // Wait for DOM to be ready and ensure refs are available
    const timer = setTimeout(() => {
      // Double check that refs are available and we haven't started yet
      const refsReady = scrollRefs.every(ref => ref.current !== null);
      if (!hasStartedRef.current && !isScrollingRef.current && refsReady) {
        hasStartedRef.current = true;
        startScroll();
      }
    }, 600);
    
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sponsors.length]);

  const extendedSponsors = Array(MIN_COPIES).fill(sponsors).flat();

  return {
    isScrolling,
    scrollRefs,
    extendedSponsors,
    startScroll,
  };
}

