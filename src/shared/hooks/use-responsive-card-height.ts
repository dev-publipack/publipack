import { useCallback } from 'react';
import { CARD_HEIGHTS, BREAKPOINTS } from '../lib/game-config';

/**
 * Hook for getting responsive card height based on window width
 * Centralizes breakpoint logic to avoid duplication
 */
export function useResponsiveCardHeight() {
  const getCardHeight = useCallback((): number => {
    if (typeof window === 'undefined') return CARD_HEIGHTS.xl;
    
    const width = window.innerWidth;
    
    if (width >= BREAKPOINTS.xl) return CARD_HEIGHTS.xl;
    if (width >= BREAKPOINTS.lg) return CARD_HEIGHTS.lg;
    if (width >= BREAKPOINTS.md) return CARD_HEIGHTS.md;
    if (width >= BREAKPOINTS.sm) return CARD_HEIGHTS.sm;
    
    return CARD_HEIGHTS.xs;
  }, []);

  return { getCardHeight };
}

