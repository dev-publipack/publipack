import React from 'react';

const lightOn = '/design/lights/light-on.svg' as string;
const lightOff = '/design/lights/light-off.svg' as string;

interface LightsRowProps {
  pattern?: boolean[];
}

export function LightsRow({
  pattern = [false, false, false, false, false],
}: LightsRowProps) {
  return (
    <div className="flex items-center z-2 absolute -top-7 left-0 right-0 justify-center gap-7">
      {pattern.map((isOn, index) => (
        isOn ? <img src={lightOn} className="w-5 h-5" alt="Light" key={index} /> : <img src={lightOff} className="w-5 h-5" alt="Light" key={index} />
      ))}
    </div>
  );
}

const WINNER_PATTERNS = [
  [false, false, false, false, false],
  [true, false, false, false, false],
  [true, true, false, false, false],
  [true, true, true, false, false],
  [true, true, true, true, false],
  [true, true, true, true, true],
  [false, false, false, false, false],
];

interface WinnerLightsProps {
  isAnimating?: boolean;
}

export function WinnerLights({ isAnimating = false }: WinnerLightsProps) {
  const [patternIndex, setPatternIndex] = React.useState(0);

  React.useEffect(() => {
    if (!isAnimating) {
      setPatternIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setPatternIndex((prev) => (prev + 1) % WINNER_PATTERNS.length);
    }, 200);

    return () => clearInterval(interval);
  }, [isAnimating]);

  return <LightsRow pattern={WINNER_PATTERNS[patternIndex]} />;
}
