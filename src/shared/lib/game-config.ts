// Game timing configuration
export const TIMING = {
  SPIN_DURATION: 7000, // Fast slot spin duration
  SCROLL_DURATION: 7000, // Sponsors scroll duration
  COMBINED_DURATION: 14000, // Total duration (7s sponsors + 7s slots)
  RESULT_DISPLAY_DELAY: 1500,
  COUNTDOWN_INITIAL: 5,
  AUTO_SPIN_DELAY: 600,
  TRANSITION_DELAY: 200,
  DOM_READY_DELAY: 10,
  SUCCESS_SCREEN_DELAY: 500,
} as const;

// Game rules configuration
export const GAME_RULES = {
  MAX_ATTEMPTS: 3,
  MIN_SLOT_COPIES: 15,
  MIN_FULL_ROTATIONS: 7,
  SCROLL_MIN_ROTATIONS: 2,
  WIN_PROBABILITY: 0.5,
} as const;

// Responsive card heights for different breakpoints
export const CARD_HEIGHTS = {
  xs: 154, // < 640px
  sm: 176, // >= 640px
  md: 198, // >= 768px
  lg: 220, // >= 1024px
  xl: 248, // >= 1280px
} as const;

// Breakpoints matching Tailwind config
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

// Animation timing functions
export const EASING = {
  SPIN: 'cubic-bezier(0.15, 0.35, 0.25, 0.85)',
  SCROLL: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
} as const;

