import * as React from "react";
import Lottie from "lottie-react";
import { cn } from "../../lib/utils";
import trophyData from "@/assets/animations/Trophy.json";

export interface TrophyAnimationProps {
  className?: string;
}

export const TrophyAnimation = React.forwardRef<
  HTMLDivElement,
  TrophyAnimationProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48",
        className
      )}
      {...props}
    >
      <Lottie
        animationData={trophyData}
        renderer="svg"
        loop={false}
        autoplay={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
});
TrophyAnimation.displayName = "TrophyAnimation";
