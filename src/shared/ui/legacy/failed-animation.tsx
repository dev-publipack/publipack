import * as React from "react";
import Lottie from "lottie-react";
import { cn } from "../../lib/utils";
import failedData from "@/assets/animations/Failed.json";

export interface FailedAnimationProps {
  className?: string;
  onComplete?: () => void;
}

export const FailedAnimation = React.forwardRef<
  HTMLDivElement,
  FailedAnimationProps
>(({ className, onComplete, ...props }, ref) => {
  const hasCompletedRef = React.useRef(false);

  React.useEffect(() => {
    if (!onComplete) return;
    const timeout = setTimeout(() => {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onComplete();
      }
    }, 1500);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  const handleComplete = React.useCallback(() => {
    if (!hasCompletedRef.current && onComplete) {
      hasCompletedRef.current = true;
      onComplete();
    }
  }, [onComplete]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full h-full flex items-center justify-center min-h-[400px] sm:min-h-[500px] md:min-h-[600px]",
        className
      )}
      {...props}
    >
      <Lottie
        key="failed-once"
        animationData={failedData}
        renderer="svg"
        loop={false}
        autoplay={true}
        onComplete={handleComplete}
        style={{ width: "100%", height: "100%", maxWidth: "500px", maxHeight: "500px" }}
      />
    </div>
  );
});
FailedAnimation.displayName = "FailedAnimation";
