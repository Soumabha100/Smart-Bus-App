import React from 'react';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'dark' | 'light' | 'bordered';
  glow?: 'coral' | 'teal' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'dark',
  glow = 'none',
  children,
  className = '',
  ...props
}) => {
  const variantStyles = {
    dark: 'bg-[#19202E]/75 backdrop-blur-xl border border-white/10 text-[#FFF7ED] shadow-xl',
    light:
      'bg-[#FFFDF9]/90 backdrop-blur-xl border border-[#FF7A59]/15 text-[#0B1220] shadow-md',
    bordered:
      'bg-[#0C1321]/80 backdrop-blur-2xl border-2 border-white/10 text-[#FFF7ED] shadow-2xl',
  }[variant];

  const glowStyles = {
    coral: 'shadow-[0_0_24px_rgba(255,122,89,0.15)] border-[#FF7A59]/30',
    teal: 'shadow-[0_0_24px_rgba(45,212,191,0.15)] border-[#2DD4BF]/30',
    none: '',
  }[glow];

  return (
    <div
      className={`rounded-24 p-6 transition-all duration-300 relative overflow-hidden ${variantStyles} ${glowStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
