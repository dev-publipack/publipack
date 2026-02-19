import { MachineContainer } from "@/components/machine-container";
import { MainContentContainerWrapper } from "@/components/main-content-container-wrapper";
import { ScreenLayout } from "@/shared/ui/wrappers/screen-layout";

interface TryAgainScreenProps {
  formattedTime: string;
  remainingSeconds: number;
  onSpinAgain: () => void;
}

export function TryAgainScreen({
  formattedTime,
  remainingSeconds,
  onSpinAgain,
}: TryAgainScreenProps) {
  const canSpinNow = remainingSeconds <= 0;

  return (
    <ScreenLayout>
      <div className="relative w-full max-w-[480px] flex flex-col items-center overflow-visible">
        <MachineContainer>
          <MainContentContainerWrapper
            showChainBlock
            chainBlockText={canSpinNow ? "SPIN NOW" : formattedTime}
            headerText="Try Again"
            lanternState="loser"
          >
            <div className="py-14 flex flex-col items-center gap-4">
              <p className="mb-6 font-roboto font-black text-[20px] leading-none text-center uppercase text-[#000000]">
                Better Luck Next Spin!
              </p>
              <span className="block w-full whitespace-nowrap text-[15px] font-roboto font-black leading-none text-center uppercase text-[#000000]">
                Try again tomorrow
                <br />
                Next spin unlocks in 24 hours
              </span>
              {canSpinNow && (
                <button
                  onClick={onSpinAgain}
                  className="w-full h-14 rounded-full bg-[#AEFB8B] border-4 border-[#DCF7CD] font-bungee text-xl text-[#111D21] mt-4"
                >
                  Spin Now
                </button>
              )}
            </div>
          </MainContentContainerWrapper>
        </MachineContainer>
      </div>
    </ScreenLayout>
  );
}
