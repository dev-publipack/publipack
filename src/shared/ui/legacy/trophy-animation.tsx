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

export interface TrophyAnimationProps {
  className?: string;
}

export const TrophyAnimation = React.forwardRef<
  HTMLDivElement,
  TrophyAnimationProps
>(({ className, ...props }, ref) => {
  const [trophyData, setTrophyData] =
    React.useState<LottieAnimationData | null>(null);

  React.useEffect(() => {
    const loadAnimation = async () => {
      // Try local file first, then fallback to CDN
      const trophyUrls = [
        "/animations/Trophy.json", // Local file
        "https://lottie.host/yEGPe40FVr.json",
        "https://lottie.host/embed/yEGPe40FVr.json",
        "https://assets5.lottiefiles.com/packages/lf20_yEGPe40FVr.json",
      ];

      for (const url of trophyUrls) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            // Verify it's valid Lottie data
            if (data && (data.v || data.layers)) {
              setTrophyData(data);
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

  if (!trophyData) return null;

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
        loop={false}
        autoplay={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
});
TrophyAnimation.displayName = "TrophyAnimation";
