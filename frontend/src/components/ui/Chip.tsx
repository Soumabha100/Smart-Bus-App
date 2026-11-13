import React from 'react';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ReactNode;
  variant?: 'mood' | 'date' | 'filter';
}

export const Chip: React.FC<ChipProps> = ({
  active = false,
  icon,
  variant = 'mood',
  children,
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 select-none whitespace-nowrap active:scale-95';

  const activeClasses = active
    ? variant === 'date'
      ? 'bg-[#FF7A59] text-white shadow-[0_4px_12px_rgba(255,122,89,0.35)]'
      : 'bg-[#2DD4BF]/20 border border-[#2DD4BF] text-[#2DD4BF] shadow-[0_0_12px_rgba(45,212,191,0.25)]'
    : 'bg-[#0C1321] border border-white/10 text-gray-400 hover:text-white hover:border-white/20';

  return (
    <button
      type="button"
      className={`${baseClasses} ${activeClasses} ${className}`}
      {...props}
    >
      {icon && <span className="text-sm">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

