import * as React from "react";
import { cn } from "../lib/utils";

export interface CountdownTimerProps {
  seconds: number;
  className?: string;
}

const CountdownTimer = React.forwardRef<HTMLDivElement, CountdownTimerProps>(
  ({ seconds, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative flex items-center justify-center", className)}
        {...props}
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-white border-4 sm:border-[5px] md:border-[6px] border-[#0C97E4] flex items-center justify-center">
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading text-black leading-[1.4]">
            {seconds}s
          </span>
        </div>
      </div>
    );
  }
);
CountdownTimer.displayName = "CountdownTimer";

export { CountdownTimer };

