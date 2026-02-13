import React from 'react';

/**
 * Offer Card Component
 *
 * Card with offer text (used on prize screen)
 *
 * Design specs:
 * - Font: Roboto 900, 24px (large discount) / 15px (text)
 * - UPPERCASE
 * - Colors: text on white or transparent background
 *
 * @see docs/DESIGN_SPEC.md - Section 6
 */
interface OfferCardProps {
  discount: string;
  description?: string;
  brand?: string;
  variant?: 'compact' | 'detailed';
  className?: string;
}

export function OfferCard({
  discount,
  description,
  brand,
  variant = 'detailed',
  className = '',
}: OfferCardProps) {
  if (variant === 'compact') {
    return (
      <div
        className={`bg-white/90 backdrop-blur rounded-2xl px-6 py-4 text-center ${className}`}
      >
        <p className="font-roboto font-black text-2xl text-orange uppercase">
          {discount}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`bg-white/90 backdrop-blur rounded-3xl px-8 py-6 text-center space-y-2 max-w-md ${className}`}
    >
      {/* Discount */}
      <h2 className="font-roboto font-black text-[24px] text-orange uppercase leading-tight">
        {discount}
      </h2>

      {/* Description */}
      {description && (
        <p className="font-roboto font-black text-[15px] text-blue-dark uppercase leading-snug">
          {description}
        </p>
      )}

      {/* Brand */}
      {brand && (
        <p className="font-bungee text-xl text-pink-bright">at {brand}</p>
      )}
    </div>
  );
}

/**
 * Winner Prize Display
 *
 * Display of won prize (used on WIN screen)
 */
interface WinnerPrizeProps {
  discount: string;
  brand: string;
  description: string;
}

export function WinnerPrize({ discount, brand, description }: WinnerPrizeProps) {
  return (
    <div className="text-center space-y-4">
      {/* Discount badge */}
      <div className="inline-block bg-white rounded-2xl px-8 py-3 shadow-lg">
        <p className="font-roboto font-black text-3xl text-orange uppercase">
          {discount}
        </p>
      </div>

      {/* Description */}
      <p className="font-roboto font-black text-sm text-blue-dark max-w-xs mx-auto leading-relaxed">
        {description}
      </p>

      {/* Brand highlight */}
      <p className="font-bungee text-2xl text-pink-bright">at {brand}</p>
    </div>
  );
}
