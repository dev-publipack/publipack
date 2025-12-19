import { QueryProvider } from "../providers/query-provider";
import { LanguageProvider } from "../providers/language-provider";
import { useGame } from "../hooks/use-game";
import { MainScreen } from "../components/main-screen";
import { GameScreens } from "../components/game-screens";
import { SPONSORS } from "../shared/lib/constants";
import { clarity } from 'react-microsoft-clarity';
import { useEffect } from 'react';

export function Version1Page() {
  const game = useGame();

  useEffect(() => {
    const clarityId = import.meta.env.VITE_CLARITY_ID || 'uiyrsokzzw';
    clarity.init(clarityId);
  }, []);

  return (
    <QueryProvider>
      <LanguageProvider>
        {game.isMainScreen ? (
          <MainScreen
            key="main-screen"
            sponsors={SPONSORS}
            onComplete={game.handleSlotComplete}
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
      </LanguageProvider>
    </QueryProvider>
  );
}

