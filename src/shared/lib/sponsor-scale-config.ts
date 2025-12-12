import type { Sponsor } from '../types';

/**
 * Sponsor logos that need extra 10% scaling
 */
const LOGOS_NEEDING_10_PERCENT_EXTRA = [
  '/images/preply-logo.svg',
  '/images/disney-land.svg',
];

/**
 * Sponsor logos that need extra 20% + 10% scaling (workaway)
 */
const LOGOS_NEEDING_20_PERCENT_EXTRA = [
  '/images/workaway-info.svg',
];

/**
 * Base scale classes for different sponsor scales
 * Format: max-w-[width] max-h-[height] for each breakpoint (xs, sm, md, lg, xl)
 */
export const SPONSOR_SCALE_CLASSES = {
  small: {
    base: 'max-w-[161px] max-h-[87px] sm:max-w-[209px] sm:max-h-[99px] md:max-w-[245px] md:max-h-[113px] lg:max-w-[279px] lg:max-h-[125px] xl:max-w-[317px] xl:max-h-[138px]',
    extra10: 'max-w-[177px] max-h-[97px] sm:max-w-[230px] sm:max-h-[109px] md:max-w-[269px] md:max-h-[124px] lg:max-w-[307px] lg:max-h-[138px] xl:max-w-[350px] xl:max-h-[152px]',
    extra20: 'max-w-[235px] max-h-[127px] sm:max-w-[304px] sm:max-h-[143px] md:max-w-[357px] md:max-h-[164px] lg:max-w-[406px] lg:max-h-[182px] xl:max-w-[460px] xl:max-h-[200px]',
  },
  medium: {
    base: 'max-w-[209px] max-h-[105px] sm:max-w-[250px] sm:max-h-[115px] md:max-w-[281px] md:max-h-[128px] lg:max-w-[312px] lg:max-h-[140px] xl:max-w-[344px] xl:max-h-[153px]',
    extra10: 'max-w-[230px] max-h-[115px] sm:max-w-[275px] sm:max-h-[127px] md:max-w-[308px] md:max-h-[140px] lg:max-w-[343px] lg:max-h-[154px] xl:max-w-[378px] xl:max-h-[168px]',
    extra20: 'max-w-[230px] max-h-[115px] sm:max-w-[275px] sm:max-h-[127px] md:max-w-[308px] md:max-h-[140px] lg:max-w-[343px] lg:max-h-[154px] xl:max-w-[378px] xl:max-h-[168px]', // same as extra10
  },
  large: {
    base: 'max-w-[289px] max-h-[137px] sm:max-w-[332px] sm:max-h-[148px] md:max-w-[375px] md:max-h-[161px] lg:max-w-[416px] lg:max-h-[173px] xl:max-w-[458px] xl:max-h-[185px]',
    extra10: 'max-w-[289px] max-h-[137px] sm:max-w-[332px] sm:max-h-[148px] md:max-w-[375px] md:max-h-[161px] lg:max-w-[416px] lg:max-h-[173px] xl:max-w-[458px] xl:max-h-[185px]',
    extra20: 'max-w-[289px] max-h-[137px] sm:max-w-[332px] sm:max-h-[148px] md:max-w-[375px] md:max-h-[161px] lg:max-w-[416px] lg:max-h-[173px] xl:max-w-[458px] xl:max-h-[185px]',
  },
  xlarge: {
    base: 'max-w-[376px] max-h-[178px] sm:max-w-[434px] sm:max-h-[192px] md:max-w-[489px] md:max-h-[209px] lg:max-w-[543px] lg:max-h-[225px] xl:max-w-[597px] xl:max-h-[242px]',
    extra10: 'max-w-[376px] max-h-[178px] sm:max-w-[434px] sm:max-h-[192px] md:max-w-[489px] md:max-h-[209px] lg:max-w-[543px] lg:max-h-[225px] xl:max-w-[597px] xl:max-h-[242px]',
    extra20: 'max-w-[376px] max-h-[178px] sm:max-w-[434px] sm:max-h-[192px] md:max-w-[489px] md:max-h-[209px] lg:max-w-[543px] lg:max-h-[225px] xl:max-w-[597px] xl:max-h-[242px]',
  },
} as const;

/**
 * Get the appropriate scale class for a sponsor logo
 */
export function getSponsorScaleClass(sponsor: Sponsor): string {
  const scale = sponsor.scale || 'large';
  const scaleConfig = SPONSOR_SCALE_CLASSES[scale];
  
  if (LOGOS_NEEDING_20_PERCENT_EXTRA.includes(sponsor.logo)) {
    return scaleConfig.extra20;
  }
  
  if (LOGOS_NEEDING_10_PERCENT_EXTRA.includes(sponsor.logo)) {
    return scaleConfig.extra10;
  }
  
  return scaleConfig.base;
}

