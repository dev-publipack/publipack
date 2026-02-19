import { useState, useEffect, useCallback } from "react";

interface Notification {
  id: string;
  name: string;
  prize: string;
  emoji: string;
  timestamp: number;
}

// Mock data for winners - consistent "Free Gift from [Sponsor]" format
const MOCK_WINNERS = [
  { name: "@emily_rose", prize: "Free Gift from Preply" },
  { name: "@mike_smith", prize: "Free Gift from Lego" },
  { name: "@sarah_j", prize: "Free Gift from Adidas" },
  { name: "@james_bond", prize: "Free Gift from The North Face" },
  { name: "@jess_87", prize: "Free Gift from FlyLevel" },
  { name: "@david_k", prize: "Free Gift from Workaway" },
  { name: "@sophie_m", prize: "Free Gift from El Corte Inglés" },
  { name: "@thomas_01", prize: "Free Gift from The Farm" },
  { name: "@olivia_tx", prize: "Free Gift from Disney" },
  { name: "@daniel_99", prize: "Free Gift from Preply" },
  { name: "@emma_lee", prize: "Free Gift from Adidas" },
  { name: "@alex_cruz", prize: "Free Gift from FlyLevel" },
  { name: "@mia_flores", prize: "Free Gift from The Farm" },
  { name: "@john_doe", prize: "Free Gift from El Corte Inglés" },
  { name: "@lisa_ann", prize: "Free Gift from The North Face" },
  { name: "@chris_wong", prize: "Free Gift from Workaway" },
];

const MAX_NOTIFICATIONS = 2; // Maximum notifications on screen at once (for animation overlap)
const EMOJIS = ['🔥', '😊', '🎉', '⭐', '💫', '✨'];

export function useActivityNotifications(isEnabled: boolean = true) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const getRandomWinner = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * MOCK_WINNERS.length);
    const winner = MOCK_WINNERS[randomIndex];
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    return {
      id: `${Date.now()}-${randomIndex}`,
      name: winner.name,
      prize: winner.prize,
      emoji,
      timestamp: Date.now(),
    };
  }, []);

  const addNotification = useCallback(() => {
    if (!isEnabled) return;

    const notification = getRandomWinner();
    setNotifications((prev) => {
      const updated = [notification, ...prev];
      // Keep only MAX_NOTIFICATIONS
      return updated.slice(0, MAX_NOTIFICATIONS);
    });
  }, [isEnabled, getRandomWinner]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      setNotifications([]);
      return;
    }

    // Show first winner immediately (no delay)
    addNotification();

    // Add new notification every 4 seconds
    const interval = setInterval(() => {
      addNotification();
    }, 4000);

    return () => clearInterval(interval);
  }, [isEnabled, addNotification]);

  // Auto-remove notifications - older ones removed faster for smooth transition
  useEffect(() => {
    if (notifications.length === 0) return;

    const timers = notifications.map((notification, index) => {
      // Newer notification (index 0) stays 4.5 seconds, older (index 1) removed after 1 second
      const removeDelay = index === 0 ? 4500 : 1000;
      return setTimeout(() => {
        removeNotification(notification.id);
      }, removeDelay);
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [notifications, removeNotification]);

  return {
    notifications,
  };
}

