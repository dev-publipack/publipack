// UI Components
export { Button, buttonVariants } from './ui/button';
export type { ButtonProps } from './ui/button';
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card';
export { Input } from './ui/input';
export type { InputProps } from './ui/input';
export { RewardCard } from './ui/reward-card';
export type { RewardCardProps } from './ui/reward-card';
export { CountdownTimer } from './ui/countdown-timer';
export type { CountdownTimerProps } from './ui/countdown-timer';
export { WheelOfFortune } from './ui/wheel-of-fortune';
export type { WheelOfFortuneProps } from './ui/wheel-of-fortune';
export { SlotMachine } from './ui/slot-machine';
export type { SlotMachineProps, SlotMachineRef } from './ui/slot-machine';
export { CombinedSlotMachine } from './ui/combined-slot-machine';
export type { CombinedSlotMachineProps } from './ui/combined-slot-machine';
export { ClaimReward } from './ui/claim-reward';
export type { ClaimRewardProps } from './ui/claim-reward';
export { ClaimSuccess } from './ui/claim-success';
export type { ClaimSuccessProps } from './ui/claim-success';
export { YouWon } from './ui/you-won';
export type { YouWonProps } from './ui/you-won';
export type { Sponsor } from './types';
export { YouLost } from './ui/you-lost';
export type { YouLostProps } from './ui/you-lost';
export { DidntWin } from './ui/didnt-win';
export type { DidntWinProps } from './ui/didnt-win';
export { PrizeCard } from './ui/prize-card';
export type { PrizeCardProps } from './ui/prize-card';
export { WinButtons } from './ui/win-buttons';
export type { WinButtonsProps } from './ui/win-buttons';
export { BrandLinkAnimation } from './ui/brand-link-animation';
export type { BrandLinkAnimationProps } from './ui/brand-link-animation';
export { ConfettiBackground } from './ui/confetti-background';
export { TrophyAnimation } from './ui/trophy-animation';
export type { TrophyAnimationProps } from './ui/trophy-animation';
export { SadEmojiAnimation } from './ui/sad-emoji-animation';
export type { SadEmojiAnimationProps } from './ui/sad-emoji-animation';
export { FailedAnimation } from './ui/failed-animation';
export type { FailedAnimationProps } from './ui/failed-animation';
export { SuccessConfettiAnimation } from './ui/success-confetti-animation';
export type { SuccessConfettiAnimationProps } from './ui/success-confetti-animation';
export { SponsorDetail } from './ui/sponsor-detail';
export type { SponsorDetailProps } from './ui/sponsor-detail';
export { ActivityNotification } from './ui/activity-notification';
export { SponsorsCarousel } from './ui/sponsors-carousel';

// Utilities
export { cn } from './lib/utils';
export { 
  TIMING, 
  GAME_RULES, 
  CARD_HEIGHTS, 
  BREAKPOINTS, 
  EASING 
} from './lib/game-config';
export { 
  SPONSOR_SCALE_CLASSES, 
  getSponsorScaleClass 
} from './lib/sponsor-scale-config';
export {
  trackButtonClick,
  trackFormFieldInteraction,
  trackFormSubmit,
} from './lib/analytics';

// Hooks
export { useResponsiveCardHeight } from './hooks/use-responsive-card-height';
export { useSlotAnimation } from './hooks/use-slot-animation';

// API
export { apiClient, ApiClient } from './api/api-client';
export type { ApiError } from './api/api-client';
export { brevoClient } from './api/brevo-client';
export type { EmailData, BrevoEmailResponse } from './api/brevo-client';

