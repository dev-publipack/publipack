import { MachineContainer } from "@/components/machine-container";
import { MainContentContainerWrapper } from "@/components/main-content-container-wrapper";
import { ScreenLayout } from "@/shared/ui/wrappers/screen-layout";
import type { Sponsor } from "@/shared/types";

interface WinScreenProps {
  winner: Sponsor;
  onClaim: () => void;
  onSpinAgain: () => void;
}

const CLAIM_BUTTON_STYLE = {
  fontFamily: "Bungee, sans-serif",
  WebkitTextStroke: "2px #FF8B00",
  textShadow: "0px 0px 5px rgba(0, 0, 0, 0.25)",
  color: "#F2EBEE",
} as const;

export function WinScreen({ winner, onClaim, onSpinAgain }: WinScreenProps) {
  return (
    <ScreenLayout>
      <div className="relative w-full max-w-[480px] flex flex-col items-center overflow-visible">
        <MachineContainer variant="expanded">
          <MainContentContainerWrapper
            headerText="! WINNER !"
            showChainBlock
          >
            <div className="flex flex-col items-center justify-center px-6 py-4 sm:px-8 sm:py-6 min-h-0">
              <img
                src={winner.logo}
                alt={winner.name}
                className="h-16 object-contain mb-1"
              />
              <p className="text-center font-roboto font-black text-[15px] leading-none uppercase text-[#000000] mb-1">
                You have won
              </p>
              <p className="text-center font-roboto font-black text-[24px] sm:text-[28px] leading-tight uppercase text-[#000000] mb-1">
                {winner.reward || "a prize"}
              </p>
              {winner.text && (
                <p className="text-center font-roboto font-black text-[15px] leading-none uppercase text-[#000000]">
                  {winner.text}
                </p>
              )}
              <div className="flex flex-col gap-2 w-full max-w-[280px] mt-4">
                <button
                  onClick={onClaim}
                  className="w-full py-3 px-6 rounded-[20px] border-4 bg-[#AEFB8B] border-[#DCF7CD] shadow-[0_0_5px_1px_rgba(0,0,0,0.25)] flex items-center justify-center font-bungee text-xl"
                  style={CLAIM_BUTTON_STYLE}
                >
                  Claim Now
                </button>
                <button
                  onClick={onSpinAgain}
                  className="w-full py-2.5 px-5 rounded-[20px] border-2 border-[#FF8B00] bg-transparent font-bungee text-base text-[#111D21]"
                >
                  Spin Again
                </button>
              </div>
            </div>
          </MainContentContainerWrapper>
        </MachineContainer>
      </div>
    </ScreenLayout>
  );
}
