import { memo, type FC } from 'react';

export type SeatStatus = 'available' | 'selected' | 'booked' | 'unavailable' | 'women';

export interface BusSeatProps {
  id: string;
  status: SeatStatus;
  deck?: 'lower' | 'upper';
  price?: number;
  isSleeper?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showPrice?: boolean;
  showBadge?: boolean;
  className?: string;
  title?: string;
}

const SEAT_COLOR_CONFIG: Record<
  SeatStatus,
  {
    bg: string;
    border: string;
    textColor: string;
    iconColor: string;
    label: string;
  }
> = {
  available: {
    bg: '#DDF6DD',
    border: '#A8DDAA',
    textColor: '#16834A',
    iconColor: '#276749',
    label: 'Available',
  },
  selected: {
    bg: '#FC7728',
    border: '#E6651D',
    textColor: '#FFFFFF',
    iconColor: '#FFFFFF',
    label: 'Selected',
  },
  booked: {
    bg: '#E4E1E5',
    border: '#C6C2C9',
    textColor: '#77747D',
    iconColor: '#77747D',
    label: 'Booked',
  },
  unavailable: {
    bg: '#F3F2F1',
    border: '#E3E0DE',
    textColor: '#B7B3B0',
    iconColor: '#B7B3B0',
    label: 'Unavailable',
  },
  women: {
    bg: '#F8D1DF',
    border: '#EFA9BF',
    textColor: '#934C67',
    iconColor: '#934C67',
    label: 'Women only',
  },
};

/**
 * Top-down vector seat icon representing a luxury coach passenger seat.
 * Vector-only; lightweight, crisp on all resolutions, zero asset downloads.
 */
export const SeatArmchairIcon: FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Headrest / upper backrest */}
    <rect x="7" y="3" width="10" height="4" rx="2" />
    {/* Main seat cushion */}
    <rect x="6" y="8" width="12" height="10" rx="3" />
    {/* Left armrest */}
    <rect x="3.5" y="8" width="2.2" height="8" rx="1.1" />
    {/* Right armrest */}
    <rect x="18.3" y="8" width="2.2" height="8" rx="1.1" />
  </svg>
);

export const BusSeat: FC<BusSeatProps> = memo(({
  id,
  status,
  deck = 'lower',
  price,
  isSleeper = false,
  onClick,
  size = 'md',
  showPrice = false,
  showBadge = false,
  className = '',
  title,
}) => {
  const config = SEAT_COLOR_CONFIG[status] || SEAT_COLOR_CONFIG.available;
  const isInteractive = status === 'available' || status === 'selected' || status === 'women';
  const isSelected = status === 'selected';

  const defaultTitle = `${id} (${deck === 'upper' ? 'Upper Berth' : 'Lower Seat'} • ${config.label})${
    price ? ` • ₹${price}` : ''
  }`;

  // Sleeper Berth layout (Capsule)
  if (isSleeper) {
    return (
      <button
        type="button"
        disabled={!isInteractive}
        onClick={isInteractive ? onClick : undefined}
        title={title || defaultTitle}
        aria-label={title || defaultTitle}
        className={`group relative flex flex-col items-center justify-between p-1 rounded-xl border transition-all duration-150 select-none ${
          isInteractive
            ? 'cursor-pointer hover:-translate-y-0.5 active:scale-95'
            : 'cursor-not-allowed opacity-75'
        } ${
          isSelected
            ? 'shadow-md shadow-[#FC7728]/30 ring-2 ring-[#FC7728]'
            : ''
        } ${className}`}
        style={{
          backgroundColor: config.bg,
          borderColor: config.border,
          color: config.iconColor,
          width: size === 'sm' ? '46px' : '56px',
          minHeight: size === 'sm' ? '70px' : '84px',
        }}
      >
        {/* Sleeper pillow bar */}
        <div
          className="w-full h-1.5 rounded-full opacity-80"
          style={{ backgroundColor: isSelected ? '#FFFFFF' : config.iconColor }}
        />

        {/* Armchair / Berth Vector Icon */}
        <div className="my-auto">
          <SeatArmchairIcon className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
        </div>

        {/* Berth ID & Price */}
        <div className="flex flex-col items-center leading-none">
          <span
            className="text-[9px] font-bold font-mono"
            style={{ color: isSelected ? '#FFFFFF' : config.textColor }}
          >
            {id}
          </span>
          {showPrice && price !== undefined && (
            <span
              className="text-[9px] font-semibold opacity-90 mt-0.5"
              style={{ color: isSelected ? '#FFFFFF' : config.textColor }}
            >
              ₹{price}
            </span>
          )}
        </div>
      </button>
    );
  }

  // Circular Seater Layout (Matching Image 1: ~40px circular seat buttons on desktop)
  const circularSizeClasses = {
    sm: 'w-7.5 h-7.5 sm:w-8.5 sm:h-8.5',
    md: 'w-9.5 h-9.5 sm:w-10 sm:h-10 md:w-10.5 md:h-10.5',
    lg: 'w-11 h-11 sm:w-12 sm:h-12',
  }[size];

  const iconSizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4 sm:w-4.5 sm:h-4.5',
    lg: 'w-5 h-5',
  }[size];

  return (
    <button
      type="button"
      data-deck={deck}
      data-seat-id={id}
      disabled={!isInteractive}
      onClick={isInteractive ? onClick : undefined}
      title={title || defaultTitle}
      aria-label={title || defaultTitle}
      className={`group relative flex flex-col items-center justify-center rounded-full border transition-all duration-150 select-none ${circularSizeClasses} ${
        isInteractive
          ? 'cursor-pointer hover:scale-105 active:scale-95'
          : 'cursor-not-allowed opacity-75'
      } ${
        isSelected
          ? 'animate-seat-pop shadow-md shadow-[#FC7728]/35 ring-2 ring-[#FC7728]/40'
          : 'hover:shadow-xs'
      } ${className}`}
      style={{
        backgroundColor: config.bg,
        borderColor: config.border,
        color: config.iconColor,
      }}
    >
      <SeatArmchairIcon className={iconSizeClasses} />

      {/* Optional micro status badge */}
      {showBadge && isSelected && (
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white text-[#FC7728] text-[8px] font-black flex items-center justify-center shadow-xs">
          ✓
        </span>
      )}

      {/* Optional Price Display below seat */}
      {showPrice && price !== undefined && (
        <span
          className="absolute -bottom-4 text-[10px] font-bold font-mono tracking-tight pointer-events-none"
          style={{ color: config.textColor }}
        >
          ₹{price}
        </span>
      )}
    </button>
  );
});

BusSeat.displayName = 'BusSeat';

export default BusSeat;
