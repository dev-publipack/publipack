'use client';

import React from 'react';
import { ChainBlockTop } from '@/shared/ui/chain-block-top';
import { cn } from '@/shared/lib/utils';

const PAGE_BG =
  'min-h-screen bg-[url(\'/design/bg/bg.svg\')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center';

interface ScreenLayoutProps {
  children: React.ReactNode;
  /** Top chain block text (e.g. "SPIN NOW", "! WINNER !") */
  topChainText?: string;
  /** Max width: default 480px, wide 600px */
  maxWidth?: 'default' | 'wide';
  className?: string;
}

export function ScreenLayout({
  children,
  topChainText,
  maxWidth = 'default',
  className,
}: ScreenLayoutProps) {
  const maxWidthClass = maxWidth === 'wide' ? 'max-w-[600px]' : 'max-w-[480px]';

  return (
    <div className={cn(PAGE_BG, className)}>
      {topChainText && <ChainBlockTop text={topChainText} />}
      <div
        className={cn(
          'relative w-full flex flex-col items-center overflow-visible px-4',
          maxWidthClass
        )}
      >
        {children}
      </div>
    </div>
  );
}
