import { FailedAnimation } from "@/shared";
import { ScreenLayout } from "@/shared/ui/wrappers/screen-layout";

interface FailedAnimationScreenProps {
  onComplete: () => void;
}

export function FailedAnimationScreen({ onComplete }: FailedAnimationScreenProps) {
  return (
    <ScreenLayout>
      <div className="w-full max-w-[480px] flex flex-col items-center">
        <FailedAnimation onComplete={onComplete} />
      </div>
    </ScreenLayout>
  );
}
