import { useState, useEffect, type FC } from 'react';
import type { BusTicket } from './types';

interface SeatHoldModalProps {
  ticket: BusTicket;
  seatId: string;
  origin: string;
  destination: string;
  onClose: () => void;
  onConfirmed: () => void;
}

export const SeatHoldModal: FC<SeatHoldModalProps> = ({
  ticket,
  seatId,
  origin,
  destination,
  onClose,
  onConfirmed,
}) => {
  const [timeLeft, setTimeLeft] = useState(420); // 7 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 relative border border-[#E5E1D8] shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F6F4EE] flex items-center justify-center text-[#64748B] hover:text-[#0B2341] transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* 7-Min Hold Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
            <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
              OneGoHold™ Active
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-mono font-bold">
            <span className="material-symbols-outlined text-[15px]">timer</span>
            <span>{formattedTime}</span>
          </div>
        </div>

        <h3 className="font-sans text-xl font-extrabold text-[#0B2341] mb-1">
          {ticket.operator}
        </h3>
        <p className="text-xs text-[#64748B] mb-4">
          {ticket.busType} • {ticket.departureTime} Departure
        </p>

        {/* Details Box */}
        <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E5E1D8] mb-5 flex flex-col gap-2.5 text-xs">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Route:</span>
            <span className="text-[#0B2341] font-bold">
              {origin} ⟿ {destination}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Assigned Berth:</span>
            <span className="text-[#A04100] font-extrabold">
              Berth {seatId} (Single Window)
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Boarding Station:</span>
            <span className="text-[#0B2341] font-medium">{ticket.originStation}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#E5E1D8]">
            <span className="text-[#64748B]">Total Seat Fare:</span>
            <span className="font-sans text-base font-extrabold text-[#A04100]">
              ₹{ticket.price.toLocaleString('en-IN')}{' '}
              <span className="text-[11px] text-[#64748B] font-normal">(all taxes incl.)</span>
            </span>
          </div>
        </div>

        <p className="text-[11px] text-[#64748B] leading-relaxed mb-6">
          In accordance with <strong>West Bengal Smart Bus booking rules</strong>,
          your seat is held exclusively for 7 minutes without price spikes while you finalize your booking.
        </p>

        <button
          type="button"
          onClick={onConfirmed}
          className="w-full h-12 rounded-full bg-[#FC7728] hover:bg-[#E06547] text-white font-sans font-bold text-sm shadow-[0_6px_20px_rgba(252,119,40,0.35)] transition-all cursor-pointer active:scale-98"
        >
          Confirm Seat Pass (₹{ticket.price})
        </button>
      </div>
    </div>
  );
};
