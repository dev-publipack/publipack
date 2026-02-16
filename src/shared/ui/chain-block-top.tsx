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

      {/* Block below chains */}
      <div
        className={cn(
          'w-[71%] aspect-282/58 rounded-[20px] border-4',
          'bg-[#AEFB8B] border-[#DCF7CD]',
          'shadow-[0_0_5px_1px_rgba(0,0,0,0.25)]',
          'flex items-center justify-center -mt-2 relative z-10'
        )}
      >
        <span
          className="text-[24px] leading-none text-[#F2EBEE] whitespace-nowrap px-1"
          style={{
            WebkitTextStroke: '2px #FF8B00',
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
