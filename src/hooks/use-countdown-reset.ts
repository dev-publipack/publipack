import { useEffect, useRef } from "react";
import type { GameScreen } from "./use-game-state";

interface UseCountdownResetProps {
  isMainScreen: boolean;
  onReset: () => void;
}

export function useCountdownReset({ isMainScreen, onReset }: UseCountdownResetProps) {
  const wasOnOtherScreenRef = useRef(false);

  useEffect(() => {
    if (isMainScreen && wasOnOtherScreenRef.current) {
      onReset();
      wasOnOtherScreenRef.current = false;
    } else if (!isMainScreen) {
      wasOnOtherScreenRef.current = true;
    }
  }, [isMainScreen, onReset]);
}

