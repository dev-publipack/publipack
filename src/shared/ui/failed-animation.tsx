import * as React from "react";
import Lottie from "lottie-react";
import { cn } from "../lib/utils";

type LottieAnimationData = {
  v?: string;
  fr?: number;
  ip?: number;
  op?: number;
  w?: number;
  h?: number;
  nm?: string;
  ddd?: number;
  assets?: unknown[];
  layers?: unknown[];
  [key: string]: unknown;
};

export interface FailedAnimationProps {
  className?: string;
  onComplete?: () => void;
}

export const FailedAnimation = React.forwardRef<
  HTMLDivElement,
  FailedAnimationProps
>(({ className, onComplete, ...props }, ref) => {
  const [failedData, setFailedData] = React.useState<LottieAnimationData | null>(null);
  const hasCompletedRef = React.useRef(false);

  React.useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch("/animations/Failed.json");
        if (response.ok) {
          const data = await response.json();
          if (data && (data.v || data.layers)) {
            setFailedData(data);
          }
        }
      } catch (error) {
        console.warn("Failed to load animation:", error);
      }
    };

    loadAnimation();
  }, []);

  // Auto complete after 1.5 seconds
  React.useEffect(() => {
    if (onComplete) {
      const timeout = setTimeout(() => {
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          onComplete();
        }
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [onComplete]);

  const handleComplete = React.useCallback(() => {
    if (!hasCompletedRef.current && onComplete) {
      hasCompletedRef.current = true;
      onComplete();
    }
  }, [onComplete]);

  if (!failedData) return null;

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
        loop={false}
        autoplay={true}
        onComplete={handleComplete}
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "500px",
          maxHeight: "500px",
        }}
      />
    </div>
  );
});
FailedAnimation.displayName = "FailedAnimation";
