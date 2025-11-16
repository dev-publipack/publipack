import * as React from "react";
import { cn } from "../lib/utils";
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

export interface YouLostProps {
  onTryAgain?: () => void;
  className?: string;
}

const YouLost = React.forwardRef<HTMLDivElement, YouLostProps>(
  ({ onTryAgain, className, ...props }, ref) => {
    const [sadEmojiData, setSadEmojiData] = React.useState<LottieAnimationData | null>(null);

    React.useEffect(() => {
      const loadAnimation = async () => {
        try {
          const response = await fetch("/animations/Sad Emoji.json");
          if (response.ok) {
            const data = await response.json();
            if (data && (data.v || data.layers)) {
              setSadEmojiData(data);
            }
          }
        } catch (error) {
          console.warn("Failed to load animation:", error);
        }
      };

      loadAnimation();
    }, []);

    if (!sadEmojiData) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full flex flex-col items-center justify-center min-h-full",
          className
        )}
        {...props}
      >
        <Lottie
          animationData={sadEmojiData}
          loop={true}
          autoplay={true}
          style={{
            width: "50%",
            height: "50%",
          }}
        />
        <div
          className="relative z-10 w-full max-w-[1003px] rounded-[29px] p-6 md:p-8 mb-8"
          style={{
            background:
              "linear-gradient(137deg, rgba(11, 141, 217, 1) 4%, rgba(45, 195, 248, 1) 100%)",
            boxShadow: "0px 4.24px 35.10px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <h1 className="text-3xl md:text-5xl lg:text-[101px] font-heading text-white leading-[1.14] text-center mb-8">
            Try again tomorrow!
          </h1>
          <p className="text-lg md:text-2xl lg:text-[51.55px] font-body-semibold text-white text-center leading-[1.362] mb-8">
            Better luck next time. Come back tomorrow for another spin
          </p>
        </div>

        <button
          onClick={onTryAgain}
          className="relative z-10 w-full max-w-[784px] h-[80px] sm:h-[100px] md:h-[130px] lg:h-[166px] xl:h-[200px] rounded-full sm:rounded-[60px] md:rounded-[80px] lg:rounded-[110px] text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-[69px] font-heading leading-[1.4] hover:opacity-90 transition-opacity"
          style={{ background: "#FF9442" }}
        >
          Spin Again
        </button>
      </div>
    );
  }
);
YouLost.displayName = "YouLost";

export { YouLost };
