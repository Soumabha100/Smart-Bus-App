import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  fullWidth = true,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-brand hover:bg-brand-hover text-on-brand shadow-sm border border-transparent',
    secondary: 'bg-accent hover:bg-accent-hover text-on-accent shadow-sm border border-transparent',
    outline: 'bg-surface hover:bg-surface-2 text-ink-strong border border-line',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`min-h-[48px] px-6 py-3 rounded-xl font-sans text-sm font-semibold flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 ${
        fullWidth ? 'w-full' : ''
      } ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="flex items-center" aria-hidden="true">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
