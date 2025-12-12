import { useState, useEffect, useRef, useCallback } from "react";
import { TIMING } from "@/shared/lib/game-config";

interface UseGameCountdownProps {
  isMainScreen: boolean;
  isCooldown: boolean;
  onCountdownEnd?: () => void;
}

/**
 * Hook for managing countdown timer on main screen
 * Handles auto-spin trigger when countdown reaches zero
 */
export function useGameCountdown({
  isMainScreen,
  isCooldown,
  onCountdownEnd,
}: UseGameCountdownProps) {
  const [countdownSeconds, setCountdownSeconds] = useState<number>(TIMING.COUNTDOWN_INITIAL);
  const [isCountdownActive, setIsCountdownActive] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wasOnOtherScreenRef = useRef(false);

  // Countdown logic
  useEffect(() => {
    // Stop countdown if in cooldown or not on main screen
    if (isCooldown || !isMainScreen || !isCountdownActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Start countdown
    if (countdownSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setCountdownSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [countdownSeconds, isCountdownActive, isCooldown, isMainScreen]);

  // Trigger auto-spin when countdown reaches 0
  useEffect(() => {
    if (countdownSeconds === 0 && isMainScreen && !isCooldown && onCountdownEnd) {
      onCountdownEnd();
    }
  }, [countdownSeconds, isMainScreen, isCooldown, onCountdownEnd]);

  // Reset countdown when returning to main screen
  useEffect(() => {
    if (isMainScreen && wasOnOtherScreenRef.current) {
      if (!isCooldown) {
        setCountdownSeconds(TIMING.COUNTDOWN_INITIAL);
        setIsCountdownActive(true);
      } else {
        setCountdownSeconds(0);
        setIsCountdownActive(false);
      }
      wasOnOtherScreenRef.current = false;
    } else if (!isMainScreen) {
      wasOnOtherScreenRef.current = true;
    }
  }, [isMainScreen, isCooldown]);

  // Ensure countdown is stopped in cooldown
  useEffect(() => {
    if (isCooldown) {
      setIsCountdownActive(false);
      setCountdownSeconds(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isCooldown]);

  const resetCountdown = useCallback(() => {
    setCountdownSeconds(TIMING.COUNTDOWN_INITIAL);
    setIsCountdownActive(true);
  }, []);

  return {
    countdownSeconds,
    isCountdownActive,
    resetCountdown,
  };
}

