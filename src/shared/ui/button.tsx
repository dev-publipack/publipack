import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'spin';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'lg',
  isLoading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses =
    'font-bungee rounded-[20px] border-4 transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50';

  const variantClasses = {
    primary:
      'bg-green-button hover:bg-green-button/90 border-green-stroke text-gray-light shadow-[0_0_5px_1px_rgba(0,0,0,0.25)]',
    secondary: 'bg-white hover:bg-gray-50 border-blue-dark text-blue-dark',
    spin: 'bg-green-button hover:bg-green-button/90 hover:scale-105 border-green-stroke text-gray-light shadow-[0_0_5px_1px_rgba(0,0,0,0.25)]',
  };

  const sizeClasses = {
    sm: 'w-[200px] h-[45px] text-xl',
    md: 'w-[240px] h-[50px] text-2xl',
    lg: 'w-[282px] h-[58px] text-[40px]',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block animate-pulse">...</span>
      ) : (
        children
      )}
    </button>
  );
}

/**
 * Spin Button
 *
 * Specialized button for "Spin Now"
 */
interface SpinButtonProps {
  onClick: () => void;
  disabled?: boolean;
  text?: string;
}

export function SpinButton({
  onClick,
  disabled = false,
  text = 'Spin Now',
}: SpinButtonProps) {
  return (
    <Button variant="spin" size="lg" onClick={onClick} disabled={disabled}>
      {text}
    </Button>
  );
}

/**
 * Claim Button
 *
 * Button for "Claim Now"
 */
interface ClaimButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function ClaimButton({
  onClick,
  disabled = false,
  isLoading = false,
}: ClaimButtonProps) {
  return (
    <Button
      variant="primary"
      size="md"
      onClick={onClick}
      disabled={disabled}
      isLoading={isLoading}
    >
      Claim Now
    </Button>
  );
}
