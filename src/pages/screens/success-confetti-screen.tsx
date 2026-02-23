import { SuccessConfettiAnimation } from "@/shared";
import { ScreenLayout } from "@/shared/ui/wrappers/screen-layout";

interface SuccessConfettiScreenProps {
  onComplete: () => void;
}

export function SuccessConfettiScreen({ onComplete }: SuccessConfettiScreenProps) {
  return (
    <ScreenLayout>
      <div className="w-full max-w-[360px] flex flex-col items-center">
        <SuccessConfettiAnimation onComplete={onComplete} />
      </div>
    </ScreenLayout>
  );
}
