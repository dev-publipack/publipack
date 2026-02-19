import * as React from "react";
import Lottie from "lottie-react";

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

export const ConfettiBackground = () => {
  const [confettiData, setConfettiData] = React.useState<LottieAnimationData | null>(null);

  React.useEffect(() => {
    const loadAnimation = async () => {
      // Try local file first, then fallback to CDN
      const confettiUrls = [
        "/animations/success confetti.json", // Local file
        "/animations/success-confetti.json", // Alternative name
        "https://lottie.host/f5PdexvrBK.json",
        "https://lottie.host/embed/f5PdexvrBK.json",
        "https://assets5.lottiefiles.com/packages/lf20_f5PdexvrBK.json",
      ];

      for (const url of confettiUrls) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            // Verify it's valid Lottie data
            if (data && (data.v || data.layers)) {
              setConfettiData(data);
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

  if (!confettiData) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <Lottie
        animationData={confettiData}
        loop={true}
        autoplay={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

