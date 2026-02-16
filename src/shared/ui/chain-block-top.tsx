import React from 'react';
import { cn } from '@/shared/lib/utils';

interface ChainBlockTopProps {
  className?: string;
  text: string;
}

const CHAIN_SRC = '/design/chains/full-chain.svg';

/**
 * Top variant of ChainBlock: chains from top, block below.
 * Same layout as chain-block (chains above, block below).
 */
export function ChainBlockTop({ text, className = '' }: ChainBlockTopProps) {
  return (
    <div
      className={cn(
        'fixed left-1/2 -translate-x-1/2 top-0 flex flex-col items-center w-full max-w-[398px] z-1 -top-4',
        className
      )}
    >
      {/* Chains extend above container - hanging from top */}
      <div className="relative w-[71%] h-[80px]">
        <div className="absolute left-[23%] top-0 w-[8%] h-full">
          <img
            src={CHAIN_SRC}
            alt=""
            className="w-full h-full object-cover object-[50%_15%] scale-y-[-1]"
            aria-hidden
          />
        </div>
        <div className="absolute right-[23%] top-0 w-[8%] h-full">
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
          'box-border w-[295px] h-[52px] rounded-[15px] border-[3px] border-[#FFD7EB]',
          'flex items-center justify-center -mt-2 relative z-10'
        )}
        style={{
          background: 'radial-gradient(69.32% 50% at 50% 50%, #FFF7FB 0%, #FFA2DC 100%)',
        }}
      >
        <span
          className="text-[24px] leading-none text-[#2066BB] whitespace-nowrap px-1"
          style={{
            textShadow: '0px 0px 5px rgba(0, 0, 0, 0.25)',
            fontFamily: 'Bungee, sans-serif',
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
