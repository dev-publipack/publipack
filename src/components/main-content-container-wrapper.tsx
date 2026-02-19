'use client';

import React from 'react';
import { MainContentContainer } from '@/shared/ui/wrappers/main-content-container';
import { SlotMachineContent } from './slot-machine-content';
import { useSlotMachine } from '@/hooks/use-slot-machine';
import { Sponsor } from '@/shared/types';

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
}

function SlotMachineMainContent({
  sponsors,
  onComplete,
  headerText,
  chainBlockText,
}: SlotMachineProps & { headerText: string; chainBlockText: string }) {
  const { isComplete, isWin, spinRefs, extendedSponsors } = useSlotMachine({
    sponsors,
    onComplete,
  });

  return (
    <MainContentContainer
      headerText={headerText}
      showChainBlock
      contentVariant={isComplete && isWin ? 'win' : 'default'}
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

    >
      {children}
    </MainContentContainer>
  );
}
