import { QueryProvider } from "./providers/query-provider";
import { useGame } from "./hooks/use-game";
import { MainScreen } from "./components/main-screen";
import { GameScreens } from "./components/game-screens";
import { SPONSORS } from "./shared/lib/constants";
import { clarity } from 'react-microsoft-clarity';
import { useEffect } from 'react';

function App() {
  const game = useGame();

  useEffect(() => {
    const clarityId = import.meta.env.VITE_CLARITY_ID || 'ugs7y6qlhv';
    clarity.init(clarityId);
  }, []);

  return (
    <QueryProvider>
      {game.isMainScreen ? (
        <MainScreen
          sponsors={SPONSORS}
          countdownSeconds={game.countdownSeconds}
          onSpin={game.handleSpin}
          showCooldown={game.isCooldown}
        />
      ) : (
        <GameScreens
          currentScreen={game.currentScreen}
          sponsors={SPONSORS}
          winner={game.winner}
          claimEmail={game.claimEmail}
          onSlotComplete={game.handleSlotComplete}
          onFailedAnimationComplete={game.handleFailedAnimationComplete}
          onSuccessConfettiComplete={game.handleSuccessConfettiComplete}
          onClaim={game.handleClaim}
          onClaimSubmit={game.handleClaimSubmit}
          onBackFromClaim={game.handleBackFromClaim}
          onSpinAgain={game.handleSpinAgain}
          onPlayAgainFromSuccess={game.handlePlayAgainFromSuccess}
          showCooldown={game.isCooldown}
        />
      )}
    </QueryProvider>
  );
}

export default App;