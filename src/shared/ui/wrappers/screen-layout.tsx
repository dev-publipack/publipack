'use client';

import React from 'react';
import { ChainBlockTop } from '@/shared/ui/chain-block-top';
import { cn } from '@/shared/lib/utils';
import { useActivityNotifications } from '@/hooks/legacy/use-activity-notifications';
import { useLanguage } from '@/providers/language-provider';

const PAGE_BG =
  'min-h-dvh w-full bg-page flex flex-col items-center justify-center';

interface ScreenLayoutProps {
  children: React.ReactNode;
  /** Top chain block text (e.g. "SPIN NOW", "! WINNER !") - fallback when no notifications */
  topChainText?: string;
  /** Show activity notifications in ChainBlockTop instead of topChainText */
  showActivityNotifications?: boolean;
  /** Max width: default 480px, wide 600px */
  maxWidth?: 'default' | 'wide';
  className?: string;
}

export function ScreenLayout({
  children,
  topChainText,
  showActivityNotifications = false,
  maxWidth = 'default',
  className,
}: ScreenLayoutProps) {
  const maxWidthClass = maxWidth === 'wide' ? 'max-w-[600px]' : 'max-w-[360px]';
  const { notifications } = useActivityNotifications(showActivityNotifications);
  const { t } = useLanguage();

  const chainContent = React.useMemo(() => {
    if (showActivityNotifications && notifications.length > 0) {
      const n = notifications[0];
      return {
        lines: {
          top: `${n.emoji} ${t('activityNotification.justWonTop', { name: n.name })}`,
          bottom: n.prize,
        },
        animate: true,
      };
    }
    return topChainText
      ? { text: topChainText, animate: false }
      : null;
  }, [showActivityNotifications, notifications, topChainText, t]);

  return (
    <div className={cn(PAGE_BG, 'relative', className)}>
      {chainContent && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
          <ChainBlockTop
            text={chainContent.text}
            lines={chainContent.lines}
            animate={chainContent.animate}
          />
        </div>
      )}
      <div
        className={cn(
          'relative w-full flex flex-col items-center overflow-visible px-4 mx-auto',
          maxWidthClass
        )}
      >
        {children}
      </div>
    </div>
  );
}
