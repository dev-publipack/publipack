import { QueryProvider } from "./providers/query-provider";
import { useCountdown } from "./hooks/use-countdown";
import { useGameState } from "./hooks/use-game-state";
import { useAutoSpin } from "./hooks/use-auto-spin";
import { useCountdownReset } from "./hooks/use-countdown-reset";
import { MainScreen } from "./components/main-screen";
import { GameScreens } from "./components/game-screens";
import type { Sponsor } from "./shared/types";

const sponsors = [
  {
    name: "Starbucks",
    reward: "Free Drink",
    logo: "/images/starbucks-logo-7815fe.png",
  },
  {
    name: "Domino's",
    reward: "Free Pizza",
    logo: "/images/dominos-logo.png",
  },
  {
    name: "Apple Store",
    reward: "App Store",
    logo: "/images/apple-store-logo-3afa9e.png",
  },
  {
    name: "Disney",
    reward: "Save up %25",
    logo: "/images/disney-logo.png",
  },
  {
    name: "Netflix",
    reward: "Save up %15",
    logo: "/images/netflix-logo-55fe82.png",
  },
  {
    name: "Nike",
    reward: "10% Off",
    logo: "/images/nike-logo.png",
  },
  {
    name: "AMC",
    reward: "Free Movie",
    logo: "/images/amc-logo-60dd13.png",
  },
  {
    name: "Spotify",
    reward: "Free Month",
    logo: "/images/spotify-logo.png",
  },
];

function App() {
  const { seconds, reset: resetCountdown } = useCountdown(10);
  const { currentScreen, winner, goToScreen, reset: resetGame, setWinner, isMainScreen } =
    useGameState();

  // Auto-reset countdown when returning to main screen
  useCountdownReset({
    isMainScreen,
    onReset: () => resetCountdown(10),
  });

  // Auto-start spin when countdown reaches 0
  useAutoSpin({
    countdownSeconds: seconds,
    currentScreen,
    onSpin: () => goToScreen("slotMachine"),
  });

  const handleSpin = () => {
    goToScreen("slotMachine");
  };

  const handleSlotComplete = (result: { winner: Sponsor | null; isWin: boolean }) => {
    if (result.isWin && result.winner) {
      setWinner(result.winner);
      setTimeout(() => {
        goToScreen("successConfetti");
      }, 200);
    } else {
      setTimeout(() => {
        goToScreen("failedAnimation");
      }, 200);
    }
  };

  const handleFailedAnimationComplete = () => {
    goToScreen("youLost");
  };

  const handleSuccessConfettiComplete = () => {
    goToScreen("youWon");
  };

  const handleClaim = () => {
    goToScreen("claimReward");
  };

  const handleClaimSubmit = (data: { fullName: string; phone: string; email: string }) => {
    console.log("Claim data:", data);
    resetGame();
  };

  const handleSpinAgain = () => {
    resetGame();
  };

  const handleBackFromClaim = () => {
    if (winner) {
      goToScreen("youWon");
    } else {
      resetGame();
    }
  };

  return (
    <QueryProvider>
      {isMainScreen ? (
        <MainScreen sponsors={sponsors} countdownSeconds={seconds} onSpin={handleSpin} />
      ) : (
        <GameScreens
          currentScreen={currentScreen}
          sponsors={sponsors}
          winner={winner}
          onSlotComplete={handleSlotComplete}
          onFailedAnimationComplete={handleFailedAnimationComplete}
          onSuccessConfettiComplete={handleSuccessConfettiComplete}
          onClaim={handleClaim}
          onClaimSubmit={handleClaimSubmit}
          onBackFromClaim={handleBackFromClaim}
          onSpinAgain={handleSpinAgain}
        />
      )}
    </QueryProvider>
  );
}

export default App;
