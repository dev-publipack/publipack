import { useState, useEffect, useCallback, useRef } from "react";
import {
  COOLDOWN_STORAGE_KEY,
  startCooldown as persistStartCooldown,
  clearCooldown as persistClearCooldown,
  getRemainingCooldownSeconds,
  isCooldownActive,
} from "@/shared/lib/game-session-storage";

export { COOLDOWN_STORAGE_KEY };

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

export function formatSecondsToHMS(seconds: number): string {
  if (seconds <= 0) return "00:00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}

interface UseCooldownTimerProps {
  isActive: boolean;
  onComplete?: () => void;
}

export function useCooldownTimer({ isActive, onComplete }: UseCooldownTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    isActive || isCooldownActive() ? getRemainingCooldownSeconds() : 0
  );
  const completedRef = useRef(false);

  const startCooldown = useCallback(() => {
    completedRef.current = false;
    persistStartCooldown();
    setRemainingSeconds(getRemainingCooldownSeconds());
  }, []);

  const clearCooldown = useCallback(() => {
    persistClearCooldown();
    setRemainingSeconds(0);
  }, []);

  const isInCooldown = remainingSeconds > 0;

  useEffect(() => {
    if (!isActive && !isCooldownActive()) return;

    const tick = () => {
      const remaining = getRemainingCooldownSeconds();
      setRemainingSeconds(remaining);
      if (remaining <= 0) {
        if (!completedRef.current) {
          completedRef.current = true;
          // Do not auto-reset session; user clicks Spin Now
        }
      }
    };

    tick();
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, [isActive, onComplete]);

  return {
    remainingSeconds,
    formattedTime: formatSecondsToHMS(remainingSeconds),
    isInCooldown,
    startCooldown,
    clearCooldown,
  };
}
