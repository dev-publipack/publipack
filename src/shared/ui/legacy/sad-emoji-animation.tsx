import * as React from "react";
import Lottie from "lottie-react";
import { cn } from "../../lib/utils";

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

export interface SadEmojiAnimationProps {
  className?: string;
}

export const SadEmojiAnimation = React.forwardRef<HTMLDivElement, SadEmojiAnimationProps>(
  ({ className, ...props }, ref) => {
    const [sadEmojiData, setSadEmojiData] = React.useState<LottieAnimationData | null>(null);

    React.useEffect(() => {
      const loadAnimation = async () => {
        // Try local file first, then fallback to CDN
        const sadEmojiUrls = [
          "/animations/Sad Emoji.json", // Local file
          "/animations/sad-emoji.json", // Alternative name
        ];

        for (const url of sadEmojiUrls) {
          try {
            const response = await fetch(url);
            if (response.ok) {
              const data = await response.json();
              // Verify it's valid Lottie data
              if (data && (data.v || data.layers)) {
                setSadEmojiData(data);
                return;
              }
            }
          } catch (error) {
            console.warn(`Failed to load animation from ${url}:`, error);
            continue;
          }
        }
      };

      loadAnimation();
    }, []);

    if (!sadEmojiData) return null;

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
          loop={true}
          autoplay={true}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }
);
SadEmojiAnimation.displayName = "SadEmojiAnimation";

