/**
 * Glow pattern definitions for lantern row animation.
 * DESIGN_SPEC: glow rgba(255,227,194,0.55), rgba(255,176,81,0.4)
 */

/** Chase: single lit position moving left-to-right then reset */
export const CHASE_PATTERNS: boolean[][] = [
  [true, false, false, false, false],
  [false, true, false, false, false],
  [false, false, true, false, false],
  [false, false, false, true, false],
  [false, false, false, false, true],
  [false, false, false, false, false],
];

/** Winner: all blink (all on / all off) */
export const BLINK_PATTERNS: boolean[][] = [
  [true, true, true, true, true],
  [false, false, false, false, false],
];

/** Loser: slow fade from all on to off */
export const FADE_PATTERNS: boolean[][] = [
  [true, true, true, true, true],
  [true, true, true, true, false],
  [true, true, true, false, false],
  [true, true, false, false, false],
  [true, false, false, false, false],
  [false, false, false, false, false],
];

/** Loser: all off (static) */
export const OFF_PATTERN: boolean[] = [false, false, false, false, false];
