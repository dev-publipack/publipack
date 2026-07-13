// UI Components
export { ChainBlock } from './ui/chain-block';
export { ChainBlockTop } from './ui/chain-block-top';

// UI Components (legacy)
export { Button, buttonVariants } from './ui/legacy/button';
export type { ButtonProps } from './ui/legacy/button';
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/legacy/card';
export { Input } from './ui/legacy/input';
export type { InputProps } from './ui/legacy/input';
export { RewardCard } from './ui/legacy/reward-card';
export type { RewardCardProps } from './ui/legacy/reward-card';
export { CountdownTimer } from './ui/legacy/countdown-timer';
export type { CountdownTimerProps } from './ui/legacy/countdown-timer';
export { WheelOfFortune } from './ui/legacy/wheel-of-fortune';
export type { WheelOfFortuneProps } from './ui/legacy/wheel-of-fortune';
export { SlotMachine } from './ui/legacy/slot-machine';
export type { SlotMachineProps, SlotMachineRef } from './ui/legacy/slot-machine';
export { CombinedSlotMachine } from './ui/legacy/combined-slot-machine';
export type { CombinedSlotMachineProps } from './ui/legacy/combined-slot-machine';
export { ClaimReward } from './ui/legacy/claim-reward';
export type { ClaimRewardProps } from './ui/legacy/claim-reward';
export { ClaimSuccess } from './ui/legacy/claim-success';
export type { ClaimSuccessProps } from './ui/legacy/claim-success';
export { YouWon } from './ui/legacy/you-won';
export type { YouWonProps } from './ui/legacy/you-won';
export type { Sponsor } from './types';
export { YouLost } from './ui/legacy/you-lost';
export type { YouLostProps } from './ui/legacy/you-lost';
export { DidntWin } from './ui/legacy/didnt-win';
export type { DidntWinProps } from './ui/legacy/didnt-win';
export { PrizeCard } from './ui/legacy/prize-card';
export type { PrizeCardProps } from './ui/legacy/prize-card';
export { WinButtons } from './ui/legacy/win-buttons';
export type { WinButtonsProps } from './ui/legacy/win-buttons';
export { BrandLinkAnimation } from './ui/legacy/brand-link-animation';
export type { BrandLinkAnimationProps } from './ui/legacy/brand-link-animation';
export { ConfettiBackground } from './ui/legacy/confetti-background';
export { TrophyAnimation } from './ui/legacy/trophy-animation';
export type { TrophyAnimationProps } from './ui/legacy/trophy-animation';
export { SadEmojiAnimation } from './ui/legacy/sad-emoji-animation';
export type { SadEmojiAnimationProps } from './ui/legacy/sad-emoji-animation';
export { FailedAnimation } from './ui/legacy/failed-animation';
export type { FailedAnimationProps } from './ui/legacy/failed-animation';
export { SuccessConfettiAnimation } from './ui/legacy/success-confetti-animation';
export type { SuccessConfettiAnimationProps } from './ui/legacy/success-confetti-animation';
export { SponsorDetail } from './ui/legacy/sponsor-detail';
export type { SponsorDetailProps } from './ui/legacy/sponsor-detail';
export { ActivityNotification } from './ui/legacy/activity-notification';
export { SponsorsCarousel } from './ui/legacy/sponsors-carousel';

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
  getUtmParams,
  initializeUtmTracking,
} from './lib/analytics';

// Hooks
export { useResponsiveCardHeight } from './hooks/use-responsive-card-height';
export { useSlotAnimation } from './hooks/use-slot-animation';

// API
export { apiClient, ApiClient } from './api/api-client';
export type { ApiError } from './api/api-client';
export { pipedreamClient } from './api/pipedream-client';
export type { LeadData } from './api/pipedream-client';
export { buildClaimEmail } from './lib/build-claim-email';
export { downloadClaimPdf } from './lib/download-claim-pdf';

