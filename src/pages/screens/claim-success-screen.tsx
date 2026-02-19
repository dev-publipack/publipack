import { MainContentContainerWrapper } from "@/components/main-content-container-wrapper";
import { ScreenLayout } from "@/shared/ui/wrappers/screen-layout";
import { TimerDisplay } from "@/shared/ui/timer-display";
import type { Sponsor } from "@/shared/types";

type Winner = Partial<Sponsor> & { name: string; reward: string; logo: string };

interface ClaimSuccessScreenProps {
  formattedTime: string;
  remainingSeconds: number;
  onPlayAgain: () => void;
  winner: Winner;
}

export function ClaimSuccessScreen({
  formattedTime,
  remainingSeconds,
  onPlayAgain,
  winner,
}: ClaimSuccessScreenProps) {
  const canSpinAgain = remainingSeconds <= 0;

  return (
    <ScreenLayout>
      <div className="relative w-full max-w-[480px] flex flex-col items-center overflow-visible">
        <MainContentContainerWrapper headerText="Spin'2'win" showChainBlock chainBlockText="18:45:54" >
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-6 w-full min-h-0">
            <p className="mb-6 font-roboto font-black text-[20px] leading-none text-center uppercase text-[#000000]">
              Congratulations!
            </p>
            {winner && (
              <div className="flex flex-col items-center justify-center mb-4">
                <img
                  src={winner.logo}
                  alt={winner.name}
                  className="h-20 object-contain"
                />
                <p className="text-center font-roboto font-black text-[20px] leading-none uppercase text-[#000000] mb-2">
                  {winner.reward}
                </p>
              </div>
            )}
            <span className="block w-full text-[15px] font-roboto font-black leading-none text-center uppercase text-[#000000] mb-4">
              Your prize has been sent
              <br />
              to your email
            </span>
            {canSpinAgain && (
              <button
                onClick={onPlayAgain}
                className="w-full h-14 rounded-full bg-[#AEFB8B] border-4 border-[#DCF7CD] font-bungee text-xl text-[#111D21] mt-4"
              >
                Spin Now
              </button>
            )}
          </div>
        </MainContentContainerWrapper>
      </div>
    </ScreenLayout>
  );
}
