import * as React from "react";
import Lottie from "lottie-react";
import { cn } from "../../lib/utils";
import sadEmojiData from "@/assets/animations/sad-emoji.json";

export interface SadEmojiAnimationProps {
  className?: string;
}

export const SadEmojiAnimation = React.forwardRef<HTMLDivElement, SadEmojiAnimationProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56",
          className
        )}
        {...props}
      >
        <Lottie
          animationData={sadEmojiData}
          renderer="svg"
          loop={true}
          autoplay={true}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }
);
SadEmojiAnimation.displayName = "SadEmojiAnimation";

