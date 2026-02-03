import * as React from "react";
import { cn } from "../lib/utils";
import { useLanguage } from "@/providers/language-provider";
import { trackButtonClick } from "../lib/analytics";

export interface ClaimSuccessProps {
    email: string;
    onOpenEmail?: () => void;
    onDownloadReward?: () => void;
    onPlayAgain?: () => void;
    className?: string;
}

const ClaimSuccess = React.forwardRef<HTMLDivElement, ClaimSuccessProps>(
    ({ email, onOpenEmail, onDownloadReward, onPlayAgain, className, ...props }, ref) => {
        const { t } = useLanguage();

        return (
            <div
                ref={ref}
                className={cn(
                    "relative w-full min-h-screen flex flex-col items-center justify-center px-0 sm:px-4 md:px-6 lg:px-8",
                    className
                )}
                style={{
                    background: "#F6F8FB",
                }}
                {...props}
            >
                {/* Success Icon - Blue circle with checkmark */}
                <div className="mb-3 sm:mb-4">
                    <div
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center"
                        style={{ background: "#44D2FD" }}
                    >
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
                        >
                            <path
                                d="M20 6L9 17L4 12"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>

                {/* Congratulations Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-[#163446] leading-[1.16] text-center mb-3 sm:mb-4 px-4">
                    {t('claimSuccess.title')}
                </h1>

                {/* Email Message */}
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-body-semibold text-black text-center leading-[1.362] mb-6 sm:mb-8 px-4 max-w-2xl">
                    {t('claimSuccess.emailMessage', { email })}
                </p>

                {/* Check Items */}
                <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8 px-4 w-full max-w-md">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: "#44D2FD" }}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M20 6L9 17L4 12"
                                    stroke="white"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-body-semibold text-black leading-[1.362]">
                            {t('claimSuccess.checkInbox')}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <div
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: "#44D2FD" }}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M20 6L9 17L4 12"
                                    stroke="white"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-body-semibold text-black leading-[1.362]">
                            {t('claimSuccess.rewardSaved')}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex mt-6 flex-col gap-3 sm:gap-4 w-full max-w-[600px] md:max-w-[700px] px-4 sm:px-0 mb-6 sm:mb-8">
                    {/* Download Reward Button */}
                    <button
                        onClick={() => {
                            trackButtonClick('Download Reward');
                            onDownloadReward?.();
                        }}
                        className="w-full h-14 sm:h-16 md:h-20 lg:h-24 rounded-full text-white text-lg sm:text-xl md:text-3xl lg:text-4xl font-heading leading-[1.4] hover:opacity-90 transition-opacity px-6"
                        style={{
                            background: "linear-gradient(134deg, rgba(9, 148, 227, 1) 0%, rgba(54, 204, 252, 1) 100%)",
                        }}
                    >
                        {t('claimSuccess.downloadRewardButton')}
                    </button>

                    {/* Play Again Button */}
                    <button
                        onClick={() => {
                            trackButtonClick('Play Again (Claim Success)');
                            onPlayAgain?.();
                        }}
                        className="w-full h-14 sm:h-16 md:h-20 lg:h-24 rounded-full text-white text-lg sm:text-xl md:text-3xl lg:text-4xl font-heading leading-[1.4] hover:opacity-90 transition-opacity px-6"
                        style={{
                            background: "#FF9442",
                        }}
                    >
                        {t('claimSuccess.playAgainButton')}
                    </button>
                </div>
            </div>
        );
    }
);
ClaimSuccess.displayName = "ClaimSuccess";

export { ClaimSuccess };

