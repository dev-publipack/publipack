import { useEffect, useRef } from "react";
import type { GameScreen } from "./use-game-state";

interface UseAutoSpinProps {
  countdownSeconds: number;
  currentScreen: GameScreen;
  onSpin: () => void;
  attempts?: number;
}

export function useAutoSpin({ countdownSeconds, currentScreen, onSpin, attempts = 0 }: UseAutoSpinProps) {
  const hasAutoSpunRef = useRef(false);

  useEffect(() => {
    // Don't auto-spin if attempts are exhausted
    if (attempts >= 3) {
      return;
    }

    if (countdownSeconds === 0 && currentScreen === "main" && !hasAutoSpunRef.current) {
      hasAutoSpunRef.current = true;
      onSpin();
    }

    if (countdownSeconds > 0) {
      hasAutoSpunRef.current = false;
    }
  }, [countdownSeconds, currentScreen, onSpin, attempts]);
}

