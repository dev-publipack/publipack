import { useCallback } from "react";
import type { Sponsor } from "../shared/types";
import { TIMING, GAME_RULES } from "@/shared/lib/game-config";
import { useGameAttempts } from "./use-game-attempts";
import { useGameCountdown } from "./use-game-countdown";
import { useGameNavigation } from "./use-game-navigation";

/**
 * Main game hook - orchestrates game flow using composition of smaller hooks
 * Much simpler and easier to understand than the original monolithic version
 */
export function useGame() {
  const navigation = useGameNavigation();
  const attempts = useGameAttempts();
  
  const countdown = useGameCountdown({
    isMainScreen: navigation.isMainScreen,
    isCooldown: attempts.isCooldown,
    // No need for onCountdownEnd - CombinedSlotMachine handles animation automatically
    onCountdownEnd: undefined,
  });

  const reset = useCallback(() => {
    attempts.resetAttempts();
    countdown.resetCountdown();
    navigation.reset();
  }, [attempts, countdown, navigation]);

  const handleSpin = useCallback(() => {
    // This is now handled directly by CombinedSlotMachine
    // No need to transition screens - everything happens on main screen
    if (attempts.isCooldown) return;
  }, [attempts.isCooldown]);

  const handleSlotComplete = useCallback(
    (result: { winner: Sponsor | null; isWin: boolean }) => {
      if (result.isWin && result.winner) {
        navigation.setWinner(result.winner);
        attempts.resetAttempts();
        setTimeout(() => navigation.goToScreen("successConfetti"), TIMING.TRANSITION_DELAY);
      } else {
        attempts.incrementAttempt();
        setTimeout(() => navigation.goToScreen("failedAnimation"), TIMING.TRANSITION_DELAY);
      }
    },
    [navigation, attempts]
  );

  const handleFailedAnimationComplete = useCallback(() => {
    const currentAttempts = attempts.getCurrentAttempts();
    navigation.goToScreen(
      currentAttempts >= GAME_RULES.MAX_ATTEMPTS ? "youLost" : "didntWin"
    );
  }, [navigation, attempts]);

  const handleSpinAgain = useCallback(() => {
    // If on youLost screen with cooldown, just go back to main
    if (navigation.currentScreen === "youLost" && attempts.isCooldown) {
      navigation.goToScreen("main");
      return;
    }
    
    // If on didntWin screen and not in cooldown, spin again
    if (navigation.currentScreen === "didntWin" && !attempts.isCooldown) {
      navigation.goToScreen("slotMachine");
      return;
    }
    
    // Default: reset
    reset();
  }, [attempts.isCooldown, navigation, reset]);

  return {
    // State
    currentScreen: navigation.currentScreen,
    winner: navigation.winner,
    attempts: attempts.attempts,
    countdownSeconds: countdown.countdownSeconds,
    isCooldown: attempts.isCooldown,
    isMainScreen: navigation.isMainScreen,
    maxAttempts: attempts.maxAttempts,
    remainingAttempts: attempts.remainingAttempts,
    claimEmail: navigation.claimEmail,

    // Actions
    handleSpin,
    handleSlotComplete,
    handleFailedAnimationComplete,
    handleSpinAgain,
    handleSuccessConfettiComplete: () => navigation.goToScreen("youWon"),
    handleClaim: () => navigation.goToScreen("claimReward"),
    handleClaimSubmit: (data: { fullName: string; phone: string; email: string }) => {
      console.log("Claim data:", data);
      navigation.setClaimEmail(data.email);
      navigation.goToScreen("claimSuccess");
    },
    handleBackFromClaim: () => {
      if (navigation.winner) {
        navigation.goToScreen("youWon");
      } else {
        reset();
      }
    },
    handlePlayAgainFromSuccess: reset,
  };
}

