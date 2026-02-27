import * as React from "react";
import Lottie from "lottie-react";
import { cn } from "../../lib/utils";
import confettiData from "@/assets/animations/success-confetti.json";

export interface SuccessConfettiAnimationProps {
  className?: string;
  onComplete?: () => void;
}

export const SuccessConfettiAnimation = React.forwardRef<
  HTMLDivElement,
  SuccessConfettiAnimationProps
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
        "relative w-full h-full flex items-center justify-center min-h-screen",
        className
      )}
      {...props}
    >
      <Lottie
        key="success-confetti-once"
        animationData={confettiData}
        renderer="svg"
        loop={false}
        autoplay={true}
        onComplete={handleComplete}
        style={{ width: "100%", height: "100%", maxWidth: "1920px", maxHeight: "1920px" }}
      />
    </div>
  );
});
SuccessConfettiAnimation.displayName = "SuccessConfettiAnimation";
