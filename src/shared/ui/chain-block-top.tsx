'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/shared/lib/utils';

interface ChainBlockTopProps {
  className?: string;
  /** Single line text (e.g. "SPIN NOW") */
  text?: string;
  /** Two-line format: top 24px, bottom 15px (e.g. "LISA.P JUST WON" / "FREE GIFT FROM AMAZON") */
  lines?: { top: string; bottom: string };
  /** Enable fade/slide animation when content changes */
  animate?: boolean;
}

const CHAIN_SRC = '/design/chains/full-chain.svg';

/**
 * Top variant of ChainBlock: chains from top, block below.
 * Same layout as chain-block (chains above, block below).
 */
const textStyle = {
  textShadow: '0px 0px 5px rgba(0, 0, 0, 0.25)',
  fontFamily: 'Bungee, sans-serif',
} as const;

export function ChainBlockTop({ text, lines, className = '', animate = false }: ChainBlockTopProps) {
  const content = lines ?? (text ? { top: text, bottom: '' } : null);
  const [displayContent, setDisplayContent] = useState(content);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!content) return;
    if (!animate) {
      setDisplayContent(content);
      return;
    }
    const key = `${content.top}-${content.bottom}`;
    const prevKey = `${displayContent?.top}-${displayContent?.bottom}`;
    if (key === prevKey) return;
    setIsVisible(false);
    const timer = setTimeout(() => {
      setDisplayContent(content);
      setIsVisible(true);
    }, 250);
    return () => clearTimeout(timer);
  }, [content?.top, content?.bottom, animate]);

  if (!displayContent) return null;

  const isTwoLine = Boolean(displayContent.bottom);

  return (
    <div
      className={cn(
        'fixed left-1/2 -translate-x-1/2 flex flex-col items-center w-[min(100%,360px)] z-10 -top-4',
        className
      )}
    >
      {/* Chains - fixed px to avoid % calculation issues in flex/absolute context */}
      <div className="relative z-20 w-[255px] h-[80px] shrink-0">
        <div className="absolute left-[58px] top-0 w-[24px] h-full">
          <img
            src={CHAIN_SRC}
            alt=""
            className="w-full h-full object-cover object-[50%_15%] scale-y-[-1]"
            aria-hidden
          />
        </div>
        <div className="absolute right-[58px] top-0 w-[24px] h-full">
          <img
            src={CHAIN_SRC}
            alt=""
            className="w-full h-full object-cover object-[50%_15%] scale-y-[-1]"
            aria-hidden
          />
        </div>
      </div>

      {/* Block below chains - Figma Popup Container */}
      <div
        className={cn(
          'box-border min-w-[295px] min-h-[52px] rounded-[15px] border-[3px] border-[#FFD7EB]',
          'flex flex-col items-center justify-center gap-0.5 -mt-2 relative z-30 py-2 px-3',
          isTwoLine ? 'w-max max-w-[calc(100vw-2rem)]' : 'w-[295px]'
        )}
        style={{
          background: 'radial-gradient(69.32% 50% at 50% 50%, #FFF7FB 0%, #FFA2DC 100%)',
        }}
      >
        {isTwoLine ? (
          <div
            className={cn(
              'flex flex-col items-center justify-center text-center',
              animate && !isVisible && 'opacity-0 translate-y-2'
            )}
            style={animate ? {
              // transition-[opacity,transform] instead of transition-all:
              // only opacity and transform are GPU-compositable on iOS Safari.
              // transition-all causes Safari to animate layout properties via software.
              transition: 'opacity 300ms ease-out, transform 300ms ease-out',
              willChange: 'opacity, transform',
              transform: !isVisible ? 'translate3d(0, 8px, 0)' : 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            } : undefined}
          >
            <span
              className="text-[24px] leading-tight text-[#2066BB] uppercase whitespace-nowrap"
              style={textStyle}
            >
              {displayContent.top}
            </span>
            <span
              className="text-[15px] leading-tight text-[#2066BB] uppercase"
              style={textStyle}
            >
              {displayContent.bottom}
            </span>
          </div>
        ) : (
          <span
            className={cn(
              'text-[24px] leading-none text-[#2066BB] whitespace-nowrap',
              animate && !isVisible && 'opacity-0'
            )}
            style={animate ? {
              display: 'block',
              transition: 'opacity 300ms ease-out, transform 300ms ease-out',
              willChange: 'opacity, transform',
              transform: !isVisible ? 'translate3d(0, 8px, 0)' : 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              ...textStyle,
            } : textStyle}
          >
            {displayContent.top}
          </span>
        )}
      </div>
    </div>
  );
}
