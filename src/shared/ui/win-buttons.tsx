import * as React from "react";
import { cn } from "../lib/utils";
import { useLanguage } from "../../providers/language-provider";

export interface WinButtonsProps {
  onClaim?: () => void;
  onSpinAgain?: () => void;
  showCooldown?: boolean;
  className?: string;
}

export const WinButtons = React.forwardRef<HTMLDivElement, WinButtonsProps>(
  ({ onClaim, onSpinAgain, showCooldown = false, className, ...props }, ref) => {
    const { t } = useLanguage();
    
    return (
      <div
        ref={ref}
        className={cn(
          "relative z-10 w-full max-w-[700px] flex flex-col gap-3 sm:gap-4",
          className
        )}
        {...props}
      >
        {/* CLAIM MY PRIZE Button */}
        {onClaim && (
          <button
            onClick={onClaim}
            className="w-full h-14 sm:h-16 md:h-20 lg:h-24 rounded-full text-white text-lg sm:text-xl md:text-3xl lg:text-4xl font-heading leading-[1.4] hover:opacity-90 px-6"
            style={{
              background:
                "linear-gradient(134deg, rgba(9, 148, 227, 1) 0%, rgba(54, 204, 252, 1) 100%)",
            }}
          >
            {t('winButtons.claimMyPrize')}
          </button>
        )}

        {/* SPIN AGAIN / Play Again 24h Button */}
        {onSpinAgain && (
          <button
            onClick={onSpinAgain}
            className="w-full h-14 sm:h-16 md:h-20 lg:h-24 rounded-full text-[#FF9442] text-lg sm:text-xl md:text-3xl lg:text-4xl font-heading leading-[1.4] hover:opacity-90 bg-white px-6"
            style={{
              border: "4px solid #FF9442",
            }}
          >
            {showCooldown ? t('winButtons.playAgain24h') : t('winButtons.spinAgain')}
          </button>
        )}
      </div>
    );
  }
);
WinButtons.displayName = "WinButtons";
