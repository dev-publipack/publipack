import { useState, useEffect, useCallback } from "react";

interface Notification {
  id: string;
  name: string;
  prize: string;
  timestamp: number;
}

// Mock data for winners - using real brands from sponsors with nicknames
const MOCK_WINNERS = [
  { name: "@emily_rose", prize: "Starbucks Free Drink" },
  { name: "@mike_smith", prize: "Domino's Free Pizza" },
  { name: "@sarah_j", prize: "Apple Store App Store" },
  { name: "@james_bond", prize: "Disney Save up 25%" },
  { name: "@jess_87", prize: "Netflix Save up 15%" },
  { name: "@david_k", prize: "Nike 10% Off" },
  { name: "@sophie_m", prize: "AMC Free Movie" },
  { name: "@thomas_01", prize: "Spotify Free Month" },
  { name: "@olivia_tx", prize: "Starbucks Free Drink" },
  { name: "@daniel_99", prize: "Domino's Free Pizza" },
  { name: "@emma_lee", prize: "Nike 10% Off" },
  { name: "@alex_cruz", prize: "Netflix Save up 15%" },
  { name: "@mia_flores", prize: "Spotify Free Month" },
  { name: "@john_doe", prize: "AMC Free Movie" },
  { name: "@lisa_ann", prize: "Disney Save up 25%" },
  { name: "@chris_wong", prize: "Apple Store App Store" },
];

const MAX_NOTIFICATIONS = 2; // Maximum notifications on screen at once (for animation overlap)

export function useActivityNotifications(isEnabled: boolean = true) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const getRandomWinner = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * MOCK_WINNERS.length);
    const winner = MOCK_WINNERS[randomIndex];
    return {
      id: `${Date.now()}-${randomIndex}`,
      name: winner.name,
      prize: winner.prize,
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

    // Show first notification after random delay (2-4 seconds)
    const initialDelay = Math.random() * 2000 + 2000;
    const initialTimer = setTimeout(() => {
      addNotification();
    }, initialDelay);

    // Add new notification every 4 seconds
    const interval = setInterval(() => {
      addNotification();
    }, 4000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
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

