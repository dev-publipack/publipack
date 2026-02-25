'use client';

import React, { memo } from 'react';
import { MainContentContainer } from '@/shared/ui/wrappers/main-content-container';
import { SlotMachineContent } from './slot-machine-content';
import { useSlotMachine } from '@/hooks/use-slot-machine';
import { Sponsor } from '@/shared/types';
import type { LanternState } from '@/shared/ui/lanterns';

interface SlotMachineProps {
  sponsors: Sponsor[];
  onComplete?: (result: { winner: Sponsor | null; isWin: boolean }) => void;
  /** Auto-start spin on mount (e.g. when coming from WinScreen Spin Again) */
  autoStart?: boolean;
  /** Called when auto-start spin has been triggered */
  onAutoSpinStarted?: () => void;
}

interface MainContentContainerWrapperProps {
  children?: React.ReactNode;
  slotMachine?: SlotMachineProps;
  headerText?: string;
  showChainBlock?: boolean;
  chainBlockText?: string;
  chainBlockContent?: React.ReactNode;
  /** Click handler for chain block (e.g. form submit) */
  onChainBlockClick?: () => void;
  /** Disable chain block (e.g. while submitting) */
  chainBlockDisabled?: boolean;
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

const SlotMachineMainContent = memo(function SlotMachineMainContent({
  sponsors,
  onComplete,
  autoStart,
  onAutoSpinStarted,
  headerText,
  chainBlockText,
}: SlotMachineProps & { headerText: string; chainBlockText: string }) {
  const { phase, isSpinning, isComplete, isWin, spinRefs, startSpin } =
    useSlotMachine({ sponsors, onComplete, autoStart, onAutoSpinStarted });

  const lanternState = deriveLanternState(isSpinning, isComplete, isWin);
  const isSpinButtonDisabled = phase === "slots" || isComplete;

  return (
    <MainContentContainer
      noCreamWrapper
      headerText={headerText}
      showChainBlock
      chainBlockText={chainBlockText}
      contentVariant={isComplete && isWin ? 'win' : 'default'}
      lanternState={lanternState}
      onChainBlockClick={startSpin}
      chainBlockDisabled={isSpinButtonDisabled}
    >
      <SlotMachineContent spinRefs={spinRefs} sponsors={sponsors} />
    </MainContentContainer>
  );
});

export function MainContentContainerWrapper({
  children,
  slotMachine,
  headerText = '! WINNER !',
  showChainBlock = false,
  chainBlockText = 'SPIN AGAIN',
  chainBlockContent,
  onChainBlockClick,
  chainBlockDisabled = false,
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
      onChainBlockClick={onChainBlockClick}
      chainBlockDisabled={chainBlockDisabled}
    >
      {children}
    </MainContentContainer>
  );
}
