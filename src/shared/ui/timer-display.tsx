import { cn } from "@/shared/lib/utils";

interface TimerDisplayProps {
  formattedTime: string;
  className?: string;
}

export function TimerDisplay({ formattedTime, className }: TimerDisplayProps) {
  return (
    <div
      className={cn(
        "font-mono text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums",
        className
      )}
      style={{
        color: "#2066BB",
        fontFamily: "Bungee, sans-serif",
        textShadow: "0px 0px 5px rgba(0, 0, 0, 0.25)",
      }}
    >
      {formattedTime}
    </div>
  );
}
