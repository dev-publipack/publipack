import { useState, useCallback } from "react";
import type { Sponsor } from "@/shared/types";
import type { GameScreen } from "./use-game-state";
import {
  loadPersistedGameSession,
  type StoredWinner,
} from "@/shared/lib/game-session-storage";

interface GameNavigationState {
  currentScreen: GameScreen;
  winner: Sponsor | null;
  claimEmail: string | null;
  claimFullName: string | null;
}

function toSponsor(winner: StoredWinner | null): Sponsor | null {
  if (!winner) return null;
  return {
    name: winner.name,
    reward: winner.reward,
    logo: winner.logo,
    url: winner.url || "",
  };
}

function getInitialState(): GameNavigationState {
  const persisted = loadPersistedGameSession();
  if (persisted.cooldownActive && persisted.lockScreen) {
    return {
      currentScreen: persisted.lockScreen,
      winner: toSponsor(persisted.winner),
      claimEmail: null,
      claimFullName: null,
    };
  }
  return {
    currentScreen: "main",
    winner: null,
    claimEmail: null,
    claimFullName: null,
  };
}

/**
 * Hook for managing game screen navigation and related state
 * Restores lock screens (youLost / claimSuccess) after refresh during cooldown
 */
export function useGameNavigation() {
  const [state, setState] = useState<GameNavigationState>(getInitialState);

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

  const setClaimFullName = useCallback((fullName: string | null) => {
    setState((prev) => ({ ...prev, claimFullName: fullName }));
  }, []);

  const reset = useCallback(() => {
    setState({
      currentScreen: "main",
      winner: null,
      claimEmail: null,
      claimFullName: null,
    });
  }, []);

  return {
    currentScreen: state.currentScreen,
    winner: state.winner,
    claimEmail: state.claimEmail,
    claimFullName: state.claimFullName,
    isMainScreen,
    goToScreen,
    setWinner,
    setClaimEmail,
    setClaimFullName,
    reset,
  };
}
