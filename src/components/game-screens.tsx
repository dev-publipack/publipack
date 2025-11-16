import {
  SlotMachine,
  YouWon,
  YouLost,
  DidntWin,
  ClaimReward,
  FailedAnimation,
  SuccessConfettiAnimation,
} from "../shared";
import type { Sponsor } from "../shared/types";
import type { GameScreen } from "../hooks/use-game-state";

interface GameScreensProps {
  currentScreen: GameScreen;
  sponsors: Sponsor[];
  winner: Sponsor | null;
  onSlotComplete: (result: { winner: Sponsor | null; isWin: boolean }) => void;
  onFailedAnimationComplete: () => void;
  onSuccessConfettiComplete: () => void;
  onClaim: () => void;
  onClaimSubmit: (data: { fullName: string; phone: string; email: string }) => void;
  onBackFromClaim: () => void;
  onSpinAgain: () => void;
  showCooldown?: boolean;
}

export function GameScreens({
  currentScreen,
  sponsors,
  winner,
  onSlotComplete,
  onFailedAnimationComplete,
  onSuccessConfettiComplete,
  onClaim,
  onClaimSubmit,
  onBackFromClaim,
  onSpinAgain,
  showCooldown = false,
}: GameScreensProps) {
  if (currentScreen === "claimReward" && winner) {
    return (
      <main
        className="min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden px-4 sm:px-6 md:px-8"
        style={{
          background: "#F6F8FB",
        }}
      >
        <div className="w-full max-w-[1080px] flex flex-col items-center">
          <ClaimReward
            winner={winner}
            onSubmit={onClaimSubmit}
            onBack={onBackFromClaim}
          />
        </div>
      </main>
    );
  }

  if (currentScreen === "successConfetti") {
    return (
      <main
        className="min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden px-4 sm:px-6 md:px-8"
        style={{
          background:
            "linear-gradient(136deg, rgba(246, 248, 251, 1) 12%, rgba(255, 207, 178, 1) 100%)",
        }}
      >
        <div className="w-full max-w-[1080px] flex flex-col items-center justify-center py-4 sm:py-6 md:py-8">
          <SuccessConfettiAnimation onComplete={onSuccessConfettiComplete} />
        </div>
      </main>
    );
  }

  if (currentScreen === "youWon" && winner) {
    return (
      <main
        className="min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden px-4 sm:px-6 md:px-8"
        style={{
          background:
            "linear-gradient(136deg, rgba(246, 248, 251, 1) 12%, rgba(255, 207, 178, 1) 100%)",
        }}
      >
        <div className="w-full max-w-[1080px] flex flex-col items-center justify-center py-4 sm:py-6 md:py-8">
          <YouWon
            winner={winner}
            onClaim={onClaim}
            onSpinAgain={onSpinAgain}
            brandLink="https://example.com"
            showCooldown={showCooldown}
          />
        </div>
      </main>
    );
  }

  if (currentScreen === "failedAnimation") {
    return (
      <main
        className="min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden px-4 sm:px-6 md:px-8"
        style={{
          background:
            "linear-gradient(136deg, rgba(246, 248, 251, 1) 19%, rgba(255, 207, 178, 1) 100%)",
        }}
      >
        <div className="w-full max-w-[1080px] flex flex-col items-center justify-center py-4 sm:py-6 md:py-8">
          <FailedAnimation onComplete={onFailedAnimationComplete} />
        </div>
      </main>
    );
  }

  if (currentScreen === "didntWin") {
    return (
      <main
        className="min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden px-4 sm:px-6 md:px-8"
        style={{
          background:
            "linear-gradient(136deg, rgba(246, 248, 251, 1) 19%, rgba(255, 207, 178, 1) 100%)",
        }}
      >
        <div className="w-full max-w-[1080px] flex flex-col items-center justify-center py-4 sm:py-6 md:py-8">
          <DidntWin onSpinAgain={onSpinAgain} />
        </div>
      </main>
    );
  }

  if (currentScreen === "youLost") {
    return (
      <main
        className="min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden px-4 sm:px-6 md:px-8"
        style={{
          background:
            "linear-gradient(136deg, rgba(246, 248, 251, 1) 19%, rgba(255, 207, 178, 1) 100%)",
        }}
      >
        <div className="w-full max-w-[1080px] flex flex-col items-center justify-center py-4 sm:py-6 md:py-8">
          <YouLost onTryAgain={onSpinAgain} />
        </div>
      </main>
    );
  }

  if (currentScreen === "slotMachine") {
    return (
      <main
        className="min-h-screen w-full flex flex-col items-center justify-center overflow-x-hidden px-4 sm:px-6 md:px-8"
        style={{
          background:
            "linear-gradient(137deg, rgba(246, 248, 251, 1) 7%, rgba(255, 207, 178, 1) 100%)",
        }}
      >
        <div className="w-full max-w-[1080px] flex flex-col items-center justify-center py-4 sm:py-6 md:py-8">
          <SlotMachine sponsors={sponsors} onComplete={onSlotComplete} />
        </div>
      </main>
    );
  }

  return null;
}

