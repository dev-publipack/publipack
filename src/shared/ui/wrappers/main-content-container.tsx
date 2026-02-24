import React from 'react';
import { Spin2WinHeader } from './spin-2-win-header';
import { ChainBlock } from '../chain-block';
import { cn } from '@/shared/lib/utils';
import type { LanternState } from '@/shared/ui/lanterns';

export type ContentVariant = 'default' | 'win';

interface MainContentContainerProps {
    children?: React.ReactNode;
    /** Skip cream wrapper - render slot machine directly in pink container */
    noCreamWrapper?: boolean;
    headerText?: string;
    showChainBlock?: boolean;
    /** Static text for chain block (e.g. "SPIN NOW") */
    chainBlockText?: string;
    /** Custom content for chain block (e.g. TimerDisplay) - overrides chainBlockText */
    chainBlockContent?: React.ReactNode;
    /** Click handler for chain block button (e.g. start spin) */
    onChainBlockClick?: () => void;
    /** Disable chain block button (e.g. while spinning) */
    chainBlockDisabled?: boolean;
    contentVariant?: ContentVariant;
    centerChildren?: boolean;
    /** Lantern animation: idle | spinning | winner | loser */
    lanternState?: LanternState;
}

export function MainContentContainer({
    children,
    noCreamWrapper = false,
    headerText = '! WINNER !',
    showChainBlock = false,
    contentVariant = 'default',
    chainBlockText = 'SPIN NOW',
    chainBlockContent,
    onChainBlockClick,
    chainBlockDisabled = false,
    centerChildren = false,
    lanternState = 'idle',
}: MainContentContainerProps) {
    return (
        <div className="w-full h-full z-10 self-stretch flex flex-col">

            <Spin2WinHeader text={headerText} lanternState={lanternState} />
            <div className="relative w-full h-full">
                <div
                    className="absolute -inset-4 border-2 border-[#FFD7EB] rounded-[80px] z-1 bg-machine-gradient shadow-[0_0_10px_5px_rgba(255,255,255,0.85),inset_0_0_20px_5px_rgba(255,255,255,0.85)]"
                    style={{
                        background:
                            'radial-gradient(50% 50% at 50% 50%, #FFF7FB 50%, #FFA2DC 100%)',
                        top: '-20%',
                        bottom: '-4%',
                        left: '-4%',
                        right: '-4%',
                    }}
                />

                {noCreamWrapper ? (
                    <div
                        className={cn(
                            'relative z-5 w-full h-full rounded-[60px] transition-all duration-1000',
                            'flex flex-col items-center justify-center overflow-visible',
                            contentVariant === 'win' &&
                            'bg-linear-to-b from-[#3FD2A1] to-[#44D1F8]'
                        )}
                    >
                        {children}
                    </div>
                ) : (
                    <div
                        className={cn(
                            'relative z-5 w-full h-full rounded-[60px] border-4 border-[#FF8B00] transition-all duration-1000',
                            contentVariant === 'win'
                                ? 'bg-linear-to-b from-[#3FD2A1] to-[#44D1F8]'
                                : 'bg-[#FFEDD9]',
                            centerChildren && 'flex flex-col items-center justify-center overflow-y-auto',
                            !centerChildren && 'overflow-visible'
                        )}
                    >
                        {children}
                        {contentVariant !== 'win' && (
                            <div
                                className="absolute inset-0 pointer-events-none z-20 rounded-[56px]"
                                style={{
                                    boxShadow:
                                        'inset 0 6px 16px rgba(0,0,0,0.12), inset 0 -2px 8px rgba(0,0,0,0.04), inset 4px 0 12px rgba(0,0,0,0.06), inset -4px 0 12px rgba(0,0,0,0.06), inset 0 0 20px 8px rgba(255,162,220,0.3)',
                                }}
                                aria-hidden
                            />
                        )}
                    </div>
                )}

                {showChainBlock && (
                    <ChainBlock
                        text={chainBlockText}
                        onClick={onChainBlockClick}
                        disabled={chainBlockDisabled}
                    >
                        {chainBlockContent}
                    </ChainBlock>
                )}
            </div>
        </div>
    );
}
