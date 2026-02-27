import * as React from "react";
import { z } from "zod";
import { cn } from "../../lib/utils";
import type { Sponsor } from "../../types";
import { pipedreamClient } from "../../api/pipedream-client";
import { brevoClient } from "../../api/brevo-client";
import { useLanguage } from "../../../providers/language-provider";
import { trackButtonClick, trackFormFieldInteraction, trackFormSubmit } from "../../lib/analytics";

export interface ClaimRewardProps {
  winner: Sponsor;
  onSubmit?: (data: { fullName: string; phone: string; email: string }) => void;
  onBack?: () => void;
  className?: string;
}

// Create validation schema with translations
const createClaimRewardSchema = (t: (key: string) => string) => z.object({
  fullName: z
    .string()
    .min(1, t("validation.fullNameRequired"))
    .min(2, t("validation.fullNameMinLength"))
    .max(80, t("validation.fullNameMaxLength")),
  phone: z
    .string()
    .min(1, t("validation.phoneRequired"))
    .regex(/^[\d\s+\-()]+$/, t("validation.phoneInvalidChars"))
    .refine(
      (val) => val.replace(/\D/g, "").length >= 10,
      t("validation.phoneMinDigits")
    ),
  email: z
    .string()
    .min(1, t("validation.emailRequired"))
    .email(t("validation.emailInvalid")),
});

type ClaimRewardFormData = {
  fullName: string;
  phone: string;
  email: string;
};

const ClaimReward = React.forwardRef<HTMLDivElement, ClaimRewardProps>(
  ({ winner, onSubmit, className, ...props }, ref) => {
    const { t } = useLanguage();
    const [fullName, setFullName] = React.useState("");
    const [phone, setPhone] = React.useState("+34");
    const [email, setEmail] = React.useState("");
    const [focusedField, setFocusedField] = React.useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [errors, setErrors] = React.useState<Partial<Record<keyof ClaimRewardFormData, string>>>({});
    const [touched, setTouched] = React.useState<Partial<Record<keyof ClaimRewardFormData, boolean>>>({});

    // Create schema with current language translations
    const ClaimRewardSchema = React.useMemo(() => createClaimRewardSchema(t), [t]);

    // Validate single field
    const validateField = React.useCallback((fieldName: keyof ClaimRewardFormData, value: string) => {
      // Get the field schema from the main schema
      const fieldSchema = ClaimRewardSchema.shape[fieldName];
      if (!fieldSchema) return;

      // Validate the field value directly
      const result = fieldSchema.safeParse(value);
      if (!result.success) {
        const errorMessage = result.error.issues[0]?.message || t("validation.fullNameRequired");
        setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
      } else {
        // Clear error for this field if validation passes
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }, [ClaimRewardSchema, t]);

    // Handle field change with runtime validation
    const handleFieldChange = React.useCallback(
      (fieldName: keyof ClaimRewardFormData, value: string, setter: (value: string) => void) => {
        setter(value);
        // Track field change
        trackFormFieldInteraction(fieldName, 'change');
        // Validate in real-time if field was touched
        if (touched[fieldName]) {
          validateField(fieldName, value);
        }
      },
      [touched, validateField]
    );

    // Handle field blur - mark as touched and validate
    const handleFieldBlur = React.useCallback(
      (fieldName: keyof ClaimRewardFormData, value: string) => {
        setFocusedField(null);
        setTouched((prev) => ({ ...prev, [fieldName]: true }));
        // Track field blur
        trackFormFieldInteraction(fieldName, 'blur', { hasValue: value.length > 0 ? 1 : 0 });
        validateField(fieldName, value);
      },
      [validateField]
    );

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      console.log("🚀 Form submit triggered", { fullName, phone, email });

      // Track form submit attempt
      trackFormSubmit("Claim Reward Form");

      // Validate with Zod
      const result = ClaimRewardSchema.safeParse({
        fullName,
        phone,
        email,
      });

      if (!result.success) {
        const fieldErrors: Partial<Record<keyof ClaimRewardFormData, string>> = {};
        result.error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ClaimRewardFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
        console.warn("⚠️ Form validation failed", fieldErrors);
        return;
      }

      // Clear errors if validation passes
      setErrors({});
      setIsSubmitting(true);
      console.log("📤 Submitting to Google Sheets...");

      try {
        // Submit to Google Sheets via Pipedream (production-ready, zero CORS issues)
        const pipedreamSuccess = await pipedreamClient.submitLead({
          fullName,
          phone,
          email,
          sponsorName: winner.name,
          sponsorReward: winner.reward,
        });

        if (pipedreamSuccess) {
          console.log("✅ Lead submitted successfully to Google Sheets");
        } else {
          console.error("⚠️ Failed to submit lead, but continuing...");
        }

        // Send confirmation email via Brevo
        const emailSuccess = await brevoClient.sendEmail({
          to: email,
          subject: "🎉 Thanks for playing with app.publipacks.com",
          brandUrl: winner.url,
          fullName: fullName,
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
              <h1 style="color: #163446; text-align: center; margin-bottom: 30px;">🎉 Thanks for playing!</h1>
              
              <p>Hi ${fullName},</p>
              
              <p>Thank you for playing with publipacks.com! The safest platform to win amazing awards near you!</p>
              
              <div style="background: #E9F9FF; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #44D2FD;">
                <p style="margin: 0; font-weight: bold; color: #124258;">👉 Congratulations — you've won a prize!</p>
                <p style="margin: 10px 0 0 0; color: #154F6A;">${winner.name}: ${winner.reward}</p>
              </div>
              
              <p>Enjoy free prizes and exclusive discounts all around the world.</p>
              
              <p>
                Sign up to receive free offers directly to your email, — 
                <a href="${winner.url}" style="color: #44D2FD; text-decoration: none;"> click here to join</a>.
              </p>
              
              <p>Keep playing, keep winning, and keep discovering amazing rewards!</p>
              
              <p style="margin-top: 30px;">
                Cheers,<br>
                <strong>The app.publipacks.com Team</strong>
              </p>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 40px 0 20px 0;">
              
              <div style="text-align: center; font-size: 12px; color: #666; margin-top: 20px;">
                <p style="margin: 5px 0;">©️ 2025 Publicpacks.com. All rights reserved.</p>
              </div>
            </div>
          `,
          textContent: `Hi ${fullName},

Thank you for playing with publipacks.com! The safest platform to win amazing awards near you!

👉 Congratulations — you've won a prize!
${winner.name}: ${winner.reward}

Enjoy free prizes and exclusive discounts all around the world.

Sign up to receive free offers directly to your email, — click here to join: ${winner.url} 

Keep playing, keep winning, and keep discovering amazing rewards!

Cheers,
The app.publipacks.com Team

©️ 2025 Publicpacks.com. All rights reserved.`,
        });

        if (emailSuccess) {
          console.log("✅ Confirmation email sent successfully");
        } else {
          console.warn("⚠️ Failed to send confirmation email, but continuing...");
        }

        // Call original onSubmit callback
        if (onSubmit) {
          onSubmit({ fullName, phone, email });
        }
      } catch (error) {
        console.error("❌ Error during submission:", error);
        // Still call onSubmit to not block user flow
        if (onSubmit) {
          onSubmit({ fullName, phone, email });
        }
      } finally {
        setIsSubmitting(false);
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
          {t('claimReward.title').split(t('claimReward.titleBold'))[0]}<span className="text-[#44D2FD]">{t('claimReward.titleBold')}</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-body-semibold text-black text-center leading-[1.362] mb-6 sm:mb-8 px-4">
          {t('claimReward.subtitle')}
        </p>

        {/* Reward Info Card */}
        <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[350px] mb-6 sm:mb-8 px-4">
          <div
            className="w-full h-16 sm:h-18 md:h-20 rounded-2xl sm:px-5 md:px-6 flex items-center justify-сenter gap-3 sm:gap-4"
          >
            <span
              style={{ background: "#C3ECFF" }}
              className="text-[#124258] border rounded-md p-2 sm:p-3 text-base sm:text-lg md:text-xl lg:text-2xl font-heading whitespace-nowrap">
              {t("claimReward.rewardLabel")}
            </span>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Calendar icon */}
              <svg width="32" height="32" viewBox="0 0 39 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M34.7211 9.594H30.4424C31.9673 8.6367 32.9678 7.062 32.9678 5.2815C32.9678 2.36865 30.2973 0 27.0146 0C24.2285 0 20.9297 4.7725 19.0883 7.85895C17.2471 4.7733 13.9483 0 11.1622 0C7.88092 0 5.20896 2.3694 5.20896 5.2815C5.20896 7.062 6.20946 8.6367 7.73436 9.594H3.4569C2.54047 9.59493 1.66184 9.95935 1.01376 10.6073C0.365689 11.2553 0.0011052 12.1338 0 13.0503V18.531C0.000834404 19.1757 0.181926 19.8074 0.522821 20.3546C0.863716 20.9018 1.35083 21.3428 1.92915 21.6278V34.1697C1.93022 35.0862 2.29479 35.9649 2.94288 36.613C3.59097 37.2611 4.46966 37.6257 5.3862 37.6267H33.0468C33.9634 37.6259 34.8423 37.2615 35.4904 36.6133C36.1385 35.9652 36.503 35.0863 36.5039 34.1697V21.4863C37.0141 21.1801 37.4365 20.7471 37.7299 20.2294C38.0233 19.7117 38.1777 19.1268 38.1781 18.5317V13.0503C38.177 12.1338 37.8125 11.2552 37.1644 10.6073C36.5163 9.95932 35.6376 9.5949 34.7211 9.594ZM3.4569 18.8387C3.37544 18.8387 3.29731 18.8064 3.23965 18.7488C3.182 18.6913 3.14954 18.6132 3.1494 18.5317V13.0503C3.1497 12.969 3.18223 12.8911 3.23987 12.8337C3.29751 12.7763 3.37556 12.7441 3.4569 12.7442H17.5135V18.8379H3.4569V18.8387ZM20.663 12.7442H35.0031C35.0099 12.7442 35.0164 12.7469 35.0212 12.7517C35.026 12.7565 35.0287 12.763 35.0287 12.7698V18.8123C35.0287 18.8191 35.0261 18.8256 35.0213 18.8304C35.0165 18.8352 35.01 18.8379 35.0032 18.8379H20.663V12.7442ZM27.0131 3.14865C28.5336 3.14865 29.8183 4.12575 29.8183 5.2815C29.8183 6.438 28.5336 7.4151 27.0131 7.4151H23.1225C24.7162 5.1138 26.354 3.28575 27.0131 3.14865ZM11.1195 3.14655C11.8125 3.28425 13.4574 5.1138 15.0527 7.41585H11.1621C9.64305 7.41585 8.3583 6.43875 8.3583 5.28225C8.3583 4.1265 9.64305 3.14865 11.1195 3.14655ZM5.08005 34.4518V21.9873H17.5135V34.4773H5.10556C5.0988 34.4773 5.09232 34.4746 5.08754 34.4698C5.08276 34.4651 5.08006 34.4586 5.08005 34.4518ZM33.3303 34.4773H20.663V21.9874H33.3559V34.4518C33.3559 34.4585 33.3532 34.4651 33.3484 34.4699C33.3436 34.4747 33.3371 34.4773 33.3303 34.4773Z" fill="#124258" />
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
                  : errors.fullName
                    ? "border-4 border-red-500 bg-[#FFE7E7]"
                    : "border-4 border-[#38BEF4] bg-[#E9F9FF]"
              )}
            >
              <input
                type="text"
                value={fullName}
                onChange={(e) => handleFieldChange("fullName", e.target.value, setFullName)}
                onFocus={() => {
                  setFocusedField("fullName");
                  trackFormFieldInteraction("fullName", "focus");
                }}
                onBlur={() => handleFieldBlur("fullName", fullName)}
                placeholder={t('claimReward.fullNamePlaceholder')}
                autoComplete="name"
                className="w-full bg-transparent border-none outline-none text-center text-base sm:text-lg md:text-xl lg:text-2xl font-body-semibold text-[#154F6A] placeholder:text-[#154F6A] placeholder:opacity-70"
                required
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500 text-center px-4">{errors.fullName}</p>
            )}
          </div>

          {/* Phone Number Input - green when active, blue when inactive */}
          <div className="w-full">
            <div
              className={cn(
                "w-full h-16 sm:h-20 md:h-24 rounded-2xl flex items-center justify-center px-4 sm:px-5 md:px-6 transition-all duration-200",
                focusedField === "phone"
                  ? "border-4 border-[#16DC58] bg-[#E7FFEF]"
                  : errors.phone
                    ? "border-4 border-red-500 bg-[#FFE7E7]"
                    : "border-4 border-[#38BEF4] bg-[#E9F9FF]"
              )}
            >
              <input
                type="tel"
                value={phone}
                onChange={(e) => handleFieldChange("phone", e.target.value, setPhone)}
                onFocus={() => {
                  setFocusedField("phone");
                  trackFormFieldInteraction("phone", "focus");
                }}
                onBlur={() => handleFieldBlur("phone", phone)}
                placeholder={t('claimReward.phonePlaceholder')}
                autoComplete="tel"
                className="w-full bg-transparent border-none outline-none text-center text-base sm:text-lg md:text-xl lg:text-2xl font-body-semibold text-[#154F6A] placeholder:text-[#154F6A] placeholder:opacity-70"
                required
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500 text-center px-4">{errors.phone}</p>
            )}
          </div>

          {/* Email Address Input - green when active, blue when inactive */}
          <div className="w-full">
            <div
              className={cn(
                "w-full h-16 sm:h-20 md:h-24 rounded-2xl flex items-center justify-center px-4 sm:px-5 md:px-6 transition-all duration-200",
                focusedField === "email"
                  ? "border-4 border-[#16DC58] bg-[#E7FFEF]"
                  : errors.email
                    ? "border-4 border-red-500 bg-[#FFE7E7]"
                    : "border-4 border-[#38BEF4] bg-[#E9F9FF]"
              )}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => handleFieldChange("email", e.target.value, setEmail)}
                onFocus={() => {
                  setFocusedField("email");
                  trackFormFieldInteraction("email", "focus");
                }}
                onBlur={() => handleFieldBlur("email", email)}
                placeholder={t('claimReward.emailPlaceholder')}
                autoComplete="email"
                className="w-full bg-transparent border-none outline-none text-center text-base sm:text-lg md:text-xl lg:text-2xl font-body-semibold text-[#154F6A] placeholder:text-[#154F6A] placeholder:opacity-70"
                required
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500 text-center px-4">{errors.email}</p>
            )}
          </div>

          {/* Get My Voucher Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            onClick={(e) => {
              // Debug: ensure button click is registered
              console.log("🔘 Button clicked", { isSubmitting, fullName, phone, email });
              trackButtonClick("Get My Voucher");
              // Let form handle submit naturally
            }}
            className="mt-8 w-full h-14 sm:h-16 md:h-20 lg:h-24 rounded-full text-white text-lg sm:text-xl md:text-3xl lg:text-4xl font-heading leading-[1.4] hover:opacity-90 transition-opacity px-6 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            style={{
              background: "#FF9442",
            }}
          >
            {isSubmitting ? (
              <>
                <span className="relative z-10">{t('claimReward.submittingButton')}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 animate-pulse" />
              </>
            ) : (
              t('claimReward.getVoucherButton')
            )}
          </button>

          {/* Loading progress bar below button */}
          {isSubmitting && (
            <div className="mt-4 w-full max-w-[600px] mx-auto">
              <div className="w-full h-3 sm:h-4 md:h-5 lg:h-6 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full animate-pulse w-full" />
              </div>
            </div>
          )}
        </form>
      </div>
    );
  }
);
ClaimReward.displayName = "ClaimReward";

export { ClaimReward };
