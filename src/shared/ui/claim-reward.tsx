import * as React from "react";
import { cn } from "../lib/utils";
import type { Sponsor } from "../types";

export interface ClaimRewardProps {
  winner: Sponsor;
  onSubmit?: (data: { fullName: string; phone: string; email: string }) => void;
  onBack?: () => void;
  className?: string;
}

const ClaimReward = React.forwardRef<HTMLDivElement, ClaimRewardProps>(
  ({ winner, onSubmit, className, ...props }, ref) => {
    const [fullName, setFullName] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [focusedField, setFocusedField] = React.useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (onSubmit && fullName && phone && email) {
        onSubmit({ fullName, phone, email });
      }
    };

    return (
      <div
        ref={ref}
        className={cn("relative w-full min-h-screen flex flex-col items-center justify-center px-0 sm:px-4 md:px-6 lg:px-8", className)}
        {...props}
      >
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-[#163446] leading-[1.16] text-center mb-3 sm:mb-4 px-4">
          Claim your Reward
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-body-semibold text-black text-center leading-[1.362] mb-6 sm:mb-8 px-4">
          Fill in your details to receive your voucher
        </p>

        {/* Reward Info Card */}
        <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[350px] mb-6 sm:mb-8 px-4">
          <div
            className="w-full h-16 sm:h-18 md:h-20 rounded-2xl flex items-center justify-between px-4 sm:px-5 md:px-6"
            style={{ background: "#C3ECFF" }}
          >
            <span className="text-[#124258] text-base sm:text-lg md:text-xl lg:text-2xl font-heading">
              Your Reward
            </span>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Calendar icon */}
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: "#0E3347" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-[#0E3347] text-sm sm:text-base md:text-lg lg:text-xl font-heading whitespace-nowrap">
                {winner.name}
              </span>
            </div>
          </div>
        </div>

        {/* Form - full width on mobile, centered on larger screens */}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8 px-4 sm:px-0 sm:max-w-[600px] md:max-w-[700px]"
        >
          {/* Full Name Input - green when active, blue when inactive */}
          <div className="w-full">
            <div
              className={cn(
                "w-full h-16 sm:h-20 md:h-24 rounded-2xl flex items-center justify-center px-4 sm:px-5 md:px-6 transition-all duration-200",
                focusedField === "fullName"
                  ? "border-4 border-[#16DC58] bg-[#E7FFEF]"
                  : "border-4 border-[#38BEF4] bg-[#E9F9FF]"
              )}
            >
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onFocus={() => setFocusedField("fullName")}
                onBlur={() => setFocusedField(null)}
                placeholder="Full name"
                className="w-full bg-transparent border-none outline-none text-center text-base sm:text-lg md:text-xl lg:text-2xl font-body-semibold text-[#154F6A] placeholder:text-[#154F6A] placeholder:opacity-70"
                required
              />
            </div>
          </div>

          {/* Phone Number Input - green when active, blue when inactive */}
          <div className="w-full">
            <div
              className={cn(
                "w-full h-16 sm:h-20 md:h-24 rounded-2xl flex items-center justify-center px-4 sm:px-5 md:px-6 transition-all duration-200",
                focusedField === "phone"
                  ? "border-4 border-[#16DC58] bg-[#E7FFEF]"
                  : "border-4 border-[#38BEF4] bg-[#E9F9FF]"
              )}
            >
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onFocus={() => setFocusedField("phone")}
                onBlur={() => setFocusedField(null)}
                placeholder="Phone Number"
                className="w-full bg-transparent border-none outline-none text-center text-base sm:text-lg md:text-xl lg:text-2xl font-body-semibold text-[#154F6A] placeholder:text-[#154F6A] placeholder:opacity-70"
                required
              />
            </div>
          </div>

          {/* Email Address Input - green when active, blue when inactive */}
          <div className="w-full">
            <div
              className={cn(
                "w-full h-16 sm:h-20 md:h-24 rounded-2xl flex items-center justify-center px-4 sm:px-5 md:px-6 transition-all duration-200",
                focusedField === "email"
                  ? "border-4 border-[#16DC58] bg-[#E7FFEF]"
                  : "border-4 border-[#38BEF4] bg-[#E9F9FF]"
              )}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="Email Address"
                className="w-full bg-transparent border-none outline-none text-center text-base sm:text-lg md:text-xl lg:text-2xl font-body-semibold text-[#154F6A] placeholder:text-[#154F6A] placeholder:opacity-70"
                required
              />
            </div>
          </div>

          {/* Get My Voucher Button */}
          <button
            type="submit"
            className="w-full h-14 sm:h-16 md:h-20 lg:h-24 rounded-full text-white text-lg sm:text-xl md:text-3xl lg:text-4xl font-heading leading-[1.4] hover:opacity-90 transition-opacity px-6"
            style={{
              background: "#FF9442",
            }}
          >
            Get My Voucher
          </button>
        </form>
      </div>
    );
  }
);
ClaimReward.displayName = "ClaimReward";

export { ClaimReward };
