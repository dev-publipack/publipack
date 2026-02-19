import React from 'react';
import { cn } from '@/shared/lib/utils';

interface ChainBlockProps {
  className?: string;
  /** Static text when no custom content */
  text?: string;
  /** Custom content (e.g. TimerDisplay) - takes precedence over text */
  children?: React.ReactNode;
  /** Click handler for the button (e.g. start spin) */
  onClick?: () => void;
  /** Disable button (e.g. while spinning) */
  disabled?: boolean;
}

const CHAIN_SRC = '/design/chains/full-chain.svg';

export function ChainBlock({ text = '', children, className = '', onClick, disabled }: ChainBlockProps) {
  return (
    <div className={cn('absolute left-1/2 -translate-x-1/2  flex flex-col items-center w-full -z-1', className)}>
      {/* Chains container - positioned to start from bottom of parent */}
      <div className="relative w-[71%] h-[80px]">
        {/* Left chain */}
        <div className="absolute left-[23%] top-0 w-[8%] h-full">
          <img
            src={CHAIN_SRC}
            alt=""
            className="w-full h-full object-cover object-[50%_15%]"
            aria-hidden
          />
        </div>
        {/* Right chain */}
        <div className="absolute right-[23%] top-0 w-[8%] h-full">
          <img
            src={CHAIN_SRC}
            alt=""
            className="w-full h-full object-cover object-[50%_15%]"
            aria-hidden
          />
        </div>
      </div>

      {/* Button */}
      <div
        role={onClick ? 'button' : undefined}
        tabIndex={onClick && !disabled ? 0 : undefined}
        onClick={disabled ? undefined : onClick}
        onKeyDown={
          onClick && !disabled
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        className={cn(
          ' aspect-282/58 rounded-[20px] border-4',
          'bg-[#AEFB8B] border-[#DCF7CD]',
          'shadow-[0_0_5px_1px_rgba(0,0,0,0.25)]',
          'flex items-center justify-center -mt-5 relative z-10',
          onClick && !disabled && 'cursor-pointer active:scale-[0.98]',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
      >
        {children ?? (
          <span
            className="text-[40px] leading-none text-[#F2EBEE] whitespace-nowrap px-1"
            style={{
              WebkitTextStroke: '2px #FF8B00',
              textShadow: '0px 0px 5px rgba(0, 0, 0, 0.25)',
              fontFamily: 'Bungee, sans-serif',
            }}
          >
            {text}
          </span>
        )}
      </div>
    </div>
  );
}