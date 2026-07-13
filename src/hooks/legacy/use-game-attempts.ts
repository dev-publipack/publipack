import { useState, useCallback, useRef, useEffect } from "react";
import { GAME_RULES } from "@/shared/lib/game-config";
import {
  loadPersistedGameSession,
  writeAttempts,
  clearGameSession,
} from "@/shared/lib/game-session-storage";

/**
 * Hook for managing game attempts logic
 * Persists attempt count across page refreshes
 */
export function useGameAttempts() {
  const persisted = loadPersistedGameSession();
  const [attempts, setAttempts] = useState(persisted.attempts);
  const attemptsRef = useRef(persisted.attempts);

  useEffect(() => {
    attemptsRef.current = attempts;
  }, [attempts]);

  const isCooldown = attempts >= GAME_RULES.MAX_ATTEMPTS;
  const remainingAttempts = Math.max(0, GAME_RULES.MAX_ATTEMPTS - attempts);

  const incrementAttempt = useCallback(() => {
    setAttempts((prev) => {
      const newAttempts = Math.min(prev + 1, GAME_RULES.MAX_ATTEMPTS);
      attemptsRef.current = newAttempts;
      writeAttempts(newAttempts);
      return newAttempts;
    });
  }, []);

  const resetAttempts = useCallback(() => {
    attemptsRef.current = 0;
    setAttempts(0);
    writeAttempts(0);
  }, []);

  const clearSession = useCallback(() => {
    attemptsRef.current = 0;
    setAttempts(0);
    clearGameSession();
  }, []);

  const getCurrentAttempts = useCallback(() => attemptsRef.current, []);

  return {
    attempts,
    isCooldown,
    remainingAttempts,
    maxAttempts: GAME_RULES.MAX_ATTEMPTS,
    incrementAttempt,
    resetAttempts,
    clearSession,
    getCurrentAttempts,
  };
}
