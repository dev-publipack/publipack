import { useState, useCallback } from "react";
import type { Sponsor } from "@/shared/types";
import type { GameScreen } from "./use-game-state";

interface GameNavigationState {
  currentScreen: GameScreen;
  winner: Sponsor | null;
  claimEmail: string | null;
}

/**
 * Hook for managing game screen navigation and related state
 * Handles transitions between different game screens
 */
export function useGameNavigation() {
  const [state, setState] = useState<GameNavigationState>({
    currentScreen: "main",
    winner: null,
    claimEmail: null,
  });

  const isMainScreen = state.currentScreen === "main";

  const goToScreen = useCallback((screen: GameScreen, winner?: Sponsor | null) => {
    setState((prev) => ({
      ...prev,
      currentScreen: screen,
      winner: winner !== undefined ? winner : prev.winner,
    }));
  }, []);

  const setWinner = useCallback((winner: Sponsor | null) => {
    setState((prev) => ({ ...prev, winner }));
  }, []);

  const setClaimEmail = useCallback((email: string | null) => {
    setState((prev) => ({ ...prev, claimEmail: email }));
  }, []);

  const reset = useCallback(() => {
    setState({
      currentScreen: "main",
      winner: null,
      claimEmail: null,
    });
  }, []);

  return {
    currentScreen: state.currentScreen,
    winner: state.winner,
    claimEmail: state.claimEmail,
    isMainScreen,
    goToScreen,
    setWinner,
    setClaimEmail,
    reset,
  };
}

