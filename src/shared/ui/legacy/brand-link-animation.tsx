import * as React from "react";
import { cn } from "../../lib/utils";
import { TrophyAnimation } from "./trophy-animation";

export interface BrandLinkAnimationProps {
  brandLink?: string;
  onClick?: () => void;
  className?: string;
}

export const BrandLinkAnimation = React.forwardRef<
  HTMLAnchorElement,
  BrandLinkAnimationProps
>(({ brandLink, onClick, className, ...props }, ref) => {
  if (!brandLink && !onClick) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a
      ref={ref}
      href={brandLink || "#"}
      onClick={handleClick}
      target={onClick ? undefined : "_blank"}
      rel={onClick ? undefined : "noopener noreferrer"}
      className={cn(
        "mb-4 sm:mb-6 relative z-10 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer",
        className
      )}
      {...props}
    >
      <TrophyAnimation />
    </a>
  );
});
BrandLinkAnimation.displayName = "BrandLinkAnimation";

