import { useState, useEffect, useCallback } from "react";
import { COOLDOWN_DURATION_SECONDS } from "@/config/redesign-game-config";

export const COOLDOWN_STORAGE_KEY = "publipack_cooldown_end";

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
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const startCooldown = useCallback(() => {
    const endTime = Date.now() + COOLDOWN_DURATION_SECONDS * 1000;
    try {
      localStorage.setItem(COOLDOWN_STORAGE_KEY, String(endTime));
    } catch {
      // ignore
    }
    setRemainingSeconds(COOLDOWN_DURATION_SECONDS);
  }, []);

  const clearCooldown = useCallback(() => {
    try {
      localStorage.removeItem(COOLDOWN_STORAGE_KEY);
    } catch {
      // ignore
    }
    setRemainingSeconds(0);
  }, []);

  const isInCooldown = remainingSeconds > 0;

  useEffect(() => {
    if (!isActive) return;

    const tick = () => {
      try {
        const stored = localStorage.getItem(COOLDOWN_STORAGE_KEY);
        if (!stored) {
          setRemainingSeconds(0);
          return;
        }
        const endTime = Number(stored);
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
        setRemainingSeconds(remaining);
        if (remaining <= 0) {
          clearCooldown();
          // Don't call onComplete here - let user click Spin Now button
        }
      } catch {
        setRemainingSeconds(0);
      }
    };

    tick();
    const intervalId = setInterval(tick, 1000);

    return () => clearInterval(intervalId);
  }, [isActive, clearCooldown]);

  return {
    remainingSeconds,
    formattedTime: formatSecondsToHMS(remainingSeconds),
    isInCooldown,
    startCooldown,
    clearCooldown,
  };
}
