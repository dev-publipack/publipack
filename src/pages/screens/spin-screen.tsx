'use client';

import { useMemo } from "react";
import { MachineContainer } from "@/components/machine-container";
import { MainContentContainerWrapper } from "@/components/main-content-container-wrapper";
import { ScreenLayout } from "@/shared/ui/wrappers/screen-layout";
import { SPONSORS } from "@/shared/lib/constants";
import type { Sponsor } from "@/shared/types";

interface SpinScreenProps {
  onComplete: (result: { winner: Sponsor | null; isWin: boolean }) => void;
  /** Auto-start spin on mount (legacy behavior) */
  autoStart?: boolean;
}

export function SpinScreen({ onComplete, autoStart = true }: SpinScreenProps) {
  const slotMachineProps = useMemo(
    () => ({
      sponsors: SPONSORS,
      onComplete,
      autoStart,
    }),
    [onComplete, autoStart]
  );

  return (
    <ScreenLayout topChainText="SPIN NOW" showActivityNotifications>
      <div className="relative w-full max-w-[360px] flex flex-col items-center overflow-visible mb-[112px]">
        <MachineContainer variant="expanded">
          <MainContentContainerWrapper
            slotMachine={slotMachineProps}
            headerText="SPIN'2'WIN"
            chainBlockText="SPIN NOW"
          />
        </MachineContainer>
      </div>
    </ScreenLayout>
  );
}
