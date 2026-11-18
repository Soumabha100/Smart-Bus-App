import { useState, useEffect, useMemo, type FC } from 'react';
import type { BusTicket } from './types';
import { BusSeat, type SeatStatus } from '../../components/ui/BusSeat';
import availableSeatImg from '../../assets/General_Seat_Available.png';
import selectedSeatImg from '../../assets/General_Seat_Selected.png';
import bookedSeatImg from '../../assets/General_Seat_Booked.png';
import unavailableSeatImg from '../../assets/General_Seat_Unavailable.png';
import womenSeatImg from '../../assets/General_Seat_Women.png';

export interface SelectedSeatInfo {
  id: string;
  deck: 'lower' | 'upper';
  price: number;
  type: string;
}

interface SeatSelectionModalProps {
  isOpen: boolean;
  ticket: BusTicket;
  origin: string;
  destination: string;
  onClose: () => void;
  onConfirmBooking: (ticket: BusTicket, selectedSeats: SelectedSeatInfo[]) => void;
}

interface SeatItem {
  id: string;
  price: number;
  isBooked?: boolean;
  isUnavailable?: boolean;
  isLadies?: boolean;
}

export const SeatSelectionModal: FC<SeatSelectionModalProps> = ({
  isOpen,
  ticket,
  origin,
  destination,
  onClose,
  onConfirmBooking,
}) => {
  // Operator Info Inner Tabs
  const [activeInfoTab, setActiveInfoTab] = useState<
    'highlights' | 'cancellation' | 'reschedule' | 'boarding'
  >('highlights');

  // Selected Seats State (Default starts with 1 recommended seat: L7 matching design)
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeatInfo[]>([
    { id: 'L7', deck: 'lower', price: 300, type: 'Executive Seater' },
  ]);

  // 7-Minute Timer countdown (starts at 6m 35s matching Image 2)
  const [timeLeft, setTimeLeft] = useState(395);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Escape key listener for keyboard dismissal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const formattedTimer = useMemo(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  }, [timeLeft]);

  // Total Price calculation
  const totalFare = useMemo(() => {
    if (selectedSeats.length === 0) return 0;
    return selectedSeats.reduce((acc, curr) => acc + curr.price, 0);
  }, [selectedSeats]);

  // Lower Deck 10 Rows configuration (Executive Seater 2+1, 30 seats total: L1 to L30)
  const lowerDeckRows: { left: SeatItem; right1: SeatItem; right2: SeatItem }[] = useMemo(
    () => [
      {
        left: { id: 'L1', price: 300 },
        right1: { id: 'L2', price: 300, isBooked: true },
        right2: { id: 'L3', price: 300, isBooked: true },
      },
      {
        left: { id: 'L4', price: 300 },
        right1: { id: 'L5', price: 300 },
        right2: { id: 'L6', price: 300 },
      },
      {
        left: { id: 'L7', price: 300 },
        right1: { id: 'L8', price: 300 },
        right2: { id: 'L9', price: 300 },
      },
      {
        left: { id: 'L10', price: 300 },
        right1: { id: 'L11', price: 300 },
        right2: { id: 'L12', price: 300 },
      },
      {
        left: { id: 'L13', price: 300 },
        right1: { id: 'L14', price: 300 },
        right2: { id: 'L15', price: 300 },
      },
      {
        left: { id: 'L16', price: 300 },
        right1: { id: 'L17', price: 300 },
        right2: { id: 'L18', price: 300 },
      },
      {
        left: { id: 'L19', price: 300 },
        right1: { id: 'L20', price: 300 },
        right2: { id: 'L21', price: 300 },
      },
      {
        left: { id: 'L22', price: 300 },
        right1: { id: 'L23', price: 300 },
        right2: { id: 'L24', price: 300 },
      },
      {
        left: { id: 'L25', price: 300 },
        right1: { id: 'L26', price: 300 },
        right2: { id: 'L27', price: 300 },
      },
      {
        left: { id: 'L28', price: 300 },
        right1: { id: 'L29', price: 300 },
        right2: { id: 'L30', price: 300 },
      },
    ],
    []
  );

  // Upper Deck 8 Rows configuration (Full Capsule Sleeper 2+1, 24 berths total: U1 to U24)
  const upperDeckRows: { left: SeatItem; right1: SeatItem; right2: SeatItem }[] = useMemo(
    () => [
      {
        left: { id: 'U1', price: 460 },
        right1: { id: 'U2', price: 460, isBooked: true },
        right2: { id: 'U3', price: 460, isBooked: true },
      },
      {
        left: { id: 'U4', price: 510 },
        right1: { id: 'U5', price: 510 },
        right2: { id: 'U6', price: 510, isUnavailable: true },
      },
      {
        left: { id: 'U7', price: 510 },
        right1: { id: 'U8', price: 510 },
        right2: { id: 'U9', price: 510, isUnavailable: true },
      },
      {
        left: { id: 'U10', price: 510 },
        right1: { id: 'U11', price: 510 },
        right2: { id: 'U12', price: 510, isUnavailable: true },
      },
      {
        left: { id: 'U13', price: 510 },
        right1: { id: 'U14', price: 510 },
        right2: { id: 'U15', price: 510, isUnavailable: true },
      },
      {
        left: { id: 'U16', price: 510 },
        right1: { id: 'U17', price: 510 },
        right2: { id: 'U18', price: 510, isUnavailable: true },
      },
      {
        left: { id: 'U19', price: 510 },
        right1: { id: 'U20', price: 510 },
        right2: { id: 'U21', price: 510, isUnavailable: true },
      },
      {
        left: { id: 'U22', price: 510 },
        right1: { id: 'U23', price: 510 },
        right2: { id: 'U24', price: 510, isUnavailable: true },
      },
    ],
    []
  );

  const getSeatStatus = (
    _seatId: string,
    isSelected: boolean,
    isBooked?: boolean,
    isUnavailable?: boolean,
    isLadies?: boolean
  ): SeatStatus => {
    if (isSelected) return 'selected';
    if (isUnavailable) return 'unavailable';
    if (isBooked) return 'booked';
    if (isLadies) return 'women';
    return 'available';
  };

  const toggleSeat = (id: string, deck: 'lower' | 'upper', price: number, isBlocked?: boolean) => {
    if (isBlocked) return;
    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.id === id);
      if (exists) {
        return prev.filter((s) => s.id !== id);
      }
      if (prev.length >= 6) {
        alert('Maximum 6 seats per transaction.');
        return prev;
      }
      const type = deck === 'lower' ? 'Executive Seater' : 'Capsule Sleeper';
      return [...prev, { id, deck, price, type }];
    });
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-route-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-modal-backdrop"
    >
      {/* Click-away backdrop dismiss trigger */}
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Modal Window (Exact Minimal Clean Design matching Image 2) */}
      <div className="w-full sm:w-[96vw] max-w-[1520px] h-[94vh] max-h-[940px] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 bg-white flex flex-col overflow-hidden text-[#000D21] relative animate-modal-scale">
        {/* 1. CLEAN TOP HEADER matching Image 2 */}
        <header className="px-5 sm:px-7 py-3 sm:py-3.5 border-b border-slate-100 bg-white flex items-center justify-between gap-3 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Route & Passenger Subtitle */}
            <div>
              <h1
                id="modal-route-title"
                className="font-sans font-extrabold text-lg sm:text-2xl text-[#000D21] flex items-center gap-2 tracking-tight"
              >
                <span>{origin}</span>
                <span className="text-[#FC7728] font-bold">➔</span>
                <span>{destination}</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Wed, 18 Nov • {selectedSeats.length || 1} passenger
              </p>
            </div>
          </div>

          {/* Right Timer Badge */}
          <div className="border border-amber-200 bg-amber-50/70 text-amber-800 text-xs font-medium px-3.5 py-1.5 rounded-full flex items-center gap-1.5 font-mono shadow-xs">
            <svg className="w-3.5 h-3.5 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Locking {formattedTimer}</span>
          </div>
        </header>

        {/* 2. MINIMAL STEP NAVIGATION TABS matching Image 2 */}
        <nav
          aria-label="Booking flow steps"
          className="border-b border-slate-100 bg-white px-6 py-2.5 flex items-center justify-center shrink-0"
        >
          <ol className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
            {/* Step 1: Active */}
            <li className="flex items-center gap-1.5 pb-1 border-b-2 border-[#FC7728] text-[#000D21]">
              <span className="w-5 h-5 rounded-full bg-[#FC7728] text-white flex items-center justify-center text-[11px] font-bold shadow-xs">
                1
              </span>
              <span>Select seats</span>
            </li>
            <span className="text-slate-300 text-sm font-normal">›</span>
            {/* Step 2 */}
            <li className="flex items-center gap-1.5 pb-1 text-slate-400 font-medium">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[11px]">
                2
              </span>
              <span>Boarding &amp; dropping</span>
            </li>
            <span className="text-slate-300 text-sm font-normal">›</span>
            {/* Step 3 */}
            <li className="flex items-center gap-1.5 pb-1 text-slate-400 font-medium">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[11px]">
                3
              </span>
              <span>Passenger details</span>
            </li>
          </ol>
        </nav>

        {/* 3. MODAL UNIFIED SCROLLABLE CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FBF9F5]/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT CONTAINER: SEATS & DECKS (7 Cols) */}
            <section
              aria-label="Seat Selection Canvas"
              className="lg:col-span-7 xl:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-4"
            >
              {/* Minimal Seat Status Legend (Single Row matching Image 2) */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-medium pb-2 border-b border-slate-100">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-200/80 bg-emerald-50/40 text-[#16834A]">
                  <img src={availableSeatImg} alt="" className="w-3.5 h-3.5 object-contain" />
                  <span>Available</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-blue-200/80 bg-blue-50/40 text-[#0B4DBB]">
                  <img src={selectedSeatImg} alt="" className="w-3.5 h-3.5 object-contain" />
                  <span>Selected</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-rose-200/80 bg-rose-50/40 text-[#B94B53]">
                  <img src={bookedSeatImg} alt="" className="w-3.5 h-3.5 object-contain" />
                  <span>Booked</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50/60 text-[#64748B]">
                  <img src={unavailableSeatImg} alt="" className="w-3.5 h-3.5 object-contain" />
                  <span>Unavailable</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-pink-200/80 bg-pink-50/40 text-[#C55473]">
                  <img src={womenSeatImg} alt="" className="w-3.5 h-3.5 object-contain" />
                  <span>Women reserved</span>
                </span>
              </div>

              {/* Dual Decks Grid Side-by-Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* LOWER DECK CARD */}
                <div className="border border-slate-200 rounded-2xl p-3.5 sm:p-4 bg-white flex flex-col">
                  {/* Deck Header */}
                  <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                    <div className="min-w-0">
                      <h2 className="font-sans font-bold text-sm text-[#000D21] leading-tight">Lower deck</h2>
                      <p className="text-[11px] text-slate-500 font-normal truncate mt-0.5">
                        Executive Seater (2+1) • 10 Rows • 30 Seats
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 border border-slate-200 px-2.5 py-0.5 rounded-md text-slate-600 text-[11px] font-medium bg-slate-50/60 shrink-0">
                      <svg className="w-3.5 h-3.5 text-slate-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <circle cx="12" cy="12" r="2.5" />
                        <line x1="12" y1="3" x2="12" y2="9.5" />
                        <line x1="3.5" y1="14.5" x2="9.8" y2="13" />
                        <line x1="20.5" y1="14.5" x2="14.2" y2="13" />
                      </svg>
                      <span>Driver</span>
                    </div>
                  </div>

                  {/* 10 Rows Grid (No inner scrollbar, expands cleanly) */}
                  <div className="space-y-1.5 select-none">
                    {lowerDeckRows.map((row, rIdx) => {
                      const isLeftSelected = selectedSeats.some((s) => s.id === row.left.id);
                      const isR1Selected = selectedSeats.some((s) => s.id === row.right1.id);
                      const isR2Selected = selectedSeats.some((s) => s.id === row.right2.id);

                      return (
                        <div key={rIdx} className="flex items-center justify-between gap-1 py-0.5">
                          {/* Left Single Seat */}
                          <BusSeat
                            id={row.left.id}
                            deck="lower"
                            price={row.left.price}
                            status={getSeatStatus(
                              row.left.id,
                              isLeftSelected,
                              row.left.isBooked,
                              row.left.isUnavailable,
                              row.left.isLadies
                            )}
                            onClick={() =>
                              toggleSeat(
                                row.left.id,
                                'lower',
                                row.left.price,
                                row.left.isBooked || row.left.isUnavailable
                              )
                            }
                          />

                          {/* Minimal Aisle Text matching Image 2 */}
                          <span className="text-[9px] font-mono text-slate-300 font-semibold tracking-wider select-none">
                            AISLE
                          </span>

                          {/* Right Double Seats */}
                          <div className="flex items-center gap-1">
                            <BusSeat
                              id={row.right1.id}
                              deck="lower"
                              price={row.right1.price}
                              status={getSeatStatus(
                                row.right1.id,
                                isR1Selected,
                                row.right1.isBooked,
                                row.right1.isUnavailable,
                                row.right1.isLadies
                              )}
                              onClick={() =>
                                toggleSeat(
                                  row.right1.id,
                                  'lower',
                                  row.right1.price,
                                  row.right1.isBooked || row.right1.isUnavailable
                                )
                              }
                            />
                            <BusSeat
                              id={row.right2.id}
                              deck="lower"
                              price={row.right2.price}
                              status={getSeatStatus(
                                row.right2.id,
                                isR2Selected,
                                row.right2.isBooked,
                                row.right2.isUnavailable,
                                row.right2.isLadies
                              )}
                              onClick={() =>
                                toggleSeat(
                                  row.right2.id,
                                  'lower',
                                  row.right2.price,
                                  row.right2.isBooked || row.right2.isUnavailable
                                )
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* UPPER DECK CARD */}
                <div className="border border-slate-200 rounded-2xl p-3.5 sm:p-4 bg-white flex flex-col">
                  {/* Deck Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="min-w-0">
                      <h2 className="font-sans font-bold text-sm text-[#000D21] leading-tight">Upper deck</h2>
                      <p className="text-[11px] text-slate-500 font-normal truncate mt-0.5">
                        Full Capsule Sleeper (2+1) • 8 Rows • 24 Berths
                      </p>
                    </div>
                  </div>

                  {/* 8 Rows Grid (No inner scrollbar, expands cleanly) */}
                  <div className="space-y-1.5 select-none">
                    {upperDeckRows.map((row, rIdx) => {
                      const isLeftSelected = selectedSeats.some((s) => s.id === row.left.id);
                      const isR1Selected = selectedSeats.some((s) => s.id === row.right1.id);
                      const isR2Selected = selectedSeats.some((s) => s.id === row.right2.id);

                      return (
                        <div key={rIdx} className="flex items-center justify-between gap-1 py-0.5">
                          {/* Single Sleeper Left */}
                          <BusSeat
                            id={row.left.id}
                            deck="upper"
                            isSleeper={true}
                            price={row.left.price}
                            status={getSeatStatus(
                              row.left.id,
                              isLeftSelected,
                              row.left.isBooked,
                              row.left.isUnavailable,
                              row.left.isLadies
                            )}
                            onClick={() =>
                              toggleSeat(
                                row.left.id,
                                'upper',
                                row.left.price,
                                row.left.isBooked || row.left.isUnavailable
                              )
                            }
                          />

                          {/* Minimal Aisle Text matching Image 2 */}
                          <span className="text-[9px] font-mono text-slate-300 font-semibold tracking-wider select-none">
                            AISLE
                          </span>

                          {/* Double Sleeper Right */}
                          <div className="flex items-center gap-1">
                            <BusSeat
                              id={row.right1.id}
                              deck="upper"
                              isSleeper={true}
                              price={row.right1.price}
                              status={getSeatStatus(
                                row.right1.id,
                                isR1Selected,
                                row.right1.isBooked,
                                row.right1.isUnavailable,
                                row.right1.isLadies
                              )}
                              onClick={() =>
                                toggleSeat(
                                  row.right1.id,
                                  'upper',
                                  row.right1.price,
                                  row.right1.isBooked || row.right1.isUnavailable
                                )
                              }
                            />
                            <BusSeat
                              id={row.right2.id}
                              deck="upper"
                              isSleeper={true}
                              price={row.right2.price}
                              status={getSeatStatus(
                                row.right2.id,
                                isR2Selected,
                                row.right2.isBooked,
                                row.right2.isUnavailable,
                                row.right2.isLadies
                              )}
                              onClick={() =>
                                toggleSeat(
                                  row.right2.id,
                                  'upper',
                                  row.right2.price,
                                  row.right2.isBooked || row.right2.isUnavailable
                                )
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT CONTAINER: OPERATOR & BUS DETAILS (5 Cols) */}
            <section
              aria-label="Operator & Bus Details Panel"
              className="lg:col-span-5 xl:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Operator Title & Rating Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-sans font-extrabold text-xl text-[#000D21] tracking-tight uppercase">
                      {ticket.operator || 'GREENLINE TRAVELS'}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {ticket.busType || 'Scania AC Multi-Axle Sleeper'}
                    </p>
                  </div>

                  <div className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs shrink-0">
                    <span>★</span>
                    <span>{ticket.rating || '4.8'}</span>
                  </div>
                </div>

                {/* Clean Schedule Timeline matching Image 2 */}
                <div className="my-5 p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-sans font-extrabold text-lg text-[#000D21]">
                      {ticket.departureTime || '22:00'}
                    </div>
                    <div className="text-slate-500 font-medium text-xs mt-0.5">
                      {ticket.originStation || origin}
                    </div>
                  </div>

                  <div className="flex-1 px-4 flex flex-col items-center">
                    <span className="text-[10px] text-amber-800 font-bold bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200/50 mb-1">
                      {ticket.duration || '11h • Direct'}
                    </span>
                    <div className="w-full flex items-center text-slate-300">
                      <div className="h-[1px] bg-slate-300 flex-1" />
                      <span className="text-slate-400 mx-1 text-xs">➔</span>
                      <div className="h-[1px] bg-slate-300 flex-1" />
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-sans font-extrabold text-lg text-[#000D21]">
                      {ticket.arrivalTime || '09:00'}
                    </div>
                    <div className="text-slate-500 font-medium text-xs mt-0.5">
                      {ticket.destinationStation || destination}
                    </div>
                  </div>
                </div>

                {/* 3 Real Bus Images matching Image 2 */}
                <div className="grid grid-cols-3 gap-2.5 mb-5">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=500&q=80"
                      alt="Bus exterior"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=500&q=80"
                      alt="Bus front"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=500&q=80"
                      alt="Bus side"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Clean Tabs matching Image 2 */}
                <div className="flex items-center gap-4 border-b border-slate-200 text-xs pb-1 mb-3.5">
                  {(['highlights', 'cancellation', 'reschedule', 'boarding'] as const).map(
                    (tab) => {
                      const labels = {
                        highlights: 'Highlights',
                        cancellation: 'Cancellation',
                        reschedule: 'Reschedule',
                        boarding: 'Boarding points',
                      };
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveInfoTab(tab)}
                          className={`pb-1.5 transition-colors cursor-pointer ${
                            activeInfoTab === tab
                              ? 'font-bold text-[#000D21] border-b-2 border-[#FC7728]'
                              : 'text-slate-500 hover:text-slate-800 font-medium'
                          }`}
                        >
                          {labels[tab]}
                        </button>
                      );
                    }
                  )}
                </div>

                {/* Tab Content: Highlights (Exact 4 Cards matching Image 2) */}
                {activeInfoTab === 'highlights' && (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="border border-slate-200/90 rounded-xl p-3 flex items-center gap-2.5 bg-white shadow-2xs">
                      <span className="text-base">🚌</span>
                      <span className="text-xs font-semibold text-[#000D21]">Premium AC bus</span>
                    </div>
                    <div className="border border-slate-200/90 rounded-xl p-3 flex items-center gap-2.5 bg-white shadow-2xs">
                      <span className="text-base text-amber-500">🍽️</span>
                      <span className="text-xs font-semibold text-[#000D21]">
                        Complimentary breakfast
                      </span>
                    </div>
                    <div className="border border-slate-200/90 rounded-xl p-3 flex items-center gap-2.5 bg-white shadow-2xs">
                      <span className="text-base text-sky-600">🚻</span>
                      <span className="text-xs font-semibold text-[#000D21]">Onboard washroom</span>
                    </div>
                    <div className="border border-slate-200/90 rounded-xl p-3 flex items-center gap-2.5 bg-white shadow-2xs">
                      <span className="text-base text-pink-500">👩</span>
                      <span className="text-xs font-semibold text-[#000D21]">Women-friendly</span>
                    </div>
                  </div>
                )}

                {activeInfoTab === 'cancellation' && (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 text-slate-600">
                    <div className="flex justify-between font-medium">
                      <span>Up to 6 hours before departure:</span>
                      <strong className="text-emerald-700">100% Refund</strong>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Between 2 and 6 hours:</span>
                      <strong className="text-amber-700">50% Refund</strong>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Under 2 hours:</span>
                      <strong className="text-rose-700">Non-refundable</strong>
                    </div>
                  </div>
                )}

                {activeInfoTab === 'reschedule' && (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed">
                    1 free reschedule permitted up to 4 hours before the departure time without any penalty fee.
                  </div>
                )}

                {activeInfoTab === 'boarding' && (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-2 text-slate-600">
                    <div className="flex items-center gap-2">
                      <strong className="text-[#000D21]">Esplanade Stand D:</strong>
                      <span>20:30 (Main Bay)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong className="text-[#000D21]">Babughat Bus Stand:</strong>
                      <span>21:15</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <strong className="text-[#000D21]">Airport Gate 1:</strong>
                      <span>22:00</span>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* 4. CLEAN STICKY BOTTOM BAR matching Image 2 */}
        <footer className="px-6 py-3.5 sm:py-4 border-t border-slate-200 bg-white flex items-center justify-between sticky bottom-0 z-30 shrink-0">
          {/* Left: Selected seat summary text matching Image 2 */}
          <div className="text-sm font-bold text-[#000D21]">
            {selectedSeats.length > 0 ? (
              <span>
                {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected{' '}
                <span className="text-slate-400 font-normal mx-1">•</span>{' '}
                <span className="text-slate-600 font-medium">
                  {selectedSeats.map((s) => s.id).join(', ')}
                </span>
              </span>
            ) : (
              <span className="text-slate-400 font-normal">0 seats selected</span>
            )}
          </div>

          {/* Right: Total Fare & Action CTA matching Image 2 */}
          <div className="flex items-center gap-5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-slate-500 font-medium">Total</span>
              <span className="font-sans font-extrabold text-2xl text-[#000D21]">
                ₹{totalFare}
              </span>
            </div>

            <button
              type="button"
              disabled={selectedSeats.length === 0}
              onClick={() => onConfirmBooking(ticket, selectedSeats)}
              className={`font-sans font-bold px-6 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-all text-sm cursor-pointer ${
                selectedSeats.length > 0
                  ? 'bg-[#FC7728] hover:bg-[#EA580C] text-white active:scale-98'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>Continue to boarding</span>
              <span>➔</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
