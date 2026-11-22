import { useState, type FC } from 'react';
import type { BusTicket } from './types';
import { BusSeat, SeatArmchairIcon } from '../../components/ui/BusSeat';

interface TicketCardProps {
  ticket: BusTicket;
  onViewSeats: (ticket: BusTicket) => void;
  onContinueBooking?: (ticket: BusTicket, seatId: string) => void;
}

interface DeckRow {
  left: string[];
  right: string;
  booked: string[];
  ladies: string[];
}

export const TicketCard: FC<TicketCardProps> = ({ ticket, onViewSeats, onContinueBooking }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<string>('');

  // Lower Deck Seat Config (Simulating realistic 2+1 layout)
  const lowerDeckRows: DeckRow[] = [
    { left: ['L1', 'L2'], right: 'L3', booked: ['L3'], ladies: [] },
    { left: ['L4', 'L5'], right: 'L6', booked: [], ladies: ['L4', 'L5'] },
    { left: ['L7', 'L8'], right: 'L9', booked: ['L8'], ladies: [] },
  ];

  // Upper Deck Seat Config
  const upperDeckRows: DeckRow[] = [
    { left: ['U1', 'U2'], right: 'U3', booked: ['U1'], ladies: [] },
    { left: ['U4', 'U5'], right: 'U6', booked: ['U5'], ladies: [] },
    { left: ['U7', 'U8'], right: 'U9', booked: [], ladies: [] },
  ];

  const handleSeatClick = (seat: string, isBooked: boolean) => {
    if (isBooked) return;
    setSelectedSeat((prev) => (prev === seat ? '' : seat));
  };

  return (
    <article className="ticket-card rounded-2xl shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-12 relative">
        {/* Perforation Top & Bottom Notches at MD stub boundary */}
        <div className="hidden md:block ticket-notch-top left-[calc(72%-10px)]" />
        <div className="hidden md:block ticket-notch-bottom left-[calc(72%-10px)]" />

        {/* Left Main Ticket Body (~72% / 8.5 cols) */}
        <div className="md:col-span-8 lg:col-span-8.5 p-5 sm:p-6 space-y-4">
          {/* Header Details */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-sans text-xl font-extrabold text-[#0B2341]">
                  {ticket.operator}
                </h3>
                {ticket.tag && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200/70">
                    <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                    <span>{ticket.tag}</span>
                  </span>
                )}
                {ticket.subtag && (
                  <span className="px-2 py-0.5 rounded-full bg-[#F6F4EE] text-[#64748B] text-[11px] font-semibold border border-[#E5E1D8]">
                    {ticket.subtag}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">{ticket.busType}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FBF9F5] border border-[#E5E1D8]">
              <span className="material-symbols-outlined text-[16px] text-[#FC7728]">star</span>
              <span className="text-xs font-extrabold text-[#0B2341]">{ticket.rating}</span>
              <span className="text-[11px] text-[#64748B]">({ticket.reviewsCount})</span>
            </div>
          </div>

          {/* Journey Schedule Grid */}
          <div className="bg-[#FBF9F5] rounded-xl p-4 border border-[#E5E1D8]/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Departure */}
            <div className="sm:col-span-4">
              <span className="font-sans text-2xl font-extrabold text-[#0B2341] block">
                {ticket.departureTime}
              </span>
              <span className="text-xs font-bold text-[#0B2341]">{ticket.originStation}</span>
              <span className="text-[11px] text-[#64748B] block">{ticket.originDetails}</span>
            </div>

            {/* Travel Corridor Line */}
            <div className="sm:col-span-4 text-center px-2">
              <span className="text-[11px] font-extrabold text-teal-700">{ticket.duration}</span>
              <div className="flex items-center gap-2 my-1">
                <span className="w-2 h-2 rounded-full bg-[#FC7728]" />
                <div className="h-0.5 bg-[#E5E1D8] flex-1 relative">
                  <span className="material-symbols-outlined text-[14px] text-[#FC7728] absolute -top-1.5 left-1/2 -translate-x-1/2">
                    directions_bus
                  </span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#0B2341]" />
              </div>
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                {ticket.onTimeRate}
              </span>
            </div>

            {/* Arrival */}
            <div className="sm:col-span-4 sm:text-right">
              <span className="font-sans text-2xl font-extrabold text-[#0B2341] block">
                {ticket.arrivalTime}
              </span>
              <span className="text-xs font-bold text-[#0B2341]">{ticket.destinationStation}</span>
              <span className="text-[11px] text-[#64748B] block">{ticket.destinationDetails}</span>
            </div>
          </div>

          {/* Amenities Tags */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] pt-1">
            {ticket.amenities.map((amenity) => (
              <span key={amenity} className="inline-flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[15px] text-teal-700">
                  {amenity.includes('WiFi')
                    ? 'wifi'
                    : amenity.includes('Blanket')
                    ? 'bed'
                    : amenity.includes('Water')
                    ? 'local_drink'
                    : amenity.includes('GPS')
                    ? 'near_me'
                    : 'power'}
                </span>
                <span>{amenity}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right Ticket Stub (~28% / 3.5 cols) */}
        <div className="md:col-span-4 lg:col-span-3.5 p-5 sm:p-6 bg-[#FBF9F5] md:border-l md:border-dashed md:border-[#E5E1D8] flex flex-col justify-between items-end border-t md:border-t-0">
          <div className="w-full text-right space-y-1">
            <div className="inline-block">
              {ticket.originalPrice && (
                <span className="text-xs text-[#64748B] line-through mr-1.5 font-medium">
                  ₹{ticket.originalPrice}
                </span>
              )}
              <span className="font-sans text-3xl font-extrabold text-[#0B2341]">
                ₹{ticket.price}
              </span>
            </div>

            {ticket.originalPrice && (
              <div className="flex items-center justify-end gap-1.5 text-xs">
                <span className="font-bold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                  Save ₹{ticket.originalPrice - ticket.price}
                </span>
              </div>
            )}

            <span className="text-[11px] font-bold text-[#FC7728] block pt-1">
              ⚡ {ticket.seatsLeft} seats left
            </span>
          </div>

          <div className="w-full pt-4 space-y-1.5">
            <button
              type="button"
              onClick={() => onViewSeats(ticket)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 bg-[#0B2341] text-white hover:bg-[#000D21] active:scale-98 cursor-pointer"
            >
              <span>View Seats</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="w-full py-1 text-[11px] font-semibold text-[#64748B] hover:text-[#0B2341] transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>{isExpanded ? 'Hide inline preview' : 'Quick berth preview'}</span>
              <span className="material-symbols-outlined text-[14px]">
                {isExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Inline Expanded Seat Selection Drawer */}
      {isExpanded && (
        <div className="border-t border-[#E5E1D8] bg-[#F6F4EE]/50 p-5 sm:p-6 space-y-5 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="font-sans font-bold text-base text-[#0B2341]">Select Your Sleeper Berth</h4>
              <p className="text-xs text-[#64748B]">Click on an available berth to reserve. Maximum 4 berths per booking.</p>
            </div>

            {/* Seat Color Legend */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#DDF6DD] border border-[#A8DDAA] text-[#276749]">
                <SeatArmchairIcon className="w-3.5 h-3.5 text-[#276749]" />
                <span>Available</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FC7728] border border-[#E6651D] text-white">
                <SeatArmchairIcon className="w-3.5 h-3.5 text-white" />
                <span>Selected</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F8D1DF] border border-[#EFA9BF] text-[#934C67]">
                <SeatArmchairIcon className="w-3.5 h-3.5 text-[#934C67]" />
                <span>Women Reserved</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#E4E1E5] border border-[#C6C2C9] text-[#77747D]">
                <SeatArmchairIcon className="w-3.5 h-3.5 text-[#77747D]" />
                <span>Booked</span>
              </span>
            </div>
          </div>

          {/* Seat Grid: Lower Deck & Upper Deck */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-5 rounded-xl border border-[#E5E1D8]">
            {/* Lower Deck */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#E5E1D8] pb-2">
                <span className="text-xs font-extrabold uppercase text-[#0B2341] tracking-wide">
                  Lower Deck (Berths L1-L9)
                </span>
                <div className="flex items-center gap-1 text-[11px] text-[#64748B] font-medium">
                  <span className="material-symbols-outlined text-[16px]">airline_seat_recline_extra</span>
                  <span>Driver End</span>
                </div>
              </div>

              <div className="space-y-2">
                {lowerDeckRows.map((row, rIdx) => (
                  <div key={rIdx} className="flex items-center justify-between gap-2">
                    <div className="flex gap-2">
                      {row.left.map((seat) => {
                        const isBooked = row.booked.includes(seat);
                        const isLadies = row.ladies.includes(seat);
                        const isSelected = selectedSeat === seat;
                        const status = isSelected ? 'selected' : isBooked ? 'booked' : isLadies ? 'women' : 'available';
                        return (
                          <BusSeat
                            key={seat}
                            id={seat}
                            deck="lower"
                            status={status}
                            showPrice={false}
                            size="sm"
                            onClick={() => handleSeatClick(seat, isBooked)}
                          />
                        );
                      })}
                    </div>
                    <span className="text-[10px] font-mono text-[#94A3B8] tracking-wider">AISLE</span>
                    {(() => {
                      const seat = row.right;
                      const isBooked = row.booked.includes(seat);
                      const isSelected = selectedSeat === seat;
                      const status = isSelected ? 'selected' : isBooked ? 'booked' : 'available';
                      return (
                        <BusSeat
                          key={seat}
                          id={seat}
                          deck="lower"
                          status={status}
                          showPrice={false}
                          size="sm"
                          onClick={() => handleSeatClick(seat, isBooked)}
                        />
                      );
                    })()}
                  </div>
                ))}
              </div>
            </div>

            {/* Upper Deck */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#E5E1D8] pb-2">
                <span className="text-xs font-extrabold uppercase text-[#0B2341] tracking-wide">
                  Upper Deck (Berths U1-U9)
                </span>
                <span className="text-[11px] text-[#64748B] font-medium">Panoramic Windows</span>
              </div>

              <div className="space-y-2">
                {upperDeckRows.map((row, rIdx) => (
                  <div key={rIdx} className="flex items-center justify-between gap-2">
                    <div className="flex gap-2">
                      {row.left.map((seat) => {
                        const isBooked = row.booked.includes(seat);
                        const isSelected = selectedSeat === seat;
                        const status = isSelected ? 'selected' : isBooked ? 'booked' : 'available';
                        return (
                          <BusSeat
                            key={seat}
                            id={seat}
                            deck="upper"
                            isSleeper={true}
                            status={status}
                            showPrice={false}
                            size="sm"
                            onClick={() => handleSeatClick(seat, isBooked)}
                          />
                        );
                      })}
                    </div>
                    <span className="text-[10px] font-mono text-[#94A3B8] tracking-wider">AISLE</span>
                    {(() => {
                      const seat = row.right;
                      const isBooked = row.booked.includes(seat);
                      const isSelected = selectedSeat === seat;
                      const status = isSelected ? 'selected' : isBooked ? 'booked' : 'available';
                      return (
                        <BusSeat
                          key={seat}
                          id={seat}
                          deck="upper"
                          isSleeper={true}
                          status={status}
                          showPrice={false}
                          size="sm"
                          onClick={() => handleSeatClick(seat, isBooked)}
                        />
                      );
                    })()}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Berth Checkout Summary Strip */}
          <div className="bg-white p-4 rounded-xl border border-[#E5E1D8] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-orange-100 border border-[#FC7728]/40 text-[#FC7728] font-sans font-extrabold flex items-center justify-center text-lg shadow-xs">
                {selectedSeat || '—'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#0B2341]">
                    {selectedSeat
                      ? `Single Window Berth (${selectedSeat})`
                      : 'Please select an available berth'}
                  </span>
                  {selectedSeat && (
                    <span className="px-2 py-0.2 rounded-full bg-teal-50 text-teal-800 font-extrabold text-[10px] border border-teal-200">
                      NO SHARING
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#64748B]">
                  Boarding: {ticket.originStation} ➔ Dropping: {ticket.destinationStation}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[11px] text-[#64748B] font-medium">Total Payable</span>
                <div className="font-sans text-xl font-extrabold text-[#0B2341]">
                  ₹{ticket.price}{' '}
                  <span className="text-xs text-[#64748B] font-normal">(all taxes incl.)</span>
                </div>
              </div>

              <button
                type="button"
                disabled={!selectedSeat}
                onClick={() => onContinueBooking?.(ticket, selectedSeat)}
                className={`px-6 py-3 rounded-full font-bold text-sm transition-all shadow-md cursor-pointer ${
                  selectedSeat
                    ? 'bg-[#FC7728] text-white hover:bg-[#E06547] shadow-[#FC7728]/20 active:scale-98'
                    : 'bg-[#EFEEEA] text-[#94A3B8] cursor-not-allowed'
                }`}
              >
                Continue Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
