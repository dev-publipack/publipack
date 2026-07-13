import { useCallback } from "react";
import type { Sponsor } from "@/shared/types";
import { TIMING, GAME_RULES } from "@/shared/lib/game-config";
import { pipedreamClient } from "@/shared/api/pipedream-client";
import { buildClaimEmail } from "@/shared/lib/build-claim-email";
import { downloadClaimPdf } from "@/shared/lib/download-claim-pdf";
import {
  lockForExhaustedAttempts,
  lockForClaimSuccess,
  writeAttempts,
  isCooldownActive,
} from "@/shared/lib/game-session-storage";
import { useGameAttempts } from "./use-game-attempts";
import { useGameCountdown } from "./use-game-countdown";
import { useGameNavigation } from "./use-game-navigation";

/**
 * Main game hook - orchestrates game flow using composition of smaller hooks
 * Attempts and 24h cooldown persist across page refreshes
 */
export function useGame() {
  const navigation = useGameNavigation();
  const attempts = useGameAttempts();

  const countdown = useGameCountdown({
    isMainScreen: navigation.isMainScreen,
    isCooldown: attempts.isCooldown,
    onCountdownEnd: undefined,
  });

  const reset = useCallback(() => {
    attempts.clearSession();
    countdown.resetCountdown();
    navigation.reset();
  }, [attempts, countdown, navigation]);

  const handleSpin = useCallback(() => {
    if (attempts.isCooldown || isCooldownActive()) return;
  }, [attempts.isCooldown]);

  const handleSlotComplete = useCallback(
    (result: { winner: Sponsor | null; isWin: boolean }) => {
      if (result.isWin && result.winner) {
        navigation.setWinner(result.winner);
        attempts.resetAttempts();
        writeAttempts(0);
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
    if (currentAttempts >= GAME_RULES.MAX_ATTEMPTS) {
      lockForExhaustedAttempts();
      navigation.goToScreen("youLost");
      return;
    }
    navigation.goToScreen("didntWin");
  }, [navigation, attempts]);

  const handleSpinAgain = useCallback(() => {
    if (navigation.currentScreen === "youLost" && attempts.isCooldown) {
      // Stay locked during cooldown – home page shows timer; don't reset early
      return;
    }

    if (navigation.currentScreen === "didntWin" && !attempts.isCooldown) {
      navigation.goToScreen("slotMachine");
      return;
    }

    reset();
  }, [attempts.isCooldown, navigation, reset]);

  return {
    currentScreen: navigation.currentScreen,
    winner: navigation.winner,
    attempts: attempts.attempts,
    countdownSeconds: countdown.countdownSeconds,
    isCooldown: attempts.isCooldown || isCooldownActive(),
    isMainScreen: navigation.isMainScreen,
    maxAttempts: attempts.maxAttempts,
    remainingAttempts: attempts.remainingAttempts,
    claimEmail: navigation.claimEmail,
    claimFullName: navigation.claimFullName,

    handleSpin,
    handleSlotComplete,
    handleFailedAnimationComplete,
    handleSpinAgain,
    handleSuccessConfettiComplete: () => navigation.goToScreen("youWon"),
    handleClaim: () => navigation.goToScreen("claimReward"),
    handleClaimSubmit: async (data: { fullName: string; email: string; phone: string }) => {
      const winner = navigation.winner;
      if (winner) {
        try {
          const claimEmail = buildClaimEmail({
            fullName: data.fullName,
            sponsorName: winner.name,
            sponsorReward: winner.reward,
            brandUrl: winner.url,
          });

          await pipedreamClient.submitLead({
            fullName: data.fullName,
            phone: data.phone,
            email: data.email,
            sponsorName: winner.name,
            sponsorReward: winner.reward,
            brandUrl: winner.url,
            emailSubject: claimEmail.subject,
            emailHtml: claimEmail.htmlContent,
            emailText: claimEmail.textContent,
          });
        } catch (err) {
          console.error("Claim submit error (Pipedream):", err);
        }
        lockForClaimSuccess(winner);
      }
      navigation.setClaimEmail(data.email);
      navigation.setClaimFullName(data.fullName);
      navigation.goToScreen("claimSuccess");
    },
    handleBackFromClaim: () => {
      if (navigation.winner) {
        navigation.goToScreen("youWon");
      } else {
        reset();
      }
    },
    handlePlayAgainFromSuccess: () => {
      // Only allow after cooldown finished (remaining handled by UI)
      if (isCooldownActive()) return;
      reset();
    },
    handleDownloadClaimPdf: async () => {
      const winner = navigation.winner;
      if (!winner) return;
      await downloadClaimPdf({
        fullName: navigation.claimFullName || "Player",
        sponsorName: winner.name,
        sponsorReward: winner.reward,
        brandUrl: winner.url,
      });
    },
  };
}
