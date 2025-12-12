import { useState, useEffect, useRef } from "react";
import * as React from "react";
import { cn } from "../lib/utils";

export interface CountdownTimerProps {
  seconds: number;
  showCooldown?: boolean;
  className?: string;
  initialSeconds?: number;
  startTime?: number | null;
}

const CountdownTimer = React.forwardRef<HTMLDivElement, CountdownTimerProps>(
  ({ seconds, showCooldown = false, className, initialSeconds = 5, startTime: externalStartTime, ...props }, ref) => {
    const [animatedProgress, setAnimatedProgress] = useState(0);
    const animationFrameRef = useRef<number | undefined>(undefined);
    const startTimeRef = useRef<number | undefined>(undefined);

    useEffect(() => {
      if (showCooldown) {
        setAnimatedProgress(0);
        startTimeRef.current = undefined;
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        return;
      }

      // Use external startTime if provided (for synchronization with scroll), otherwise use local
      if (externalStartTime !== null && externalStartTime !== undefined) {
        startTimeRef.current = externalStartTime;
      } else if (startTimeRef.current === undefined || seconds === initialSeconds) {
        // Initialize on first render or when timer resets
        startTimeRef.current = performance.now();
      }

      if (seconds <= 0) {
        setAnimatedProgress(100);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        return;
      }

      // Continuous smooth animation synchronized with actual scroll time
      const animate = (currentTime: number) => {
        if (startTimeRef.current === undefined) {
          return;
        }

        const totalElapsed = currentTime - startTimeRef.current;
        const totalDuration = initialSeconds * 1000; // Total time in ms

        // Calculate continuous progress from 0 to 100 based on elapsed time
        const currentProgress = Math.min((totalElapsed / totalDuration) * 100, 100);

        setAnimatedProgress(currentProgress);

        // Continue animating if time remaining and seconds > 0
        if (currentProgress < 100 && seconds > 0) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else if (currentProgress >= 100 || seconds <= 0) {
          setAnimatedProgress(100);
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
        }
      };

      // Start animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [seconds, showCooldown, initialSeconds, externalStartTime]);

    return (
      <div
        ref={ref}
        className={cn("relative w-full max-w-[600px] mx-auto", className)}
        {...props}
      >
        {/* Background bar */}
        <div className="w-full h-3 sm:h-4 md:h-5 lg:h-6 bg-gray-200 rounded-full overflow-hidden">
          {/* Progress fill */}
          {showCooldown ? (
            <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full animate-pulse w-full" />
          ) : (
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
              style={{
                width: `${animatedProgress}%`,
                transition: 'none',
              }}
            />
          )}
        </div>
      </div>
    );
  }
);
CountdownTimer.displayName = "CountdownTimer";

export { CountdownTimer };