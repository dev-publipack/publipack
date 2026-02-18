import React from 'react';
import { LightsRow } from '@/components/lights';
import { Spin2WinHeader } from './spin-2-win-header';
import { ChainBlock } from '../chain-block';
import { cn } from '@/shared/lib/utils';

export type ContentVariant = 'default' | 'win';

interface MainContentContainerProps {
    children?: React.ReactNode;
    headerText?: string;
    showChainBlock?: boolean;
    /** Static text for chain block (e.g. "SPIN NOW") */
    chainBlockText?: string;
    /** Custom content for chain block (e.g. TimerDisplay) - overrides chainBlockText */
    chainBlockContent?: React.ReactNode;
    contentVariant?: ContentVariant;
    centerChildren?: boolean;
}

export function MainContentContainer({
    children,
    headerText = '! WINNER !',
    showChainBlock = false,
    contentVariant = 'default',
    chainBlockText = 'SPIN NOW',
    chainBlockContent,
    centerChildren = false,
}: MainContentContainerProps) {
    return (
        <div className="relative w-full h-full z-10 flex flex-col items-center justify-center">
            <Spin2WinHeader text={headerText} />
            <div className="relative w-full h-full">
                <div
                    className="absolute -inset-4 rounded-[80px] z-1 bg-machine-gradient shadow-[0_0_10px_5px_rgba(255,255,255,0.85),inset_0_0_20px_5px_rgba(255,255,255,0.85)]"
                    style={{
                        background:
                            'radial-gradient(50% 50% at 50% 50%, #FFF7FB 50%, #FFA2DC 100%)',
                        top: '-20%',
                        bottom: '-4%',
                        left: '-4%',
                        right: '-4%',
                    }}
                />
                <LightsRow pattern={[true, false, true, false, true]} />

                <div
                    className={cn(
                        'relative z-5 w-full h-full rounded-[60px] border-4 border-[#FF8B00] overflow-hidden transition-all duration-1000',
                        contentVariant === 'win'
                            ? 'bg-linear-to-b from-[#3FD2A1] to-[#44D1F8]'
                            : 'bg-[#FFEDD9]',
                        centerChildren && 'flex flex-col items-center justify-center'
                    )}
                >
                    {children}
                </div>

                {showChainBlock && (
                    <ChainBlock text={chainBlockText}>
                        {chainBlockContent}
                    </ChainBlock>
                )}
            </div>
        </div>
    );
}
