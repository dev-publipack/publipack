import { useState, useEffect, useCallback } from "react";

interface Notification {
  id: string;
  name: string;
  prize: string;
  timestamp: number;
}

// Mock data for winners - using real brands from sponsors with nicknames
const MOCK_WINNERS = [
  { name: "@emily_rose", prize: "Preply 50% discount" },
  { name: "@mike_smith", prize: "Lego Free LEGO Games!" },
  { name: "@sarah_j", prize: "Adidas Up to -60%" },
  { name: "@james_bond", prize: "The North Face Up to -50%" },
  { name: "@jess_87", prize: "FlyLevel 161€ To New York!" },
  { name: "@david_k", prize: "Workaway Free sailing in the Caribbean!" },
  { name: "@sophie_m", prize: "El Corte Inglés Travel discounts! -40%" },
  { name: "@thomas_01", prize: "The Farm Free bottle of Cava" },
  { name: "@olivia_tx", prize: "Preply 50% discount" },
  { name: "@daniel_99", prize: "Lego Free LEGO Games!" },
  { name: "@emma_lee", prize: "Adidas Up to -60%" },
  { name: "@alex_cruz", prize: "FlyLevel 161€ To New York!" },
  { name: "@mia_flores", prize: "The Farm Free bottle of Cava" },
  { name: "@john_doe", prize: "El Corte Inglés Travel discounts! -40%" },
  { name: "@lisa_ann", prize: "The North Face Up to -50%" },
  { name: "@chris_wong", prize: "Workaway Free sailing in the Caribbean!" },
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

