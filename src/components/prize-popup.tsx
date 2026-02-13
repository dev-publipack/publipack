import React from 'react';

/**
 * Prize Popup Component
 *
 * Popup notification "Jose.m just won 50% off at adidas"
 *
 * Design specs:
 * - Size: 295 × 52 px (content)
 * - Border radius: 15px
 * - Fill: radial-gradient(#FFF7FB → #FFA2DC)
 * - Stroke: #FFD7EB 3px
 * - Font (name): Bungee 24px
 * - Font (prize): Bungee 15px
 *
 * @see docs/DESIGN_SPEC.md - Section 4.6
 */
interface PrizePopupProps {
  username: string;
  prize: string;
  isVisible?: boolean;
  onClose?: () => void;
}

export function PrizePopup({
  username,
  prize,
  isVisible = true,
  onClose,
}: PrizePopupProps) {
  const [shouldRender, setShouldRender] = React.useState(isVisible);

  React.useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  return (
    <div
      className={`
        fixed top-8 left-1/2 -translate-x-1/2 z-50
        transition-all duration-300
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
      `}
    >
      <div className="w-[295px] min-h-[52px] bg-popup-gradient rounded-[15px] border-[3px] border-pink-light shadow-lg px-4 py-3 flex flex-col gap-1">
        {/* Username */}
        <p className="font-bungee text-[24px] text-blue-dark leading-tight">
          {username} just won
        </p>

        {/* Prize */}
        <p className="font-bungee text-[15px] text-orange leading-tight">
          {prize}
        </p>

        {/* Close button (optional) */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-blue-dark hover:text-orange transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Popup Manager Component
 *
 * Manages display of random win popups
 */
interface PopupManagerProps {
  isActive?: boolean;
  interval?: number; // in milliseconds
}

const SAMPLE_POPUPS = [
  { username: 'Jose.m', prize: '50% off at adidas' },
  { username: 'Sarah.k', prize: '30% off at Nike' },
  { username: 'Mike.p', prize: 'Free Socks' },
  { username: 'Anna.l', prize: '25% off at VANS' },
];

export function PopupManager({
  isActive = true,
  interval = 8000,
}: PopupManagerProps) {
  const [currentPopup, setCurrentPopup] = React.useState<
    (typeof SAMPLE_POPUPS)[0] | null
  >(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (!isActive) {
      setIsVisible(false);
      setCurrentPopup(null);
      return;
    }

    const showRandomPopup = () => {
      const randomPopup =
        SAMPLE_POPUPS[Math.floor(Math.random() * SAMPLE_POPUPS.length)];
      setCurrentPopup(randomPopup);
      setIsVisible(true);

      // Hide after 4 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    };

    // Show first popup after 2 seconds
    const initialTimer = setTimeout(showRandomPopup, 2000);

    // Then show periodically
    const intervalTimer = setInterval(showRandomPopup, interval);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [isActive, interval]);

  if (!currentPopup) return null;

  return (
    <PrizePopup
      username={currentPopup.username}
      prize={currentPopup.prize}
      isVisible={isVisible}
    />
  );
}
