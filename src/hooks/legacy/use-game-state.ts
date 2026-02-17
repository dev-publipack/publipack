import { useState, useCallback, useRef, useEffect } from "react";
import type { Sponsor } from "@/shared/types";

export type GameScreen =
  | "main"
  | "slotMachine"
  | "successConfetti"
  | "youWon"
  | "failedAnimation"
  | "didntWin"
  | "youLost"
  | "claimReward"
  | "claimSuccess";

interface GameState {
  currentScreen: GameScreen;
  winner: Sponsor | null;
  attempts: number;
}

const MAX_ATTEMPTS = 3;

export function useGameState() {
  const [state, setState] = useState<GameState>({
    currentScreen: "main",
    winner: null,
    attempts: 0,
  });

  // Use ref to track current attempts for synchronous access
  const attemptsRef = useRef(0);

  // Sync ref with state
  useEffect(() => {
    attemptsRef.current = state.attempts;
  }, [state.attempts]);

  const goToScreen = useCallback((screen: GameScreen, winner?: Sponsor | null) => {
    setState((prev) => ({
      currentScreen: screen,
      winner: winner !== undefined ? winner : prev.winner,
      attempts: prev.attempts,
    }));
  }, []);

  const getAttempts = useCallback(() => {
    return attemptsRef.current;
  }, []);

  const reset = useCallback(() => {
    attemptsRef.current = 0; // Update ref immediately
    setState({
      currentScreen: "main",
      winner: null,
      attempts: 0,
    });
  }, []);

  const setWinner = useCallback((winner: Sponsor | null) => {
    setState((prev) => ({
      ...prev,
      winner,
    }));
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
    setState((prev) => ({
      ...prev,
      attempts: 0,
    }));
  }, []);

  return {
    currentScreen: state.currentScreen,
    winner: state.winner,
    attempts: state.attempts,
    maxAttempts: MAX_ATTEMPTS,
    remainingAttempts: MAX_ATTEMPTS - state.attempts,
    goToScreen,
    reset,
    setWinner,
    incrementAttempt,
    resetAttempts,
    getAttempts,
    isMainScreen: state.currentScreen === "main",
  };
}

