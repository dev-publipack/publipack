import { Button, RewardCard, CountdownTimer, ActivityNotification } from "../shared";
import type { Sponsor } from "../shared/types";
import { useActivityNotifications } from "../hooks/use-activity-notifications";
import { useLanguage } from "../providers/language-provider";

interface MainScreenProps {
  sponsors: Sponsor[];
  countdownSeconds: number;
  onSpin: () => void;
  showCooldown?: boolean;
}

export function MainScreen({ sponsors, countdownSeconds, onSpin, showCooldown = false }: MainScreenProps) {
  const { notifications } = useActivityNotifications(true);
  const { t } = useLanguage();

  return (
    <main
      className="min-h-screen w-full justify-center flex flex-col items-center overflow-x-hidden"
      style={{
        background:
          "linear-gradient(133deg, rgba(246, 248, 251, 1) 0%, rgba(255, 207, 178, 1) 100%)",
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
          className="relative w-full max-w-[900px] mx-auto bg-white rounded-2xl sm:rounded-3xl md:rounded-[32px] p-4 sm:p-5 md:p-6 lg:p-8 mb-6 sm:mb-8 md:mb-10"
          style={{ boxShadow: "0px 4px 33.10px 0px rgba(0, 0, 0, 0.25)" }}
        >
          {/* Sponsor Cards Grid - 4 columns in a row */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-4 w-full justify-items-center">
            {sponsors.map((sponsor, index) => (
              <RewardCard
                key={index}
                sponsorName={sponsor.name}
                reward={sponsor.reward}
                logoUrl={sponsor.logo}
                logoAlt={`${sponsor.name} logo`}
                className="w-full max-w-full"
              />
            ))}
          </div>
        </div>

        {/* Spin Now Button */}
        <Button
          onClick={onSpin}
          disabled={showCooldown}
          className="w-full max-w-[600px] mx-auto h-14 sm:h-16 md:h-20 lg:h-24 rounded-full text-white text-lg sm:text-xl md:text-3xl lg:text-4xl font-heading leading-[1.4] hover:opacity-90 px-6 mb-4 sm:mb-5 md:mb-6"
          style={{
            background:
              "linear-gradient(90deg, rgba(6, 144, 225, 1) 0%, rgba(56, 207, 253, 1) 100%)",
          }}
          size="lg"
        >
          {t('mainScreen.spinNowButton')}
        </Button>

        {/* Countdown Section */}
        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 w-full">
          <CountdownTimer seconds={countdownSeconds} showCooldown={showCooldown} />
          <p className="text-sm sm:text-base md:text-lg lg:text-xl font-body-semibold text-black text-center leading-[1.362]">
            {showCooldown ? t('mainScreen.cooldownMessage') : t('mainScreen.countdownMessage')}
          </p>
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

