import * as React from "react";
import { cn } from "../../lib/utils";
import Lottie from "lottie-react";
import { useLanguage } from "../../../providers/language-provider";
import { trackButtonClick } from "../../lib/analytics";
import sadEmojiData from "@/assets/animations/sad-emoji.json";

export interface YouLostProps {
  onTryAgain?: () => void;
  className?: string;
}

const YouLost = React.forwardRef<HTMLDivElement, YouLostProps>(
  ({ onTryAgain, className, ...props }, ref) => {
    const { t } = useLanguage();

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
          renderer="svg"
          loop={true}
          autoplay={true}
          className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 mb-6"
        />
        
        <div
          className="relative z-10 w-full max-w-[900px] rounded-2xl sm:rounded-3xl md:rounded-[29px] p-4 sm:p-6 md:p-8 mb-6 sm:mb-8"
          style={{
            background:
              "linear-gradient(137deg, rgba(11, 141, 217, 1) 4%, rgba(45, 195, 248, 1) 100%)",
            boxShadow: "0px 4.24px 35.10px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-white leading-[1.14] text-center mb-4 sm:mb-6">
            {t('youLost.title')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-body-semibold text-white text-center leading-[1.362]">
            {t('youLost.message')}
          </p>
        </div>

        <button
          onClick={() => {
            trackButtonClick('Play Again (You Lost)');
            onTryAgain?.();
          }}
          className="relative z-10 w-full max-w-[700px] h-14 sm:h-16 md:h-20 lg:h-24 rounded-full text-white text-lg sm:text-xl md:text-3xl lg:text-4xl font-heading leading-[1.4] hover:opacity-90 transition-opacity px-6"
          style={{ background: "#FF9442" }}
        >
          {t('youLost.playAgainButton')}
        </button>
      </div>
    );
  }
);
YouLost.displayName = "YouLost";

export { YouLost };
