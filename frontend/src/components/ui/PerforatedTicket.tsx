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
      className={`ticket-card rounded-2xl shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md ${className}`}
    >
      {/* Top glowing strip if Best For You */}
      {ticket.isBestForYou && (
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 via-[#FC7728] to-teal-500" />
      )}

      {/* Responsive layout: vertical stack on mobile, horizontal boarding pass on desktop (md+) */}
      <div className="grid grid-cols-1 md:grid-cols-12 relative w-full">
        {/* Notches on MD screens */}
        <div className="hidden md:block ticket-notch-top left-[calc(72%-10px)]" />
        <div className="hidden md:block ticket-notch-bottom left-[calc(72%-10px)]" />

        {/* Main Ticket Body */}
        <div className="md:col-span-8 lg:col-span-8.5 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            {/* Header info */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                {ticket.isBestForYou && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-2 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
                    <span>✨ {ticket.bestForReason || 'Best for you'}</span>
                  </div>
                )}
                <h3 className="font-sans text-lg sm:text-xl font-extrabold text-[#0B2341] tracking-tight">
                  {ticket.operator}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-[#64748B]">
                  <span className="inline-flex items-center gap-1 text-[#FC7728] font-bold bg-[#FBF9F5] px-2 py-0.5 rounded-md border border-[#E5E1D8]">
                    <span className="material-symbols-outlined text-[14px]">star</span>
                    {ticket.rating.toFixed(1)}
                  </span>
                  <span>•</span>
                  <span>{ticket.busType}</span>
                </div>
              </div>

              {/* Mobile-only Price */}
              <div className="md:hidden text-right">
                <span className="font-sans text-2xl font-extrabold text-[#0B2341]">
                  ₹{ticket.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-[#64748B] block">per seat</span>
              </div>
            </div>

            {/* Departure to Arrival Timeline */}
            <div className="flex items-center justify-between py-3 my-2 border-y border-[#E5E1D8]">
              <div className="flex flex-col">
                <span className="font-sans text-lg sm:text-xl font-bold text-[#0B2341]">
                  {ticket.departureTime}
                </span>
                <span className="text-xs text-[#64748B] font-medium mt-0.5 max-w-[130px] truncate">
                  {ticket.originStation}
                </span>
              </div>

              <div className="flex-1 flex flex-col items-center px-4 sm:px-8">
                <span className="text-xs text-[#64748B] font-medium mb-1">
                  {ticket.duration}
                </span>
                <div className="w-full relative flex items-center">
                  <div className="w-full h-1 bg-gradient-to-r from-teal-500 via-[#FC7728] to-[#0B2341] rounded-full" />
                  <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#FC7728] shadow-xs ring-2 ring-white" />
                </div>
                <span className="text-[11px] text-teal-800 font-bold mt-1 uppercase tracking-wider">
                  Direct Express
                </span>
              </div>

              <div className="flex flex-col text-right">
                <span className="font-sans text-lg sm:text-xl font-bold text-[#0B2341]">
                  {ticket.arrivalTime}
                </span>
                <span className="text-xs text-[#64748B] font-medium mt-0.5 max-w-[130px] truncate">
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
                className="px-2.5 py-1 rounded-lg bg-[#FBF9F5] border border-[#E5E1D8] text-xs text-[#44474E] font-medium flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Ticket Stub */}
        <div className="md:col-span-4 lg:col-span-3.5 p-5 sm:p-6 bg-[#FBF9F5] md:border-l md:border-dashed md:border-[#E5E1D8] flex flex-col justify-between items-center text-center shrink-0 border-t md:border-t-0">
          {/* Desktop Price Header */}
          <div className="hidden md:flex flex-col items-center">
            <span className="text-[11px] uppercase tracking-widest text-[#64748B] font-semibold">
              Traveler Fare
            </span>
            <span className="font-sans text-3xl font-extrabold text-[#0B2341] mt-0.5">
              ₹{ticket.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-[#64748B]">all taxes included</span>
          </div>

          {/* Seat Availability Dots */}
          <div className="flex flex-col items-center gap-1.5 my-2 w-full">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full ${
                    i < Math.min(ticket.seatsLeft, 3)
                      ? 'bg-teal-600 shadow-xs'
                      : 'bg-[#E5E1D8]'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-[#64748B] font-medium">
              {ticket.seatsLeft} window/berth left
            </span>
          </div>

          {/* Action CTA */}
          <button
            type="button"
            onClick={() => onSelect?.(ticket)}
            className="w-full h-11 rounded-full bg-[#FC7728] hover:bg-[#E06547] text-white font-sans font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all mt-2 cursor-pointer"
          >
            <span>Reserve Seat</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </article>
  );
};
