import React from 'react';

export interface BusTicketData {
  id: string;
  operator: string;
  busType: string;
  rating: number;
  reviewsCount?: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  originStation: string;
  destinationStation: string;
  price: number;
  seatsLeft: number;
  comfortTags: string[];
  isBestForYou?: boolean;
  bestForReason?: string;
  operatorLogo?: string;
}

export interface PerforatedTicketProps {
  ticket: BusTicketData;
  onSelect?: (ticket: BusTicketData) => void;
  className?: string;
}

export const PerforatedTicket: React.FC<PerforatedTicketProps> = ({
  ticket,
  onSelect,
  className = '',
}) => {
  return (
    <article
      aria-label={`Bus ticket: ${ticket.operator}, from ${ticket.originStation} to ${ticket.destinationStation}`}
      className={`relative w-full rounded-3xl bg-[#19202E]/85 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden transition-all duration-300 hover:border-white/25 hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)] ${className}`}
    >
      {/* Top glowing strip if Best For You */}
      {ticket.isBestForYou && (
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#2DD4BF] via-[#FF7A59] to-[#2DD4BF]" />
      )}

      {/* Responsive layout: vertical stack on mobile, horizontal boarding pass on desktop (md+) */}
      <div className="flex flex-col md:flex-row w-full">
        {/* Main Ticket Body (Left on desktop, Top on mobile) */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            {/* Header info */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                {ticket.isBestForYou && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF] text-[#2DD4BF] text-xs font-semibold mb-2.5 shadow-[0_0_12px_rgba(45,212,191,0.25)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-ping" />
                    <span>✨ {ticket.bestForReason || 'Best for you'}</span>
                  </div>
                )}
                <h3 className="font-sora text-lg sm:text-xl font-bold text-white tracking-tight">
                  {ticket.operator}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <span className="inline-flex items-center gap-1 text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                    <span className="material-symbols-outlined text-[14px]">star</span>
                    {ticket.rating.toFixed(1)}
                  </span>
                  <span>•</span>
                  <span>{ticket.busType}</span>
                </div>
              </div>

              {/* Mobile-only Price (hidden on desktop) */}
              <div className="md:hidden text-right">
                <span className="font-sora text-2xl font-bold text-[#FF7A59]">
                  ₹{ticket.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-gray-400 block">per seat</span>
              </div>
            </div>

            {/* Departure to Arrival Timeline */}
            <div className="flex items-center justify-between py-4 my-2 border-y border-white/5">
              <div className="flex flex-col">
                <span className="font-sora text-lg sm:text-xl font-bold text-white">
                  {ticket.departureTime}
                </span>
                <span className="text-xs text-[#DFC0B8] font-medium mt-0.5 max-w-[130px] truncate">
                  {ticket.originStation}
                </span>
              </div>

              <div className="flex-1 flex flex-col items-center px-4 sm:px-8">
                <span className="text-xs text-gray-400 font-medium mb-1.5">
                  {ticket.duration}
                </span>
                <div className="w-full relative flex items-center">
                  <div className="w-full h-1 bg-gradient-to-r from-[#2DD4BF] via-[#FDBA74] to-[#FF7A59] rounded-full"></div>
                  <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#FF7A59] shadow-[0_0_10px_#FF7A59] ring-2 ring-[#0B1220]"></div>
                </div>
                <span className="text-[11px] text-[#2DD4BF] font-semibold mt-1.5 uppercase tracking-wider">
                  Direct Express
                </span>
              </div>

              <div className="flex flex-col text-right">
                <span className="font-sora text-lg sm:text-xl font-bold text-white">
                  {ticket.arrivalTime}
                </span>
                <span className="text-xs text-[#DFC0B8] font-medium mt-0.5 max-w-[130px] truncate">
                  {ticket.destinationStation}
                </span>
              </div>
            </div>
          </div>

          {/* Comfort Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {ticket.comfortTags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 font-medium flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Perforated Edge Divider */}
        {/* Mobile Perforation (Horizontal) */}
        <div className="md:hidden relative flex items-center justify-between w-full h-6 overflow-hidden">
          <div className="w-6 h-6 rounded-full bg-[#0B1220] border-r border-white/15 -ml-3 z-10 shadow-inner" />
          <div className="flex-1 border-t-2 border-dashed border-white/20 mx-1" />
          <div className="w-6 h-6 rounded-full bg-[#0B1220] border-l border-white/15 -mr-3 z-10 shadow-inner" />
        </div>

        {/* Desktop Perforation (Vertical) */}
        <div className="hidden md:flex relative flex-col items-center justify-between w-6 overflow-hidden">
          <div className="w-6 h-6 rounded-full bg-[#0B1220] border-b border-white/15 -mt-3 z-10 shadow-inner" />
          <div className="h-full border-r-2 border-dashed border-white/20 my-1" />
          <div className="w-6 h-6 rounded-full bg-[#0B1220] border-t border-white/15 -mb-3 z-10 shadow-inner" />
        </div>

        {/* Ticket Stub (Right on desktop, Bottom on mobile) */}
        <div className="p-5 sm:p-6 md:w-64 bg-black/25 flex flex-col justify-between items-center text-center shrink-0">
          {/* Desktop Price Header */}
          <div className="hidden md:flex flex-col items-center">
            <span className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">
              Traveler Fare
            </span>
            <span className="font-sora text-3xl font-bold text-[#FF7A59] mt-0.5">
              ₹{ticket.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-gray-400">all taxes included</span>
          </div>

          {/* Seat Availability Dots */}
          <div className="flex flex-col items-center gap-1.5 my-2 w-full">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full ${
                    i < Math.min(ticket.seatsLeft, 3)
                      ? 'bg-[#2DD4BF] shadow-[0_0_8px_#2DD4BF]'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-300 font-medium">
              {ticket.seatsLeft} window/berth left
            </span>
          </div>

          {/* Action CTA */}
          <button
            type="button"
            onClick={() => onSelect?.(ticket)}
            className="w-full h-12 rounded-full bg-[#FF7A59] hover:bg-[#E06547] text-white font-sora font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(255,122,89,0.4)] active:scale-95 transition-all mt-2"
          >
            <span>Reserve Seat</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </article>
  );
};
