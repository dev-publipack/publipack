import * as React from "react";

interface UseSpinCountdownOptions {
  isSpinning: boolean;
  spinDuration: number; // in milliseconds
}

export function useSpinCountdown({ isSpinning, spinDuration }: UseSpinCountdownOptions) {
  const [remainingSeconds, setRemainingSeconds] = React.useState(0);
  const startTimeRef = React.useRef<number | null>(null);
  const animationFrameRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!isSpinning) {
      // Reset when not spinning
      setRemainingSeconds(0);
      startTimeRef.current = null;

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    // Start countdown when spinning begins
    startTimeRef.current = Date.now();
    const initialSeconds = Math.ceil(spinDuration / 1000);
    setRemainingSeconds(initialSeconds);

    const updateCountdown = () => {
      if (!startTimeRef.current) {
        return;
      }

      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, spinDuration - elapsed);
      const seconds = Math.ceil(remaining / 1000);

      setRemainingSeconds(seconds);

      if (remaining > 0) {
        animationFrameRef.current = requestAnimationFrame(updateCountdown);
      } else {
        setRemainingSeconds(0);
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateCountdown);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      startTimeRef.current = null;
    };
  }, [isSpinning, spinDuration]);

  return remainingSeconds;
}

