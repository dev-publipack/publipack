import React from 'react';
import { cn } from '@/shared/lib/utils';

interface ChainBlockProps {
  className?: string;
  text: string;
}

const CHAIN_SRC = '/design/chains/full-chain.svg';

export function ChainBlock({ text, className = '' }: ChainBlockProps) {
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative w-[282px] h-[108px]">
        <img
          src={CHAIN_SRC}
          alt=""
          className="absolute left-[66px] top-0 w-[23px] h-[108px]"
          aria-hidden
        />
        <img
          src={CHAIN_SRC}
          alt=""
          className="absolute left-[193px] top-0 w-[23px] h-[108px]"
          aria-hidden
        />
      </div>
      <div
        className={cn(
          // bg & border
          'w-[282px] h-[58px] rounded-[20px] border-4',
          'bg-[#AEFB8B] border-[#DCF7CD]',
          'shadow-[0_0_5px_1px_rgba(0,0,0,0.25)]',
          'flex items-center justify-center -mt-[33px]'
        )}
      >
        <span
          className="text-[40px] leading-[1.2] text-[#F2EBEE]"
          style={{
            WebkitTextStroke: '2px #FF8B00',
            textShadow: '0px 0px 5px rgba(0, 0, 0, 0.25)',
            fontFamily: 'Bungee, regular',
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
}