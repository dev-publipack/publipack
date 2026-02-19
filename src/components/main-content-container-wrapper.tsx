'use client';

import React from 'react';
import { MainContentContainer } from '@/shared/ui/wrappers/main-content-container';
import { SlotMachineContent } from './slot-machine-content';
import { useSlotMachine } from '@/hooks/use-slot-machine';
import { Sponsor } from '@/shared/types';
import type { LanternState } from '@/shared/ui/lanterns';

interface SlotMachineProps {
  sponsors: Sponsor[];
  onComplete?: (result: { winner: Sponsor | null; isWin: boolean }) => void;
}

interface MainContentContainerWrapperProps {
  children?: React.ReactNode;
  slotMachine?: SlotMachineProps;
  headerText?: string;
  showChainBlock?: boolean;
  chainBlockText?: string;
  chainBlockContent?: React.ReactNode;
  /** Lantern state for non-slot screens (winner/loser) */
  lanternState?: LanternState;
}

function deriveLanternState(
  isSpinning: boolean,
  isComplete: boolean,
  isWin: boolean
): LanternState {
  if (isSpinning) return 'spinning';
  if (isComplete && isWin) return 'winner';
  if (isComplete && !isWin) return 'loser';
  return 'idle';
}

function SlotMachineMainContent({
  sponsors,
  onComplete,
  headerText,
  chainBlockText,
}: SlotMachineProps & { headerText: string; chainBlockText: string }) {
  const { isSpinning, isComplete, isWin, spinRefs, extendedSponsors, startSpin } =
    useSlotMachine({ sponsors, onComplete });

  const lanternState = deriveLanternState(isSpinning, isComplete, isWin);

  return (
    <MainContentContainer
      headerText={headerText}
      showChainBlock
      chainBlockText={chainBlockText}
      contentVariant={isComplete && isWin ? 'win' : 'default'}
      lanternState={lanternState}
      onChainBlockClick={startSpin}
      chainBlockDisabled={isSpinning}
    >
      <SlotMachineContent spinRefs={spinRefs} extendedSponsors={extendedSponsors} />
    </MainContentContainer>
  );
}

export function MainContentContainerWrapper({
  children,
  slotMachine,
  headerText = '! WINNER !',
  showChainBlock = false,
  chainBlockText = 'SPIN AGAIN',
  chainBlockContent,
  lanternState = 'idle',
}: MainContentContainerWrapperProps) {
  if (slotMachine) {
    return <SlotMachineMainContent chainBlockText={chainBlockText} {...slotMachine} headerText={headerText} />;
  }

  return (
    <MainContentContainer
      headerText={headerText}
      showChainBlock={showChainBlock ?? false}
      chainBlockText={chainBlockText ?? 'SPIN AGAIN'}
      centerChildren
      lanternState={lanternState}
    >
      {children}
    </MainContentContainer>
  );
}
