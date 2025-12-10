import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { useLanguage } from "../../providers/language-provider";

interface ActivityNotificationProps {
    name: string;
    prize: string;
    index: number;
}

const EMOJIS = ["🔥", "😊", "🎉", "⭐", "💫", "✨"];

export function ActivityNotification({
    name,
    prize,
    index,
}: ActivityNotificationProps) {
    const [emoji] = useState(() => EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);
    const [isVisible, setIsVisible] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        // Trigger animation after mount
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 50);
        return () => clearTimeout(timer);
    }, []);

    // Calculate opacity - older notification fades out
    const opacity = index === 0 ? 1 : 0;

    // Calculate bottom position - old one goes slightly up, new stays at base
    const bottomPosition = index === 0 ? 1.5 : 8; // Old one goes to 8rem (small gap above)

    return (
        <div
            className={cn(
                "fixed left-1/2 z-10 w-[80%] max-w-[900px]",
                isVisible ? "transition-all duration-700 ease-out" : ""
            )}
            style={{
                bottom: isVisible ? `${bottomPosition}rem` : "-10rem",
                opacity: isVisible ? opacity : 0,
                transform: `translateX(-50%) scale(${isVisible ? 1 : 0.8})`,
                transition: "all 0.7s ease-out",
            }}
        >
            <div
                className="px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 rounded-2xl sm:rounded-3xl border-[3px]"
                style={{
                    backgroundColor: "#F7F3F1",
                    borderColor: "#FF9442",
                    boxShadow: "0px 4px 33.1px rgba(0, 0, 0, 0.05)",
                }}
            >
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-black text-center wrap-break-word">
                    {emoji} {t('activityNotification.justWon', { name, prize })}
                </p>
            </div>
        </div>
    );
}

