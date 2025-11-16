import { useEffect, useRef } from "react";
import type { GameScreen } from "./use-game-state";

interface UseAutoSpinProps {
  countdownSeconds: number;
  currentScreen: GameScreen;
  onSpin: () => void;
}

export function useAutoSpin({ countdownSeconds, currentScreen, onSpin }: UseAutoSpinProps) {
  const hasAutoSpunRef = useRef(false);

  useEffect(() => {
    if (countdownSeconds === 0 && currentScreen === "main" && !hasAutoSpunRef.current) {
      hasAutoSpunRef.current = true;
      onSpin();
    }

    if (countdownSeconds > 0) {
      hasAutoSpunRef.current = false;
    }
  }, [countdownSeconds, currentScreen, onSpin]);
}

