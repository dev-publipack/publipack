import { MachineContainer } from "@/components/machine-container";
import { MainContentContainerWrapper } from "@/components/main-content-container-wrapper";
import { ScreenLayout } from "@/shared/ui/wrappers/screen-layout";
import { SPONSORS } from "@/shared/lib/constants";
import type { Sponsor } from "@/shared/types";

interface SpinScreenProps {
  onComplete: (result: { winner: Sponsor | null; isWin: boolean }) => void;
}

export function SpinScreen({ onComplete }: SpinScreenProps) {
  return (
    <ScreenLayout topChainText="SPIN NOW">
      <div className="relative w-full max-w-[480px] flex flex-col items-center overflow-visible">
        <MachineContainer variant="expanded">
          <MainContentContainerWrapper
            slotMachine={{ sponsors: SPONSORS, onComplete }}
            chainBlockText="SPIN NOW"
          />
        </MachineContainer>
      </div>
    </ScreenLayout>
  );
}
