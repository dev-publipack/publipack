import { useState, useCallback } from "react";
import type { Sponsor } from "../shared/types";

export type GameScreen =
  | "main"
  | "slotMachine"
  | "successConfetti"
  | "youWon"
  | "failedAnimation"
  | "youLost"
  | "claimReward";

interface GameState {
  currentScreen: GameScreen;
  winner: Sponsor | null;
}

export function useGameState() {
  const [state, setState] = useState<GameState>({
    currentScreen: "main",
    winner: null,
  });

  const goToScreen = useCallback((screen: GameScreen, winner?: Sponsor | null) => {
    setState((prev) => ({
      currentScreen: screen,
      winner: winner !== undefined ? winner : prev.winner,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      currentScreen: "main",
      winner: null,
    });
  }, []);

  const setWinner = useCallback((winner: Sponsor | null) => {
    setState((prev) => ({
      ...prev,
      winner,
    }));
  }, []);

  return {
    currentScreen: state.currentScreen,
    winner: state.winner,
    goToScreen,
    reset,
    setWinner,
    isMainScreen: state.currentScreen === "main",
  };
}

