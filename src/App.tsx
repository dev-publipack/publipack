import { QueryProvider } from "./providers/query-provider";
import { useGame } from "./hooks/use-game";
import { MainScreen } from "./components/main-screen";
import { GameScreens } from "./components/game-screens";
import { SPONSORS } from "./shared/lib/constants";


function App() {
  const game = useGame();

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
          onSlotComplete={game.handleSlotComplete}
          onFailedAnimationComplete={game.handleFailedAnimationComplete}
          onSuccessConfettiComplete={game.handleSuccessConfettiComplete}
          onClaim={game.handleClaim}
          onClaimSubmit={game.handleClaimSubmit}
          onBackFromClaim={game.handleBackFromClaim}
          onSpinAgain={game.handleSpinAgain}
          showCooldown={game.isCooldown}
        />
      )}
    </QueryProvider>
  );
}

export default App;