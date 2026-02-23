import { MachineContainer } from "@/components/machine-container";
import { MainContentContainerWrapper } from "@/components/main-content-container-wrapper";
import { ScreenLayout } from "@/shared/ui/wrappers/screen-layout";

interface TryAgainScreenProps {
  isCooldown: boolean;
  formattedTime: string;
  remainingSeconds: number;
  remainingAttempts: number;
  onSpinAgain: () => void;
}

export function TryAgainScreen({
  isCooldown,
  formattedTime,
  remainingSeconds,
  remainingAttempts,
  onSpinAgain,
}: TryAgainScreenProps) {
  const canSpinNow = !isCooldown || remainingSeconds <= 0;

  return (
    <ScreenLayout>
      <div className="relative w-full max-w-[360px] mx-auto flex flex-col items-center overflow-visible">
        <MachineContainer>
          <MainContentContainerWrapper
            showChainBlock
            chainBlockText={canSpinNow ? "SPIN NOW" : formattedTime}
            onChainBlockClick={canSpinNow ? onSpinAgain : undefined}
            chainBlockDisabled={!canSpinNow}
            headerText="Try Again"
            lanternState="loser"
          >
            <div className="py-14 flex flex-col items-center gap-4">
              <p className="mb-6 font-roboto font-black text-[20px] leading-none text-center uppercase text-[#000000]">
                Better Luck Next Spin!
              </p>
              {isCooldown ? (
                <span className="block w-full whitespace-nowrap text-[15px] font-roboto font-black leading-none text-center uppercase text-[#000000]">
                  Try again tomorrow
                  <br />
                  Next spin unlocks in 24 hours
                </span>
              ) : (
                <span className="block w-full whitespace-nowrap text-[15px] font-roboto font-black leading-none text-center uppercase text-[#000000]">
                  {remainingAttempts} {remainingAttempts === 1 ? "attempt" : "attempts"} left
                </span>
              )}
            </div>
          </MainContentContainerWrapper>
        </MachineContainer>
      </div>
    </ScreenLayout>
  );
}
