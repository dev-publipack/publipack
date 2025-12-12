import * as React from "react";
import { ActivityNotification, SponsorsCarousel, CountdownTimer } from "../shared";
import type { Sponsor } from "../shared/types";
import { useActivityNotifications } from "../hooks/use-activity-notifications";
import { useLanguage } from "../providers/language-provider";
import { useSpinCountdown } from "../hooks/use-spin-countdown";
import { SCROLL_DURATION } from "../hooks/use-sponsors-scroll";

interface MainScreenProps {
  sponsors: Sponsor[];
  onScrollComplete: () => void;
}

export function MainScreen({ sponsors, onScrollComplete }: MainScreenProps) {
  const { notifications } = useActivityNotifications(true);
  const { t } = useLanguage();
  const [isScrolling, setIsScrolling] = React.useState(false);
  
  const scrollCountdown = useSpinCountdown({
    isSpinning: isScrolling,
    spinDuration: SCROLL_DURATION,
  });
  
  const initialSeconds = Math.ceil(SCROLL_DURATION / 1000);

  return (
    <main
      className="min-h-screen w-full justify-center flex flex-col items-center overflow-x-hidden"
      style={{
        background:
          "linear-gradient(137deg, rgba(246, 248, 251, 1) 7%, rgba(255, 207, 178, 1) 100%)",
      }}
    >
      <div className="w-full max-w-[1080px] flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-[#163446] leading-[1.4] text-center mb-3 sm:mb-4">
          {t('mainScreen.title').split('?')[0]} <span className="text-[#44D2FD]">{t('mainScreen.title').split(' ').slice(-1)[0]}</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-body-semibold max-w-[600px] text-[#163446] text-center leading-[1.362] mb-6 sm:mb-8 md:mb-10 mx-auto">
          {t('mainScreen.subtitle').split(t('mainScreen.subtitleBold'))[0]}
          <span className="text-black font-bold">{t('mainScreen.subtitleBold')}</span>
          {t('mainScreen.subtitle').split(t('mainScreen.subtitleBold'))[1]}
        </p>

        {/* Sponsor Cards Container */}
        <div
          className="relative w-full max-w-[900px] mx-auto rounded-2xl sm:rounded-3xl md:rounded-[29px] p-4 sm:p-5 md:p-6 lg:p-8"
          style={{
            background:
              "linear-gradient(137deg, rgba(11, 141, 217, 1) 4%, rgba(45, 195, 248, 1) 100%)",
            boxShadow: "0px 4.24px 35.10px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Sponsors Carousel - vertical scroll like slot machine */}
          <SponsorsCarousel 
            sponsors={sponsors} 
            onComplete={onScrollComplete}
            onLoadingChange={setIsScrolling}
          />
        </div>

        {/* Countdown Timer */}
        <div className="pt-6 sm:pt-8 md:pt-10 flex justify-center items-center w-full max-w-[600px] mx-auto px-4">
          {isScrolling && (
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 w-full">
              <CountdownTimer seconds={scrollCountdown} showCooldown={false} initialSeconds={initialSeconds} />
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-body-semibold text-black text-center leading-[1.362]">
                {t('mainScreen.countdownMessage')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Activity Notifications Stack */}
      {notifications.map((notification, index) => (
        <ActivityNotification
          key={notification.id}
          name={notification.name}
          prize={notification.prize}
          index={index}
        />
      ))}
    </main>
  );
}

