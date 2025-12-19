import * as React from "react";
import { ActivityNotification, CombinedSlotMachine } from "../shared";
import type { Sponsor } from "../shared/types";
import { useActivityNotifications } from "../hooks/use-activity-notifications";

interface MainScreenProps {
  sponsors: Sponsor[];
  onComplete: (result: { winner: Sponsor | null; isWin: boolean }) => void;
  isCooldown?: boolean;
}

export function MainScreen({ sponsors, onComplete, isCooldown = false }: MainScreenProps) {
  const { notifications } = useActivityNotifications(true);

  return (
    <main
      className="min-h-screen w-full justify-center flex flex-col items-center overflow-x-hidden"
      style={{
        background:
          "linear-gradient(137deg, rgba(246, 248, 251, 1) 7%, rgba(255, 207, 178, 1) 100%)",
      }}
    >
      <div className="w-full max-w-[1080px] flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
        {/* Combined Slot Machine - Shows sponsors first (7s), then slots (7s) */}
        <CombinedSlotMachine 
          sponsors={sponsors} 
          onComplete={onComplete}
          isCooldown={isCooldown}
        />
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

