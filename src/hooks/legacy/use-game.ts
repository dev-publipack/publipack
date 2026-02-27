import { useCallback } from "react";
import type { Sponsor } from "@/shared/types";
import { TIMING, GAME_RULES } from "@/shared/lib/game-config";
import { pipedreamClient } from "@/shared/api/pipedream-client";
import { brevoClient } from "@/shared/api/brevo-client";
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
    handleClaimSubmit: async (data: { fullName: string; email: string; phone: string }) => {
      const winner = navigation.winner;
      if (winner) {
        try {
          await pipedreamClient.submitLead({
            fullName: data.fullName,
            phone: data.phone,
            email: data.email,
            sponsorName: winner.name,
            sponsorReward: winner.reward,
          });
          await brevoClient.sendEmail({
            to: data.email,
            subject: "🎉 Thanks for playing with app.publipacks.com",
            brandUrl: winner.url,
            fullName: data.fullName,
            htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
              <h1 style="color: #163446; text-align: center; margin-bottom: 30px;">🎉 Thanks for playing!</h1>
              <p>Hi ${data.fullName},</p>
              <p>Thank you for playing with publipacks.com! The safest platform to win amazing awards near you!</p>
              <div style="background: #E9F9FF; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #44D2FD;">
                <p style="margin: 0; font-weight: bold; color: #124258;">👉 Congratulations — you've won a prize!</p>
                <p style="margin: 10px 0 0 0; color: #154F6A;">${winner.name}: ${winner.reward}</p>
              </div>
              <p>Enjoy free prizes and exclusive discounts all around the world.</p>
              <p>Sign up to receive free offers directly to your email, — <a href="${winner.url || ""}" style="color: #44D2FD; text-decoration: none;"> click here to join</a>.</p>
              <p>Keep playing, keep winning, and keep discovering amazing rewards!</p>
              <p style="margin-top: 30px;">Cheers,<br><strong>The app.publipacks.com Team</strong></p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 40px 0 20px 0;">
              <div style="text-align: center; font-size: 12px; color: #666; margin-top: 20px;">
                <p style="margin: 5px 0;">©️ 2025 Publicpacks.com. All rights reserved.</p>
              </div>
            </div>
          `,
            textContent: `Hi ${data.fullName},\n\nThank you for playing! The safest platform to win amazing awards near you!\n\n👉 Congratulations — you've won a prize!\n${winner.name}: ${winner.reward}\n\nEnjoy free prizes and exclusive discounts all around the world.\n\nSign up to receive free offers directly to your email, — click here to join: ${winner.url || ""}\n\nKeep playing, keep winning, and keep discovering amazing rewards!\n\nCheers,\nThe app.publipacks.com Team\n\n©️ 2025 Publipacks.com. All rights reserved.`,
          });
        } catch (err) {
          console.error("Claim submit error (Pipedream/Brevo):", err);
        }
      }
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

