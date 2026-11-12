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
      aria-label={`Bus ticket: ${ticket.operator}, ${ticket.originStation} to ${ticket.destinationStation}`}
      className={`relative w-full rounded-24 bg-[#19202E]/85 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-[0_12px_28px_rgba(0,0,0,0.4)] ${className}`}
    >
      {/* Glow highlight if Best For You */}
      {ticket.isBestForYou && (
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#2DD4BF] via-[#FF7A59] to-[#2DD4BF]" />
      )}

      {/* Main Ticket Upper Section */}
      <div className="p-5 pb-4">
        {ticket.isBestForYou && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF] text-[#2DD4BF] text-xs font-semibold mb-3 shadow-[0_0_12px_rgba(45,212,191,0.3)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-ping" />
            <span>✨ {ticket.bestForReason || 'Best for you'}</span>
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-sora text-base font-bold text-white tracking-tight">
              {ticket.operator}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
              <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                <span className="material-symbols-outlined text-[14px]">star</span>
                {ticket.rating.toFixed(1)}
              </span>
              <span>•</span>
              <span>{ticket.busType}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="font-sora text-xl font-bold text-[#FF7A59]">
              ₹{ticket.price.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-gray-400">per seat</span>
          </div>
        </div>

        {/* Departure -> Arrival Timeline */}
        <div className="flex items-center justify-between py-4 my-2">
          <div>
            <div className="font-sora text-base font-semibold text-white">
              {ticket.departureTime}
            </div>
            <div className="text-xs text-gray-400 truncate max-w-[100px]">
              {ticket.originStation}
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center px-4">
            <span className="text-[11px] text-gray-400 font-medium mb-1">{ticket.duration}</span>
            <div className="w-full relative flex items-center">
              <div className="w-full h-0.5 bg-gradient-to-r from-[#2DD4BF] via-[#FDBA74] to-[#FF7A59]"></div>
              <div className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#FF7A59] shadow-[0_0_8px_#FF7A59]"></div>
            </div>
            <span className="text-[10px] text-[#2DD4BF] font-medium mt-1">Direct</span>
          </div>

          <div className="text-right">
            <div className="font-sora text-base font-semibold text-white">
              {ticket.arrivalTime}
            </div>
            <div className="text-xs text-gray-400 truncate max-w-[100px]">
              {ticket.destinationStation}
            </div>
          </div>
        </div>
      </div>

      {/* Perforation Tear Edge with Left & Right Cutout Notches */}
      <div className="relative flex items-center justify-between w-full h-6 overflow-hidden">
        {/* Left Cutout Circle */}
        <div className="w-6 h-6 rounded-full bg-[#0B1220] border-r border-white/10 -ml-3 z-10 shadow-inner" />

        {/* Dashed Tear Line */}
        <div className="flex-1 border-t-2 border-dashed border-white/15 mx-1" />

        {/* Right Cutout Circle */}
        <div className="w-6 h-6 rounded-full bg-[#0B1220] border-l border-white/10 -mr-3 z-10 shadow-inner" />
      </div>

      {/* Bottom Stub: Amenities & Seat Dots */}
      <div className="p-5 pt-3 flex items-center justify-between bg-black/20">
        {/* Comfort tags */}
        <div className="flex flex-wrap gap-1.5">
          {ticket.comfortTags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/5 text-[11px] text-gray-300 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Seats left as small dots */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1" title={`${ticket.seatsLeft} seats remaining`}>
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < Math.min(ticket.seatsLeft, 3)
                    ? 'bg-[#2DD4BF] shadow-[0_0_6px_#2DD4BF]'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-300 font-medium">
            {ticket.seatsLeft} left
          </span>
        </div>
      </div>

      {/* Action CTA inside stub */}
      {onSelect && (
        <div className="p-4 pt-0">
          <button
            type="button"
            onClick={() => onSelect(ticket)}
            className="w-full h-11 rounded-full bg-[#FF7A59] hover:bg-[#E06547] text-white font-sora font-semibold text-xs tracking-wide flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md"
          >
            <span>Reserve seat</span>
            <span>→</span>
          </button>
        </div>
      )}
    </article>
  );
};
