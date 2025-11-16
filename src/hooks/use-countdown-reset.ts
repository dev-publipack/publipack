import { useEffect, useRef } from "react";

interface UseCountdownResetProps {
  isMainScreen: boolean;
  onReset: () => void;
  skipReset?: boolean;
}

export function useCountdownReset({ isMainScreen, onReset, skipReset = false }: UseCountdownResetProps) {
  const wasOnOtherScreenRef = useRef(false);

  useEffect(() => {
    if (isMainScreen && wasOnOtherScreenRef.current && !skipReset) {
      onReset();
      wasOnOtherScreenRef.current = false;
    } else if (!isMainScreen) {
      wasOnOtherScreenRef.current = true;
    }
  }, [isMainScreen, onReset, skipReset]);
}

