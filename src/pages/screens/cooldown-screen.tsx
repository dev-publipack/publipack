import { MainContentContainerWrapper } from "@/components/main-content-container-wrapper";
import { ScreenLayout } from "@/shared/ui/wrappers/screen-layout";
import { TimerDisplay } from "@/shared/ui/timer-display";

interface CooldownScreenProps {
  formattedTime: string;
  remainingSeconds: number;
  onSpinNow: () => void;
}

export function CooldownScreen({
  formattedTime,
  remainingSeconds,
  onSpinNow,
}: CooldownScreenProps) {
  const canSpinNow = remainingSeconds <= 0;

  return (
    <ScreenLayout>
      <div className="relative w-full max-w-[480px] flex flex-col items-center overflow-visible">
        <MainContentContainerWrapper headerText="Try Again">
          <div className="p-8 flex flex-col items-center">
            <p className="font-roboto font-black text-[20px] leading-none tracking-normal text-center uppercase text-[#111D21] mb-2 whitespace-nowrap">
              Better Luck Next Spin!
            </p>
            <p className="font-roboto font-black text-[20px] leading-none tracking-normal text-center uppercase text-[#111D21] mb-4 whitespace-nowrap">
              Try again tomorrow
            </p>
            <p className="font-roboto font-black text-[20px] leading-tight tracking-normal text-center uppercase text-[#111D21] mb-6">
              Next spin unlocks in 24 hours
            </p>
            {!canSpinNow && (
              <div className="flex flex-col items-center gap-2 mb-6">
                <TimerDisplay formattedTime={formattedTime} />
              </div>
            )}
            {canSpinNow && (
              <button
                onClick={onSpinNow}
                className="w-full h-14 rounded-full bg-[#AEFB8B] border-4 border-[#DCF7CD] font-bungee text-xl text-[#111D21]"
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
