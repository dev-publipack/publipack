import { useState, useEffect, useRef, useCallback } from "react";
import type { Sponsor } from "../shared/types";
import type { GameScreen } from "./use-game-state";

const MAX_ATTEMPTS = 3;
const COUNTDOWN_INITIAL = 5;

interface GameState {
  currentScreen: GameScreen;
  winner: Sponsor | null;
  attempts: number;
  countdownSeconds: number;
  isCountdownActive: boolean;
}

export function useGame() {
  const [state, setState] = useState<GameState>({
    currentScreen: "main",
    winner: null,
    attempts: 0,
    countdownSeconds: COUNTDOWN_INITIAL,
    isCountdownActive: true,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wasOnOtherScreenRef = useRef(false);
  const attemptsRef = useRef(0);

  // Sync ref with state
  useEffect(() => {
    attemptsRef.current = state.attempts;
  }, [state.attempts]);

  const isCooldown = state.attempts >= MAX_ATTEMPTS;
  const isMainScreen = state.currentScreen === "main";

  const goToScreen = useCallback((screen: GameScreen, winner?: Sponsor | null) => {
    setState((prev) => ({
      ...prev,
      currentScreen: screen,
      winner: winner !== undefined ? winner : prev.winner,
    }));
  }, []);

  // Countdown logic
  useEffect(() => {
    // Stop countdown if in cooldown or not on main screen
    if (isCooldown || !isMainScreen || !state.isCountdownActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Start countdown
    if (state.countdownSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.countdownSeconds <= 1) {
            return { ...prev, countdownSeconds: 0 };
          }
          return { ...prev, countdownSeconds: prev.countdownSeconds - 1 };
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.countdownSeconds, state.isCountdownActive, isCooldown, isMainScreen]);

  // Auto-spin when countdown reaches 0
  useEffect(() => {
    if (
      state.countdownSeconds === 0 &&
      isMainScreen &&
      !isCooldown &&
      state.currentScreen === "main"
    ) {
      goToScreen("slotMachine");
    }
  }, [state.countdownSeconds, isMainScreen, isCooldown, state.currentScreen, goToScreen]);

  // Reset countdown when returning to main screen (only if not in cooldown)
  useEffect(() => {
    if (isMainScreen && wasOnOtherScreenRef.current) {
      if (!isCooldown) {
        setState((prev) => ({
          ...prev,
          countdownSeconds: COUNTDOWN_INITIAL,
          isCountdownActive: true,
        }));
      } else {
        // In cooldown - ensure countdown is stopped and set to 0
        setState((prev) => ({
          ...prev,
          countdownSeconds: 0,
          isCountdownActive: false,
        }));
      }
      wasOnOtherScreenRef.current = false;
    } else if (!isMainScreen) {
      wasOnOtherScreenRef.current = true;
    }
  }, [isMainScreen, isCooldown]);

  // Ensure countdown is stopped in cooldown
  useEffect(() => {
    if (isCooldown) {
      setState((prev) => ({
        ...prev,
        isCountdownActive: false,
        countdownSeconds: 0,
      }));
      // Clear interval immediately
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isCooldown]);

  const reset = useCallback(() => {
    attemptsRef.current = 0; // Update ref immediately
    setState({
      currentScreen: "main",
      winner: null,
      attempts: 0,
      countdownSeconds: COUNTDOWN_INITIAL,
      isCountdownActive: true,
    });
    wasOnOtherScreenRef.current = false;
  }, []);

  const setWinner = useCallback((winner: Sponsor | null) => {
    setState((prev) => ({ ...prev, winner }));
  }, []);

  const incrementAttempt = useCallback(() => {
    setState((prev) => {
      const newAttempts = prev.attempts + 1;
      attemptsRef.current = newAttempts; // Update ref immediately
      return {
        ...prev,
        attempts: newAttempts,
      };
    });
  }, []);

  const resetAttempts = useCallback(() => {
    attemptsRef.current = 0; // Update ref immediately
    setState((prev) => ({ ...prev, attempts: 0 }));
  }, []);

  const handleSpin = useCallback(() => {
    if (isCooldown) return;
    goToScreen("slotMachine");
  }, [isCooldown, goToScreen]);

  const handleSlotComplete = useCallback(
    (result: { winner: Sponsor | null; isWin: boolean }) => {
      if (result.isWin && result.winner) {
        setWinner(result.winner);
        resetAttempts();
        setTimeout(() => goToScreen("successConfetti"), 200);
      } else {
        incrementAttempt();
        setTimeout(() => goToScreen("failedAnimation"), 200);
      }
    },
    [setWinner, resetAttempts, incrementAttempt, goToScreen]
  );

  const handleFailedAnimationComplete = useCallback(() => {
    // Use ref to get latest attempts value
    const currentAttempts = attemptsRef.current;
    goToScreen(currentAttempts >= MAX_ATTEMPTS ? "youLost" : "didntWin");
  }, [goToScreen]);

  const handleSpinAgain = useCallback(() => {
    // If on youLost screen with cooldown, just go back to main without resetting attempts
    if (state.currentScreen === "youLost" && isCooldown) {
      goToScreen("main");
      return;
    }
    
    // If on didntWin screen and not in cooldown, spin again
    if (state.currentScreen === "didntWin" && !isCooldown) {
      goToScreen("slotMachine");
      return;
    }
    
    // Default: reset (for other cases)
    reset();
  }, [isCooldown, state.currentScreen, reset, goToScreen]);

  return {
    // State
    currentScreen: state.currentScreen,
    winner: state.winner,
    attempts: state.attempts,
    countdownSeconds: state.countdownSeconds,
    isCooldown,
    isMainScreen,
    maxAttempts: MAX_ATTEMPTS,
    remainingAttempts: MAX_ATTEMPTS - state.attempts,

    // Actions
    handleSpin,
    handleSlotComplete,
    handleFailedAnimationComplete,
    handleSpinAgain,
    handleSuccessConfettiComplete: () => goToScreen("youWon"),
    handleClaim: () => goToScreen("claimReward"),
    handleClaimSubmit: (data: { fullName: string; phone: string; email: string }) => {
      console.log("Claim data:", data);
      reset();
    },
    handleBackFromClaim: () => {
      if (state.winner) {
        goToScreen("youWon");
      } else {
        reset();
      }
    },
  };
}

