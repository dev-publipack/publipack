/**
 * Type definitions for Publipacks V2
 *
 * Based on new design specification
 * @see docs/DESIGN_SPEC.md
 */

/**
 * Game Screen States
 *
 * BEGIN - initial screen with spinner
 * WIN - win screen
 * CLAIM - form to claim prize
 * CLAIMED - prize claimed
 * LOOSE - loss
 */
export type GameScreen = 'BEGIN' | 'WIN' | 'CLAIM' | 'CLAIMED' | 'LOOSE';

/**
 * Offer on Spinner
 *
 * Represents offer in one of 9 spinner sectors
 */
export interface Offer {
  id: string;
  text: string;
  discount?: string;
  brand?: string;
}

/**
 * Prize Information
 *
 * Detailed info about won prize
 */
export interface Prize {
  discount: string;
  brand: string;
  description: string;
  code?: string;
}

/**
 * Claim Form Data
 *
 * Form data for claiming prize
 */
export interface ClaimFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/**
 * Game State
 *
 * Full game state
 */
export interface GameState {
  screen: GameScreen;
  prize: Prize | null;
  isSpinning: boolean;
  canSpin: boolean;
  timeUntilNextSpin: number;
  hasWon: boolean;
}

/**
 * Popup Notification
 *
 * Popup about another player's win
 */
export interface PopupNotification {
  id: string;
  username: string;
  prize: string;
  timestamp: number;
}

/**
 * Timer State
 *
 * Timer state for CLAIMED and LOOSE screens
 */
export interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
  isActive: boolean;
}

/**
 * Animation State
 *
 * Animation state (lights, rotation)
 */
export interface AnimationState {
  lightsPattern: boolean[];
  rotation: number;
  isAnimating: boolean;
}

/**
 * Design Tokens
 *
 * Constants from design spec (for reference)
 */
export const DESIGN_TOKENS = {
  colors: {
    background: '#8FCCEA',
    accent: '#72C2F0',
    stroke: '#BDE2F4',
    pinkLight: '#FFD7EB',
    pinkBright: '#FFA2DC',
    cream: '#FFEDD9',
    orange: '#FF8B00',
    orangeLight: '#FFE7CA',
    greenButton: '#AEFB8B',
    greenStroke: '#DCF7CD',
    blueText: '#BBE3F2',
    blueDark: '#2066BB',
    grayLight: '#F2EBEE',
    grayPlaceholder: '#B3B3B3',
  },
  fonts: {
    bungee: 'Bungee',
    roboto: 'Roboto',
  },
  sizes: {
    header: { width: 282, height: 65 },
    machineDefault: { width: 358, height: 281 },
    machineExpanded: { width: 358, height: 398 },
    spinner: { width: 336, height: 219 },
    button: { width: 282, height: 58 },
    light: 20,
    chain: { width: 23, height: 108 },
  },
  borderRadius: {
    header: '40px 40px 20px 20px',
    machine: '70px',
    spinner: '60px',
    button: '20px',
    popup: '15px',
    input: '5px',
  },
} as const;
