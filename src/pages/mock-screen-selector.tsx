'use client';

import type { GameScreen } from "@/hooks/legacy/use-game-state";

const MOCK_SCREENS: { value: GameScreen | ""; label: string }[] = [
  { value: "", label: "Real (game flow)" },
  { value: "main", label: "1. Spin" },
  { value: "youWon", label: "2. Win" },
  { value: "claimReward", label: "3. Claim" },
  { value: "claimSuccess", label: "4. Claim Success" },
  { value: "successConfetti", label: "Success Confetti" },
  { value: "failedAnimation", label: "Failed Animation" },
  { value: "didntWin", label: "Try Again" },
  { value: "youLost", label: "Cooldown (24h)" },
];

interface MockScreenSelectorProps {
  value: GameScreen | "";
  onChange: (screen: GameScreen | "") => void;
}

/** Dev-only screen selector for testing. Renders nothing in production. */
export function MockScreenSelector({ value, onChange }: MockScreenSelectorProps) {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed top-2 left-2 z-50 bg-black/80 text-white px-3 py-2 rounded-lg text-sm">
      <label className="block mb-1 text-xs opacity-80">Test screen:</label>
      <select
        value={value}
        onChange={(e) => onChange((e.target.value || "") as GameScreen | "")}
        className="bg-white/20 border border-white/40 rounded px-2 py-1 text-white cursor-pointer"
      >
        {MOCK_SCREENS.map(({ value: v, label }) => (
          <option key={v || "real"} value={v}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
