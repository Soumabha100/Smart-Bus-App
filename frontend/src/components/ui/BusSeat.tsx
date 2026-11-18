import { memo, type FC } from 'react';
import generalSeatImg from '../../assets/General_Seat.png';
import availableSeatImg from '../../assets/General_Seat_Available.png';
import selectedSeatImg from '../../assets/General_Seat_Selected.png';
import bookedSeatImg from '../../assets/General_Seat_Booked.png';
import unavailableSeatImg from '../../assets/General_Seat_Unavailable.png';
import womenSeatImg from '../../assets/General_Seat_Women.png';

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

const SEAT_IMAGE_MAP: Record<SeatStatus, string> = {
  available: availableSeatImg,
  selected: selectedSeatImg,
  booked: bookedSeatImg,
  unavailable: unavailableSeatImg,
  women: womenSeatImg,
};

const SEAT_COLOR_CONFIG: Record<
  SeatStatus,
  {
    outline: string;
    highlight: string;
    bg: string;
    textColor: string;
    badgeBg: string;
    badgeText: string;
    badgeIcon?: string;
    label: string;
  }
> = {
  available: {
    outline: '#16834A',
    highlight: '#27AE60',
    bg: '#F0FBF4',
    textColor: '#16834A',
    badgeBg: 'bg-emerald-600',
    badgeText: 'text-white',
    label: 'Available',
  },
  selected: {
    outline: '#0B4DBB',
    highlight: '#2563EB',
    bg: '#EAF3FF',
    textColor: '#0B4DBB',
    badgeBg: 'bg-[#0B4DBB]',
    badgeText: 'text-white',
    badgeIcon: '✓',
    label: 'Selected',
  },
  booked: {
    outline: '#B94B53',
    highlight: '#D96A70',
    bg: '#FCEEEF',
    textColor: '#B94B53',
    badgeBg: 'bg-[#B94B53]',
    badgeText: 'text-white',
    badgeIcon: '✕',
    label: 'Booked',
  },
  unavailable: {
    outline: '#B8BDC5',
    highlight: '#A8AFB9',
    bg: '#F1F2F4',
    textColor: '#717A88',
    badgeBg: 'bg-[#A8AFB9]',
    badgeText: 'text-white',
    badgeIcon: '—',
    label: 'Unavailable',
  },
  women: {
    outline: '#C55473',
    highlight: '#E87999',
    bg: '#FFF0F5',
    textColor: '#C55473',
    badgeBg: 'bg-[#C55473]',
    badgeText: 'text-white',
    badgeIcon: '♀',
    label: 'Women Reserved',
  },
};

export const BusSeat: FC<BusSeatProps> = memo(({
  id,
  status,
  deck = 'lower',
  price,
  isSleeper = false,
  onClick,
  size = 'md',
  showPrice = true,
  showBadge = true,
  className = '',
  title,
}) => {
  const config = SEAT_COLOR_CONFIG[status];
  const imgSrc = SEAT_IMAGE_MAP[status] || generalSeatImg;
  const isInteractive = status === 'available' || status === 'selected' || status === 'women';
  const isSelected = status === 'selected';

  const sizeClasses = {
    sm: 'w-8 h-8 sm:w-9 sm:h-9',
    md: 'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12',
    lg: 'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20',
  }[size];

  const defaultTitle = `${id} (${deck === 'upper' ? 'Upper Berth' : 'Lower Seat'} • ${config.label})${price ? ` • ₹${price}` : ''}`;

  return (
    <button
      type="button"
      data-deck={deck}
      disabled={!isInteractive}
      onClick={isInteractive ? onClick : undefined}
      title={title || defaultTitle}
      aria-label={title || defaultTitle}
      className={`group relative flex flex-col items-center justify-center p-0.5 sm:p-1 rounded-xl transition-all duration-150 select-none ${
        isInteractive
          ? 'cursor-pointer hover:-translate-y-0.5 active:scale-95'
          : 'cursor-not-allowed opacity-80 filter saturate-75'
      } ${
        isSelected
          ? 'animate-seat-pop rounded-xl bg-blue-50/70'
          : isInteractive
          ? 'hover:bg-slate-100/60'
          : ''
      } ${className}`}
    >
      {/* Sleeper Deck Capsule Frame (for Upper Deck) */}
      {isSleeper ? (
        <div
          className={`flex flex-col items-center justify-between p-1.5 rounded-xl border transition-all select-none ${
            isSelected
              ? 'border-[#0B4DBB] bg-[#EAF3FF] shadow-xs ring-1 ring-[#0B4DBB]/30'
              : status === 'women'
              ? 'border-[#E87999] bg-[#FFF0F5]/80 hover:border-[#C55473]'
              : status === 'available'
              ? 'border-[#27AE60]/50 bg-[#F0FBF4]/80 hover:border-[#16834A]'
              : status === 'booked'
              ? 'border-[#D96A70]/50 bg-[#FCEEEF]/70'
              : 'border-[#B8BDC5]/60 bg-[#F1F2F4]/70'
          } w-[58px] sm:w-[64px] md:w-[70px] lg:w-[74px] min-h-[96px] sm:min-h-[102px] md:min-h-[108px]`}
        >
          {/* Berth Pillow Headrest (Clean rounded colored bar matching Image 2) */}
          <div className="w-full flex items-center justify-center px-0.5 mb-1">
            <div
              className={`h-2 w-full rounded-full shadow-inner ${
                isSelected
                  ? 'bg-[#2563EB]'
                  : status === 'women'
                  ? 'bg-[#E87999]'
                  : status === 'available'
                  ? 'bg-[#27AE60]'
                  : status === 'booked'
                  ? 'bg-[#D96A70]'
                  : 'bg-slate-300'
              }`}
            />
          </div>

          {/* 3D Seat Image Graphic */}
          <div className="relative my-0.5">
            <img
              src={imgSrc}
              alt={config.label}
              className={`${sizeClasses} object-contain transition-transform duration-200 group-hover:scale-105`}
              loading="lazy"
              draggable={false}
            />

            {/* Micro Badge for Status (Checkmark, Women ♀, etc.) */}
            {showBadge && config.badgeIcon && (
              <span
                className={`absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${config.badgeBg} ${config.badgeText} text-[8px] sm:text-[9px] font-black flex items-center justify-center shadow-xs leading-none`}
              >
                {config.badgeIcon}
              </span>
            )}
          </div>

          {/* Bottom: Sleeper Berth Price (Clean font, no divider line matching Image 2) */}
          {showPrice && price !== undefined ? (
            <span
              className={`text-[11px] font-bold font-mono mt-0.5 block ${
                isSelected
                  ? 'text-[#0B4DBB]'
                  : status === 'women'
                  ? 'text-[#C55473]'
                  : status === 'available'
                  ? 'text-slate-700'
                  : 'text-slate-400'
              }`}
            >
              ₹{price}
            </span>
          ) : null}
        </div>
      ) : (
        /* Regular Seater (Lower Deck) */
        <div className="flex flex-col items-center justify-center w-[52px] sm:w-[58px] md:w-[64px] lg:w-[68px]">
          <div className="relative">
            {/* 3D Seat Image Graphic */}
            <img
              src={imgSrc}
              alt={config.label}
              className={`${sizeClasses} object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-xs`}
              loading="lazy"
              draggable={false}
            />

            {/* Micro Status Badge */}
            {showBadge && config.badgeIcon && (
              <span
                className={`absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${config.badgeBg} ${config.badgeText} text-[8px] sm:text-[9px] font-black flex items-center justify-center shadow-xs leading-none`}
              >
                {config.badgeIcon}
              </span>
            )}
          </div>

          {/* Seat Price Display (Clean font matching Image 2) */}
          {showPrice && price !== undefined && (
            <span
              className={`text-[11px] font-bold font-mono mt-0.5 transition-colors ${
                isSelected
                  ? 'text-[#0B4DBB]'
                  : status === 'women'
                  ? 'text-[#C55473]'
                  : status === 'available'
                  ? 'text-slate-700'
                  : 'text-slate-400'
              }`}
            >
              ₹{price}
            </span>
          )}
        </div>
      )}
    </button>
  );
});

BusSeat.displayName = 'BusSeat';

export default BusSeat;
