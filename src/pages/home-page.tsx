import { useEffect, useRef, useState, useCallback } from "react";
import { QueryProvider } from "@/providers/query-provider";
import { LanguageProvider } from "@/providers/language-provider";
import { useGame } from "@/hooks/legacy/use-game";
import { useCooldownTimer, COOLDOWN_STORAGE_KEY } from "@/hooks/use-cooldown-timer";
import { formatSecondsToHMS } from "@/hooks/use-cooldown-timer";
import {
  SpinScreen,
  WinScreen,
  ClaimScreen,
  ClaimSuccessScreen,
  TryAgainScreen,
  SuccessConfettiScreen,
  FailedAnimationScreen,
} from "./screens";
import { SPONSORS } from "@/shared/lib/constants";
import type { GameScreen } from "@/hooks/legacy/use-game-state";

const MOCK_SCREENS: { value: GameScreen | ""; label: string }[] = [
  { value: "", label: "Real (game flow)" },
  { value: "main", label: "1. Spin" },
  { value: "youWon", label: "2. Win" },
  { value: "claimReward", label: "3. Claim" },
  { value: "claimSuccess", label: "4. Claim Success" },
  { value: "successConfetti", label: "Success Confetti" },
  { value: "failedAnimation", label: "Failed Animation" },
  { value: "didntWin", label: "Try Again" },
];

const MOCK_WINNER = SPONSORS[0];
const MOCK_TIMER_SECONDS = 86390; // 23:59:50 for layout testing

export default function HomePage() {
  const game = useGame();
  const cooldownStartedRef = useRef(false);
  const [spinKey, setSpinKey] = useState(0);
  const [autoSpinNext, setAutoSpinNext] = useState(false);
  const [mockScreen, setMockScreen] = useState<GameScreen | "">("");

  const handleSpinAgain = useCallback(() => {
    if (game.currentScreen === "youWon") {
      setAutoSpinNext(true);
    }
    setSpinKey((k) => k + 1);
    game.handleSpinAgain();
  }, [game.handleSpinAgain, game.currentScreen]);

  const handlePlayAgain = useCallback(() => {
    setSpinKey((k) => k + 1);
    game.handlePlayAgainFromSuccess();
  }, [game.handlePlayAgainFromSuccess]);

  const isCooldownScreen =
    game.currentScreen === "youLost" ||
    game.currentScreen === "claimSuccess" ||
    game.currentScreen === "didntWin";

  const cooldown = useCooldownTimer({
    isActive: isCooldownScreen,
    onComplete: game.handlePlayAgainFromSuccess,
  });

  useEffect(() => {
    if (!isCooldownScreen) {
      cooldownStartedRef.current = false;
      return;
    }
    if (cooldownStartedRef.current) return;
    try {
      const stored = localStorage.getItem(COOLDOWN_STORAGE_KEY);
      if (stored) return;
    } catch {
      // ignore
    }
    cooldownStartedRef.current = true;
    cooldown.startCooldown();
  }, [isCooldownScreen, cooldown.startCooldown]);

  const activeScreen = mockScreen || game.currentScreen;

  return (
    <QueryProvider>
      <LanguageProvider>
        {/* Mock screen selector for testing */}
        <div className="fixed top-2 left-2 z-50 bg-black/80 text-white px-3 py-2 rounded-lg text-sm">
          <label className="block mb-1 text-xs opacity-80">Test screen:</label>
          <select
            value={mockScreen}
            onChange={(e) => setMockScreen((e.target.value || "") as GameScreen | "")}
            className="bg-white/20 border border-white/40 rounded px-2 py-1 text-white cursor-pointer"
          >
            {MOCK_SCREENS.map(({ value, label }) => (
              <option key={value || "real"} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {activeScreen === "main" || activeScreen === "slotMachine" ? (
          <SpinScreen
            key={spinKey}
            onComplete={game.handleSlotComplete}
            autoStart={autoSpinNext}
            onAutoSpinConsumed={() => setAutoSpinNext(false)}
          />
        ) : activeScreen === "youWon" ? (
          <WinScreen
            winner={game.winner || MOCK_WINNER}
            onClaim={game.handleClaim}
            onSpinAgain={handleSpinAgain}
          />
        ) : activeScreen === "claimReward" ? (
          <ClaimScreen
            winner={game.winner || MOCK_WINNER}
            onSubmit={game.handleClaimSubmit}
            onBack={game.handleBackFromClaim}
          />
        ) : activeScreen === "claimSuccess" ? (
          <ClaimSuccessScreen
            winner={game.winner || MOCK_WINNER}
            formattedTime={
              mockScreen ? formatSecondsToHMS(MOCK_TIMER_SECONDS) : cooldown.formattedTime
            }
            remainingSeconds={
              mockScreen ? MOCK_TIMER_SECONDS : cooldown.remainingSeconds
            }
            onPlayAgain={handlePlayAgain}
          />
        ) : activeScreen === "successConfetti" ? (
          <SuccessConfettiScreen
            onComplete={game.handleSuccessConfettiComplete}
          />
        ) : activeScreen === "failedAnimation" ? (
          <FailedAnimationScreen
            onComplete={game.handleFailedAnimationComplete}
          />
        ) : (activeScreen === "didntWin" || activeScreen === "youLost") ? (
          <TryAgainScreen
            formattedTime={
              mockScreen ? formatSecondsToHMS(MOCK_TIMER_SECONDS) : cooldown.formattedTime
            }
            remainingSeconds={
              mockScreen ? MOCK_TIMER_SECONDS : cooldown.remainingSeconds
            }
            onSpinAgain={activeScreen === "youLost" ? handlePlayAgain : handleSpinAgain}
          />
        ) : null}
      </LanguageProvider>
    </QueryProvider>
  );
}
