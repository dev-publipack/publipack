import React from 'react';
import { LightsRow } from '@/components/lights';
import { Spin2WinHeader } from './spin-2-win-header';
import { ChainBlock } from '../chain-block';

interface MainContentContainerWrapperProps {
    children: React.ReactNode;
}

export function MainContentContainerWrapper({ children }: MainContentContainerWrapperProps) {
    return (
        <div className="relative w-full h-full">
            <Spin2WinHeader text="! WINNER !" />
            <div className="relative w-full h-full">
                {/* Gradient background layer - extended 20% upward */}
                <div
                    className="absolute -inset-4 rounded-[80px] z-0 bg-machine-gradient shadow-[0_0_10px_5px_rgba(255,255,255,0.85),inset_0_0_20px_5px_rgba(255,255,255,0.85)]"
                    style={{
                        background: 'radial-gradient(50% 50% at 50% 50%, #FFF7FB 50%, #FFA2DC 100%)',
                        top: '-20%',
                        bottom: '-1rem',
                        left: '-1rem',
                        right: '-1rem',
                    }}
                />
                <LightsRow pattern={[true, false, true, false, true]} />
                <div
                    className="relative z-1 w-full h-full bg-[#FFEDD9] rounded-[60px] border-4 border-[#FF8B00] overflow-hidden transition-transform duration-1000"
                >
                    {children}
                </div>
            </div>
            <ChainBlock
                text='Claim My Prize'
            ></ChainBlock>
        </div>
    );
}