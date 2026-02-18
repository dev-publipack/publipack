import { MachineContainer } from "@/components/machine-container";
import { ClaimForm } from "@/components/claim-form";
import { MainContentContainerWrapper } from "@/components/main-content-container-wrapper";
import { ScreenLayout } from "@/shared/ui/wrappers/screen-layout";
import type { ClaimSubmitData } from "@/components/claim-form";
import type { Sponsor } from "@/shared/types";

interface ClaimScreenProps {
  winner: Sponsor;
  onSubmit: (data: ClaimSubmitData) => void;
  onBack: () => void;
}

export function ClaimScreen({ onSubmit, onBack }: ClaimScreenProps) {
  return (
    <ScreenLayout topChainText="! WINNER !">
      <div className="relative w-full max-w-[480px] flex flex-col items-center overflow-visible">
        <MachineContainer variant="expanded">
          <MainContentContainerWrapper showChainBlock headerText="! WINNER !">
            <div className="flex flex-col items-center gap-4">
              <ClaimForm onSubmit={onSubmit} />
              <button
                onClick={onBack}
                className="text-[#2066BB] font-bungee text-sm underline"
              >
                Back
              </button>
            </div>
          </MainContentContainerWrapper>
        </MachineContainer>
      </div>
    </ScreenLayout>
  );
}
