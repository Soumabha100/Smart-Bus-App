import React from 'react';

export interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dark' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  dotColor?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const PillButton: React.FC<PillButtonProps> = ({
  variant = 'primary',
  size = 'md',
  showDot = false,
  dotColor = 'bg-[#2DD4BF]',
  icon,
  fullWidth = false,
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-sora font-semibold rounded-full min-h-[48px] transition-all duration-200 select-none overflow-hidden active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs min-h-[40px]',
    md: 'px-6 py-3 text-sm min-h-[48px]',
    lg: 'px-8 py-3.5 text-base min-h-[56px]',
  }[size];

  const variantClasses = {
    primary:
      'bg-[#FF7A59] text-white hover:bg-[#E06547] shadow-[0_8px_20px_rgba(255,122,89,0.35)] hover:shadow-[0_10px_24px_rgba(255,122,89,0.45)]',
    secondary:
      'bg-[#2DD4BF] text-[#0B1220] hover:bg-[#20BEA9] shadow-[0_6px_18px_rgba(45,212,191,0.3)]',
    dark: 'bg-[#0B1220] text-[#FFF7ED] border border-white/10 hover:bg-[#19202E] shadow-lg',
    glass:
      'bg-white/10 backdrop-blur-md text-[#FFF7ED] border border-white/15 hover:bg-white/15',
    ghost:
      'bg-transparent text-[#FFF7ED] hover:text-[#FF7A59] hover:bg-white/5 border border-transparent',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {/* Ambient flare on hover for primary */}
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
      )}

      {showDot && (
        <span
          className={`w-2 h-2 rounded-full ${dotColor} mr-2 shadow-[0_0_8px_currentColor] animate-pulse`}
        />
      )}

      <span className="inline-flex items-center gap-2">
        {children}
        {icon && <span className="inline-flex items-center text-lg">{icon}</span>}
      </span>
    </button>
  );
};

