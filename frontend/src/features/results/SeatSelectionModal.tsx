import { useState, useEffect, useMemo, useCallback, type FC } from 'react';
import {
  CalendarDays,
  Clock3,
  Armchair,
  BedSingle,
  IndianRupee,
  ArrowRight,
  X,
  Tag,
  ChevronRight,
  Check,
} from 'lucide-react';
import type { BusTicket } from './types';
import { BusSeat, type SeatStatus } from '../../components/ui/BusSeat';
import onegoLuxuryCoachImg from '../../assets/onego-luxury-coach.png';
import howrahBridgeImg from '../../assets/howrah-bridge-sunrise.jpg';

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

interface SeatLayoutItem {
  id: string;
  defaultStatus: SeatStatus;
}

interface RowLayout {
  rowNum: number;
  left1: SeatLayoutItem;
  left2: SeatLayoutItem;
  right1: SeatLayoutItem;
  right2: SeatLayoutItem;
}

/**
 * Authentic 3-Spoke Bus Driver Steering Wheel SVG Icon.
 * Consistent automotive stroke matching the Lucide icon family.
 */
const DriverSteeringWheelIcon: FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="2.5" />
    <line x1="3" y1="12" x2="9.5" y2="12" />
    <line x1="14.5" y1="12" x2="21" y2="12" />
    <line x1="12" y1="14.5" x2="12" y2="21" />
  </svg>
);

export const SeatSelectionModal: FC<SeatSelectionModalProps> = ({
  isOpen,
  ticket,
  origin,
  destination,
  onClose,
  onConfirmBooking,
}) => {
  // Deck Switcher: Lower Deck vs Upper Deck
  const [activeDeck, setActiveDeck] = useState<'lower' | 'upper'>('lower');

  // Closing animation state for buttery smooth ease-out exit
  const [isClosing, setIsClosing] = useState(false);

  // Dynamic pricing based on search result card (ticket.price)
  const basePrice = ticket.price || 749;
  const isSleeperBus = ticket.busType?.toLowerCase().includes('sleeper') ?? true;
  const sleeperPrice = isSleeperBus ? basePrice : Math.round(basePrice * 1.15);

  // Selected Seats State (Default starts with L2 and L3 in Row 2)
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(['L2', 'L3']);

  // Purely derived selected seats array with dynamic price and type
  const selectedSeats: SelectedSeatInfo[] = useMemo(() => {
    return selectedSeatIds.map((id) => {
      const isUpper = id.startsWith('U');
      return {
        id,
        deck: isUpper ? 'upper' : 'lower',
        price: isUpper ? sleeperPrice : basePrice,
        type: isUpper ? 'Capsule Sleeper' : 'Executive Seater',
      };
    });
  }, [selectedSeatIds, basePrice, sleeperPrice]);

  // Trigger smooth closing transition before unmounting
  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  }, [isClosing, onClose]);

  // Escape key listener with smooth closing animation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Lock body scroll when modal is open to completely prevent background page scrolling
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  /**
   * Lower Deck: Exactly 9 rows × 4 columns = 36 Seats total.
   */
  const lowerDeckRows: RowLayout[] = useMemo(
    () => [
      {
        rowNum: 1,
        left1: { id: 'L1', defaultStatus: 'available' },
        left2: { id: 'L_B1', defaultStatus: 'booked' },
        right1: { id: 'L_B2', defaultStatus: 'booked' },
        right2: { id: 'L_W1', defaultStatus: 'women' },
      },
      {
        rowNum: 2,
        left1: { id: 'L2', defaultStatus: 'available' }, // Selected
        left2: { id: 'L3', defaultStatus: 'available' }, // Selected
        right1: { id: 'L_W2', defaultStatus: 'women' },
        right2: { id: 'L_B3', defaultStatus: 'booked' },
      },
      {
        rowNum: 3,
        left1: { id: 'L4', defaultStatus: 'available' },
        left2: { id: 'L5', defaultStatus: 'available' },
        right1: { id: 'L6', defaultStatus: 'available' },
        right2: { id: 'L7', defaultStatus: 'available' },
      },
      {
        rowNum: 4,
        left1: { id: 'L8', defaultStatus: 'booked' },
        left2: { id: 'L9', defaultStatus: 'available' },
        right1: { id: 'L10', defaultStatus: 'available' },
        right2: { id: 'L11', defaultStatus: 'available' },
      },
      {
        rowNum: 5,
        left1: { id: 'L12', defaultStatus: 'available' },
        left2: { id: 'L_W3', defaultStatus: 'women' },
        right1: { id: 'L_W4', defaultStatus: 'women' },
        right2: { id: 'L13', defaultStatus: 'available' },
      },
      {
        rowNum: 6,
        left1: { id: 'L14', defaultStatus: 'available' },
        left2: { id: 'L15', defaultStatus: 'available' },
        right1: { id: 'L16', defaultStatus: 'available' },
        right2: { id: 'L_B4', defaultStatus: 'booked' },
      },
      {
        rowNum: 7,
        left1: { id: 'L17', defaultStatus: 'available' },
        left2: { id: 'L18', defaultStatus: 'available' },
        right1: { id: 'L19', defaultStatus: 'available' },
        right2: { id: 'L20', defaultStatus: 'available' },
      },
      {
        rowNum: 8,
        left1: { id: 'L21', defaultStatus: 'available' },
        left2: { id: 'L_B5', defaultStatus: 'booked' },
        right1: { id: 'L22', defaultStatus: 'available' },
        right2: { id: 'L23', defaultStatus: 'available' },
      },
      {
        rowNum: 9,
        left1: { id: 'L24', defaultStatus: 'available' },
        left2: { id: 'L25', defaultStatus: 'available' },
        right1: { id: 'L_W5', defaultStatus: 'women' },
        right2: { id: 'L26', defaultStatus: 'available' },
      },
    ],
    []
  );

  /**
   * Upper Deck: 9 rows of panoramic sleeper berths / seats (U1 to U36).
   */
  const upperDeckRows: RowLayout[] = useMemo(
    () => [
      {
        rowNum: 1,
        left1: { id: 'U1', defaultStatus: 'available' },
        left2: { id: 'U2', defaultStatus: 'available' },
        right1: { id: 'U_B1', defaultStatus: 'booked' },
        right2: { id: 'U_B2', defaultStatus: 'booked' },
      },
      {
        rowNum: 2,
        left1: { id: 'U3', defaultStatus: 'available' },
        left2: { id: 'U4', defaultStatus: 'available' },
        right1: { id: 'U_W1', defaultStatus: 'women' },
        right2: { id: 'U_W2', defaultStatus: 'women' },
      },
      {
        rowNum: 3,
        left1: { id: 'U5', defaultStatus: 'available' },
        left2: { id: 'U6', defaultStatus: 'available' },
        right1: { id: 'U7', defaultStatus: 'available' },
        right2: { id: 'U8', defaultStatus: 'available' },
      },
      {
        rowNum: 4,
        left1: { id: 'U9', defaultStatus: 'available' },
        left2: { id: 'U_B3', defaultStatus: 'booked' },
        right1: { id: 'U10', defaultStatus: 'available' },
        right2: { id: 'U11', defaultStatus: 'available' },
      },
      {
        rowNum: 5,
        left1: { id: 'U_W3', defaultStatus: 'women' },
        left2: { id: 'U12', defaultStatus: 'available' },
        right1: { id: 'U13', defaultStatus: 'available' },
        right2: { id: 'U_B4', defaultStatus: 'booked' },
      },
      {
        rowNum: 6,
        left1: { id: 'U14', defaultStatus: 'available' },
        left2: { id: 'U15', defaultStatus: 'available' },
        right1: { id: 'U16', defaultStatus: 'available' },
        right2: { id: 'U17', defaultStatus: 'available' },
      },
      {
        rowNum: 7,
        left1: { id: 'U18', defaultStatus: 'available' },
        left2: { id: 'U19', defaultStatus: 'available' },
        right1: { id: 'U_B5', defaultStatus: 'booked' },
        right2: { id: 'U20', defaultStatus: 'available' },
      },
      {
        rowNum: 8,
        left1: { id: 'U21', defaultStatus: 'available' },
        left2: { id: 'U_W4', defaultStatus: 'women' },
        right1: { id: 'U22', defaultStatus: 'available' },
        right2: { id: 'U23', defaultStatus: 'available' },
      },
      {
        rowNum: 9,
        left1: { id: 'U24', defaultStatus: 'available' },
        left2: { id: 'U25', defaultStatus: 'available' },
        right1: { id: 'U26', defaultStatus: 'available' },
        right2: { id: 'U_B6', defaultStatus: 'booked' },
      },
    ],
    []
  );

  const activeRows = activeDeck === 'lower' ? lowerDeckRows : upperDeckRows;

  // Toggle seat selection
  const handleSeatToggle = (seatId: string, isBlocked?: boolean) => {
    if (isBlocked) return;
    setSelectedSeatIds((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      }
      if (prev.length >= 6) {
        alert('Maximum 6 seats per booking.');
        return prev;
      }
      return [...prev, seatId];
    });
  };

  // Compute dynamic total price
  const totalFare = useMemo(() => {
    return selectedSeats.reduce((acc, curr) => acc + curr.price, 0);
  }, [selectedSeats]);

  // Compute higher strikethrough price and dynamic savings
  const originalTotalFare = useMemo(() => {
    if (totalFare === 0) return 0;
    const discountMultiplier =
      ticket.originalPrice && ticket.price
        ? ticket.originalPrice / ticket.price
        : 1.25;
    return Math.round(totalFare * discountMultiplier);
  }, [totalFare, ticket.originalPrice, ticket.price]);

  const totalSavings = useMemo(() => {
    return Math.max(0, originalTotalFare - totalFare);
  }, [originalTotalFare, totalFare]);

  // Selected seats display text
  const selectedSeatsDisplay = useMemo(() => {
    if (selectedSeats.length === 0) return 'Select seats';
    return selectedSeats.map((s) => s.id).join(', ');
  }, [selectedSeats]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="seat-booking-modal-title"
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-[#000D21]/50 backdrop-blur-md overflow-y-auto ${
        isClosing ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop-in'
      }`}
    >
      {/* Click-away backdrop trigger with smooth closing */}
      <div
        className="fixed inset-0 -z-10"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Main Glassmorphic Modal Window with Smooth Scaling Transition */}
      <div
        className={`relative w-full max-w-[1360px] max-h-[92vh] rounded-[30px] border border-white/80 shadow-[0_24px_70px_rgba(11,35,65,0.16)] flex flex-col overflow-hidden text-[#000D21] select-none ${
          isClosing ? 'animate-modal-scale-out' : 'animate-modal-scale-in'
        }`}
        style={{
          background:
            'linear-gradient(135deg, rgba(255, 248, 241, 0.94) 0%, rgba(255, 242, 235, 0.86) 45%, rgba(254, 246, 242, 0.92) 100%)',
          backdropFilter: 'blur(28px) saturate(160%)',
          WebkitBackdropFilter: 'blur(28px) saturate(160%)',
        }}
      >
        {/* Overall Modal Ambient Howrah Bridge Warm Tint Layer */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10">
          <img
            src={howrahBridgeImg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-top scale-110"
            style={{
              filter: 'blur(16px)',
              opacity: 0.14,
            }}
          />
        </div>

        {/* Soft atmospheric diffused ambient colour glow regions */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#DDF6DD]/30 blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-[#FFF8F1]/40 blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#FFDAD2]/35 blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* TOP HEADER */}
        <header className="px-6 py-3.5 flex items-center justify-between border-b border-white/60 bg-white/45 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            {/* OneGoBus Brand Identity */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0B2341] to-[#1E3A5F] flex items-center justify-center text-white shadow-xs">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-[#FC7728]"
                  aria-hidden="true"
                >
                  <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" />
                  <path d="M4 11h16" />
                  <circle cx="8.5" cy="18.5" r="1.5" />
                  <circle cx="15.5" cy="18.5" r="1.5" />
                </svg>
              </div>
              <span className="text-xl font-black tracking-tight text-[#0B2341]">
                One Go <span className="text-[#FC7728]">Bus</span>
              </span>
            </div>

            <span className="text-slate-300 mx-1 select-none text-lg font-light">|</span>

            {/* Pill: Choose your seats */}
            <span
              id="seat-booking-modal-title"
              className="px-3.5 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-xs font-semibold text-[#0B2341] shadow-xs"
            >
              Choose your seats
            </span>
          </div>

          {/* Interactive Red Close Button with Smooth In-and-Out Animation & 90deg Rotation */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close seat selection modal"
            className="group/close relative w-9 h-9 rounded-full bg-white/80 hover:bg-rose-500 text-slate-500 hover:text-white border border-white/90 hover:border-rose-500 shadow-xs hover:shadow-md hover:shadow-rose-500/25 flex items-center justify-center transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 cursor-pointer"
          >
            <X
              className="w-4 h-4 transition-transform duration-200 ease-in-out group-hover/close:rotate-90"
              strokeWidth={2.5}
            />
          </button>
        </header>

        {/* 3-COLUMN CONTENT BODY */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
            {/* COLUMN 1: LEFT SIDE (Cohesive Integrated Composition: Howrah Bridge + Bus + Journey Details) */}
            <div className="lg:col-span-5 flex flex-col space-y-4">
              {/* Cohesive Atmospheric Bus & Howrah Bridge Visual Showcase */}
              <div className="relative rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-end min-h-[220px] sm:min-h-[250px] overflow-hidden">
                {/* Howrah Bridge Sunrise Photo Background Layer with blur(2px) and opacity: 0.45 */}
                <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
                  <img
                    src={howrahBridgeImg}
                    alt="Howrah Bridge Kolkata"
                    className="w-full h-full object-cover object-center scale-105"
                    style={{
                      filter: 'blur(2px)',
                      opacity: 0.45,
                    }}
                  />
                  {/* Gentle warm cream gradient fade near the bottom */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#FFF8F1] via-[#FFF8F1]/20 to-transparent pointer-events-none"
                    aria-hidden="true"
                  />
                </div>

                {/* Transparent Luxury Volvo Coach Bus (Prominent, ~92% width, 100% crisp & unblurred) */}
                <img
                  src={onegoLuxuryCoachImg}
                  alt="One Go Bus Luxury Coach"
                  className="relative z-10 w-[92%] max-w-[440px] object-contain drop-shadow-[0_14px_28px_rgba(11,35,65,0.20)] select-none pointer-events-none"
                  draggable={false}
                />

                {/* Gentle ground shadow beneath coach wheels */}
                <div className="relative z-10 w-[84%] h-2.5 bg-black/15 blur-sm rounded-full -mt-1 mx-auto" />
              </div>

              {/* Journey Details Glass Card (Positioned directly below bus with natural gap) */}
              <div className="rounded-2xl bg-white/60 backdrop-blur-md p-4 sm:p-5 border border-white/80 shadow-[0_8px_24px_rgba(11,35,65,0.05)] space-y-3.5">
                {/* Route Title with Orange Arrow */}
                <h3 className="text-xl sm:text-2xl font-black text-[#0B2341] tracking-tight flex items-center gap-2">
                  <span>{origin || 'Kolkata'}</span>
                  <span className="text-[#FC7728] text-lg font-bold">➔</span>
                  <span>{destination || 'Siliguri'}</span>
                </h3>

                {/* Route Meta Row with Lucide Icons */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-[#FC7728]" strokeWidth={2} />
                    <span>Friday, 20 Nov</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock3 className="w-3.5 h-3.5 text-[#FC7728]" strokeWidth={2} />
                    <span>
                      {ticket.departureTime || '21:15'} – {ticket.arrivalTime || '08:00'}
                    </span>
                  </div>
                </div>

                {/* Bus Features Pill Row with Armchair & Seat Count */}
                <div className="flex flex-wrap items-center gap-3 pt-2.5 border-t border-slate-200/60 text-xs font-medium text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Armchair className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
                    <span>
                      {ticket.operator ? `${ticket.operator} • ` : ''}
                      {ticket.busType || 'Scania AC Multi-Axle Sleeper'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="font-semibold text-slate-700">36 Seats</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 2: CENTER COLUMN (Deck Switcher + Bus Cabin Layout + Legend) */}
            <div className="lg:col-span-4 flex flex-col items-center space-y-3">
              {/* Top Deck Switcher & Floating Availability Pill */}
              <div className="w-full flex flex-wrap items-center justify-between gap-2 px-1">
                {/* Segmented Pill Deck Switcher (Labels strictly on one line: whitespace-nowrap) */}
                <div className="inline-flex p-1 rounded-full bg-white/75 backdrop-blur-md border border-white/90 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setActiveDeck('lower')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      activeDeck === 'lower'
                        ? 'bg-[#FC7728] text-white shadow-xs'
                        : 'text-[#0B2341] hover:text-black font-semibold'
                    }`}
                  >
                    <Armchair className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>Lower Deck</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveDeck('upper')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      activeDeck === 'upper'
                        ? 'bg-[#FC7728] text-white shadow-xs'
                        : 'text-[#0B2341] hover:text-black font-semibold'
                    }`}
                  >
                    <BedSingle className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>Upper Deck</span>
                  </button>
                </div>

                {/* Floating Availability Pill (Does not squeeze the deck control) */}
                <button
                  type="button"
                  onClick={() => setActiveDeck(activeDeck === 'lower' ? 'upper' : 'lower')}
                  className="px-2.5 py-1.5 rounded-full bg-[#ECFDF5]/90 backdrop-blur-sm border border-[#A7F3D0] text-[#065F46] text-[11px] font-semibold shadow-xs flex items-center gap-1 hover:bg-[#D1FAE5] transition-colors whitespace-nowrap cursor-pointer"
                  title="Switch Deck"
                >
                  <BedSingle className="w-3.5 h-3.5 text-[#059669]" strokeWidth={2} />
                  <span>
                    {activeDeck === 'lower'
                      ? 'Upper Deck 18 Seats Available'
                      : 'Lower Deck 20 Seats Available'}
                  </span>
                  <ChevronRight className="w-3 h-3 text-[#059669]" strokeWidth={2.5} />
                </button>
              </div>

              {/* Vertical Bus Cabin Chassis Container */}
              <div className="w-full max-w-[340px] bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE9] to-[#ECE6DF] rounded-[34px] border-2 border-[#E2DDD6] p-4 pt-3 pb-4 shadow-sm relative">
                {/* Front Bumper & Driver Steering Wheel Header */}
                <div className="flex items-center justify-center gap-1.5 text-slate-500 mb-2 select-none">
                  <DriverSteeringWheelIcon className="w-4 h-4 text-slate-600" />
                  <span className="text-[10px] font-bold tracking-widest text-slate-600 uppercase">
                    DRIVER
                  </span>
                </div>

                {/* 9 Rows Floor Grid (36 Seats Total) with Central Dashed Aisle */}
                <div className="space-y-1 relative">
                  {/* Central Dashed Vertical Aisle Divider */}
                  <div
                    className="absolute top-0 bottom-0 left-[54%] w-px border-r border-dashed border-slate-300 pointer-events-none"
                    aria-hidden="true"
                  />

                  {activeRows.map((row) => {
                    const isLeft1Selected = selectedSeatIds.includes(row.left1.id);
                    const isLeft2Selected = selectedSeatIds.includes(row.left2.id);
                    const isRight1Selected = selectedSeatIds.includes(row.right1.id);
                    const isRight2Selected = selectedSeatIds.includes(row.right2.id);

                    const left1Status: SeatStatus = isLeft1Selected
                      ? 'selected'
                      : row.left1.defaultStatus;
                    const left2Status: SeatStatus = isLeft2Selected
                      ? 'selected'
                      : row.left2.defaultStatus;
                    const right1Status: SeatStatus = isRight1Selected
                      ? 'selected'
                      : row.right1.defaultStatus;
                    const right2Status: SeatStatus = isRight2Selected
                      ? 'selected'
                      : row.right2.defaultStatus;

                    const currentPrice = activeDeck === 'lower' ? basePrice : sleeperPrice;

                    return (
                      <div
                        key={row.rowNum}
                        className="flex items-center justify-between gap-1 py-0.5"
                      >
                        {/* Row Number (1 to 9 on left margin) */}
                        <span className="w-4 text-[11px] font-bold text-slate-400 text-center select-none">
                          {row.rowNum}
                        </span>

                        {/* Left Side 2 Seats */}
                        <div className="flex items-center gap-2">
                          <BusSeat
                            id={row.left1.id}
                            status={left1Status}
                            deck={activeDeck}
                            price={currentPrice}
                            size="md"
                            onClick={() =>
                              handleSeatToggle(
                                row.left1.id,
                                row.left1.defaultStatus === 'booked' ||
                                  row.left1.defaultStatus === 'unavailable'
                              )
                            }
                          />
                          <BusSeat
                            id={row.left2.id}
                            status={left2Status}
                            deck={activeDeck}
                            price={currentPrice}
                            size="md"
                            onClick={() =>
                              handleSeatToggle(
                                row.left2.id,
                                row.left2.defaultStatus === 'booked' ||
                                  row.left2.defaultStatus === 'unavailable'
                              )
                            }
                          />
                        </div>

                        {/* Aisle Spacer */}
                        <div className="w-5" />

                        {/* Right Side 2 Seats */}
                        <div className="flex items-center gap-2">
                          <BusSeat
                            id={row.right1.id}
                            status={right1Status}
                            deck={activeDeck}
                            price={currentPrice}
                            size="md"
                            onClick={() =>
                              handleSeatToggle(
                                row.right1.id,
                                row.right1.defaultStatus === 'booked' ||
                                  row.right1.defaultStatus === 'unavailable'
                              )
                            }
                          />
                          <BusSeat
                            id={row.right2.id}
                            status={right2Status}
                            deck={activeDeck}
                            price={currentPrice}
                            size="md"
                            onClick={() =>
                              handleSeatToggle(
                                row.right2.id,
                                row.right2.defaultStatus === 'booked' ||
                                  row.right2.defaultStatus === 'unavailable'
                              )
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Horizontal Legend directly below bus chassis */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-700 pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#DDF6DD] border border-[#A8DDAA]" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FC7728] border border-[#E6651D]" />
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#E4E1E5] border border-[#C6C2C9]" />
                  <span>Booked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#F8D1DF] border border-[#EFA9BF]" />
                  <span>Women only</span>
                </div>
              </div>
            </div>

            {/* COLUMN 3: RIGHT COLUMN (Booking Summary Card + CTA) */}
            <div className="lg:col-span-3 flex flex-col">
              <div className="rounded-3xl bg-white/60 backdrop-blur-md p-6 border border-white/80 shadow-[0_12px_36px_rgba(11,35,65,0.06)] flex flex-col justify-between space-y-4">
                {/* Your Seats Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <Armchair className="w-3.5 h-3.5 text-[#0B2341]" strokeWidth={1.75} />
                      <span>Your Seats</span>
                    </div>
                    {selectedSeats.length > 0 && (
                      <span className="text-xs font-bold text-[#FC7728]">
                        {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}
                      </span>
                    )}
                  </div>

                  <div className="text-2xl sm:text-3xl font-black text-[#0B2341] tracking-tight">
                    {selectedSeatsDisplay}
                  </div>

                  {/* Interactive Removable Seat Chips */}
                  {selectedSeats.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {selectedSeats.map((seat) => (
                        <button
                          key={seat.id}
                          type="button"
                          onClick={() => handleSeatToggle(seat.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF0E6] border border-[#FC7728]/30 text-[#FC7728] text-xs font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all cursor-pointer group"
                          title={`Click to remove seat ${seat.id}`}
                        >
                          <span>{seat.id}</span>
                          <X className="w-3 h-3 group-hover:scale-110" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-200/60 my-1" />

                {/* Station Timeline: Connected Boarding ── Dropping */}
                <div className="relative pl-6 space-y-4">
                  {/* Connecting vertical dashed line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-px border-l-2 border-dashed border-slate-300 pointer-events-none" />

                  {/* Boarding Point */}
                  <div className="relative">
                    <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#16834A] border-2 border-white shadow-2xs flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    <div className="text-xs font-semibold text-slate-500">Boarding Point</div>
                    <div className="text-[14px] font-bold text-[#0B2341] leading-snug">
                      {ticket.boardingPoint || ticket.originStation || 'Airport Gate 1, Kolkata'}
                    </div>
                  </div>

                  {/* Dropping Point */}
                  <div className="relative">
                    <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#FC7728] border-2 border-white shadow-2xs flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    <div className="text-xs font-semibold text-slate-500">Dropping Point</div>
                    <div className="text-[14px] font-bold text-[#0B2341] leading-snug">
                      {ticket.droppingPoint || ticket.destinationStation || 'Siliguri ISBT / Junction'}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200/60 my-1" />

                {/* Fare Section with Higher Strikethrough & Highlighted Discounted Price */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-600" strokeWidth={2} />
                      <span>Total Fare</span>
                    </div>
                    {/* Best Price Tag with Dynamic Savings */}
                    {totalSavings > 0 && totalFare > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                        <Tag className="w-3 h-3 text-[#059669]" strokeWidth={2.2} />
                        <span>Save ₹{totalSavings.toLocaleString('en-IN')}</span>
                      </span>
                    )}
                  </div>

                  {/* Highlighted Price with Strikethrough Original Price */}
                  <div className="flex items-baseline gap-2.5">
                    <div className="text-3xl sm:text-4xl font-black text-[#0B2341] tracking-tight">
                      ₹{totalFare.toLocaleString('en-IN')}
                    </div>
                    {originalTotalFare > totalFare && totalFare > 0 && (
                      <span className="text-sm sm:text-base font-semibold line-through text-slate-400">
                        ₹{originalTotalFare.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    <span>Including all taxes</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[#059669] font-semibold flex items-center gap-0.5">
                      <Check className="w-3 h-3" strokeWidth={3} />
                      Best price guarantee
                    </span>
                  </div>
                </div>

                {/* Continue CTA Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={selectedSeats.length === 0}
                    onClick={() => onConfirmBooking(ticket, selectedSeats)}
                    className={`w-full h-[52px] rounded-full font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all ${
                      selectedSeats.length > 0
                        ? 'bg-[#FC7728] hover:bg-[#E6651D] active:scale-[0.98] text-white shadow-[#FC7728]/25 hover:shadow-xl hover:shadow-[#FC7728]/30 cursor-pointer'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4.5 h-4.5" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionModal;
