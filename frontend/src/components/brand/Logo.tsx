import type { FC } from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'bus' | 'badge';
}

export const Logo: FC<LogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md',
  variant = 'bus',
}) => {
  const iconSizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textClasses = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-extrabold',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {variant === 'bus' ? (
        /* Speed Bus Emblem (Matching Reference Artwork) */
        <div className={`${iconSizeClasses[size]} flex items-center justify-center text-accent shrink-0`}>
          <svg viewBox="0 0 32 32" fill="none" className="w-full h-full" aria-hidden="true">
            {/* Speed trails */}
            <path d="M2 10h8M4 14h6M3 18h7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Streamlined Bus Body */}
            <path
              d="M11 8h12c2.5 0 4.5 1.5 5 4l1 6c.3 1.5-.7 3-2 3h-1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2h-8v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2H7c-1.1 0-2-.9-2-2v-5c0-2.2 1.8-4 4-4h2z"
              fill="currentColor"
            />
            {/* Windshield */}
            <path d="M21 11h-7v4h8.5c-.3-1.5-1.5-3-3-4" fill="white" opacity="0.95" />
            {/* Wheels */}
            <circle cx="11.5" cy="21.5" r="2.5" fill="var(--brand)" />
            <circle cx="11.5" cy="21.5" r="1" fill="white" />
            <circle cx="23.5" cy="21.5" r="2.5" fill="var(--brand)" />
            <circle cx="23.5" cy="21.5" r="1" fill="white" />
            {/* Headlight */}
            <circle cx="27" cy="18" r="1.2" fill="var(--accent-bright)" />
          </svg>
        </div>
      ) : (
        /* Navy Badge Emblem */
        <div
          className={`${iconSizeClasses[size]} bg-brand text-on-brand rounded-xl flex items-center justify-center shadow-sm shrink-0`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-on-brand"
            aria-hidden="true"
          >
            <path d="M9.5 7.5L13 5v14" />
            <path d="M9 19h8" />
          </svg>
        </div>
      )}

      {!iconOnly && (
        <span className={`font-sans ${textClasses[size]} text-ink-strong tracking-tight`}>
          One Go Bus
        </span>
      )}
    </div>
  );
};
