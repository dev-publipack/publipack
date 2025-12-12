import { useState, useCallback, useRef, useEffect } from "react";
import { GAME_RULES } from "@/shared/lib/game-config";

/**
 * Hook for managing game attempts logic
 * Handles attempt counting and cooldown state
 */
export function useGameAttempts() {
  const [attempts, setAttempts] = useState(0);
  const attemptsRef = useRef(0);

  // Sync ref with state for immediate access
  useEffect(() => {
    attemptsRef.current = attempts;
  }, [attempts]);

  const isCooldown = attempts >= GAME_RULES.MAX_ATTEMPTS;
  const remainingAttempts = GAME_RULES.MAX_ATTEMPTS - attempts;

  const incrementAttempt = useCallback(() => {
    setAttempts((prev) => {
      const newAttempts = prev + 1;
      attemptsRef.current = newAttempts;
      return newAttempts;
    });
  }, []);

  const resetAttempts = useCallback(() => {
    attemptsRef.current = 0;
    setAttempts(0);
  }, []);

  const getCurrentAttempts = useCallback(() => attemptsRef.current, []);

  return {
    attempts,
    isCooldown,
    remainingAttempts,
    maxAttempts: GAME_RULES.MAX_ATTEMPTS,
    incrementAttempt,
    resetAttempts,
    getCurrentAttempts,
  };
}

