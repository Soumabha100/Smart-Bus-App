import { useState, useMemo, type FC } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FilterSidebar } from '../features/results/FilterSidebar';
import { DateStrip } from '../features/results/DateStrip';
import { TicketCard } from '../features/results/TicketCard';
import { SeatHoldModal } from '../features/results/SeatHoldModal';
import { SeatSelectionModal, type SelectedSeatInfo } from '../features/results/SeatSelectionModal';
import type { BusTicket, FilterState } from '../features/results/types';

const MOCK_BUSES: BusTicket[] = [
  {
    id: 'shyamoli-1',
    operator: 'Shyamoli Paribahan',
    busType: 'Volvo Multi-Axle AC Sleeper (2+1) • Smooth Air Suspension',
    rating: 4.6,
    reviewsCount: 1240,
    departureTime: '20:30',
    originStation: 'Esplanade Stand D',
    originDetails: 'Near Eden Gardens Metro Gate 2',
    arrivalTime: '08:00',
    destinationStation: 'Siliguri Junction',
    destinationDetails: 'Main Bus Stand (Next Day)',
    duration: '11h 30m',
    onTimeRate: '98% On-Time Record',
    originalPrice: 950,
    price: 749,
    seatsLeft: 12,
    tag: 'AI Pick: Sleep Well',
    subtag: 'NH-12 Inspected',
    operatorType: 'private',
    moodMatch: 'Sleep well',
    departureSlot: 'night',
    boardingPoint: 'Esplanade / Dharmatala',
    droppingPoint: 'Siliguri Junction Stand',
    amenities: ['Charging', 'Blanket', 'Free WiFi', 'Water', 'Live GPS'],
  },
  {
    id: 'royal-1',
    operator: 'Royal Cruiser Express',
    busType: 'Bharat Benz AC Seater (2+2) • Extra Calf Support',
    rating: 4.4,
    reviewsCount: 850,
    departureTime: '21:15',
    originStation: 'Babughat Stand',
    originDetails: 'Gate 2 Near Strand Road',
    arrivalTime: '08:00',
    destinationStation: 'Tenzing Norgay Terminus',
    destinationDetails: 'Platform 12 (Next Day)',
    duration: '10h 45m',
    onTimeRate: 'Non-stop Highway Transit',
    originalPrice: 720,
    price: 620,
    seatsLeft: 4,
    tag: '⚡ 10h 45m Fastest',
    subtag: 'Ergonomic Recliner',
    operatorType: 'private',
    moodMatch: 'Fastest',
    departureSlot: 'night',
    boardingPoint: 'Babughat Bus Stand',
    droppingPoint: 'Tenzing Norgay Bus Terminus',
    amenities: ['Charging', 'Water', 'Live GPS'],
  },
  {
    id: 'greenline-1',
    operator: 'Greenline Travels',
    busType: 'Scania AC Multi-Axle Sleeper • Complimentary Breakfast Included',
    rating: 4.8,
    reviewsCount: 2410,
    departureTime: '22:00',
    originStation: 'Airport Gate 1',
    originDetails: 'VIP Flyover Departure Bay',
    arrivalTime: '09:00',
    destinationStation: 'Siliguri ISBT',
    destinationDetails: 'Bypass Hub Gate 4 (Next Day)',
    duration: '11h 00m',
    onTimeRate: 'Complimentary Breakfast',
    originalPrice: 880,
    price: 799,
    seatsLeft: 19,
    tag: '★ Top Rated Operator',
    subtag: 'Clean Sanitized Bedding',
    operatorType: 'private',
    moodMatch: 'Scenic route',
    departureSlot: 'night',
    boardingPoint: 'Airport Gate No. 1',
    droppingPoint: 'ISBT Bypass Corridor',
    amenities: ['Free WiFi', 'Blanket', 'Water', 'Charging', 'Live GPS'],
  },
  {
    id: 'nbstc-1',
    operator: 'NBSTC Royal Heritage',
    busType: 'Superfast Express AC • Official State Transport Corporation',
    rating: 4.2,
    reviewsCount: 3120,
    departureTime: '20:00',
    originStation: 'Esplanade NBSTC Terminus',
    originDetails: 'Platform 4 (Dharmatala)',
    arrivalTime: '07:30',
    destinationStation: 'Tenzing Norgay Stand',
    destinationDetails: 'NBSTC Bay A (Next Day)',
    duration: '11h 30m',
    onTimeRate: 'Strict Schedule Adherence',
    originalPrice: 520,
    price: 520,
    seatsLeft: 16,
    tag: 'Govt of West Bengal',
    subtag: 'Dedicated Driver-Relay',
    operatorType: 'government',
    moodMatch: 'Budget friendly',
    departureSlot: 'night',
    boardingPoint: 'Esplanade / Dharmatala',
    droppingPoint: 'Tenzing Norgay Bus Terminus',
    amenities: ['Live GPS', 'Water'],
  },
  {
    id: 'sbstc-1',
    operator: 'SBSTC North Bengal Express',
    busType: 'AC 2+2 Semi-Sleeper • State Express Fleet',
    rating: 4.3,
    reviewsCount: 980,
    departureTime: '19:30',
    originStation: 'Babughat Depot',
    originDetails: 'SBSTC Main Bay',
    arrivalTime: '06:45',
    destinationStation: 'Siliguri Junction',
    destinationDetails: 'Platform 3 (Next Day)',
    duration: '11h 15m',
    onTimeRate: 'Safe State Driver Protocol',
    originalPrice: 650,
    price: 580,
    seatsLeft: 8,
    tag: 'State Express',
    subtag: 'Govt of WB',
    operatorType: 'government',
    moodMatch: 'Budget friendly',
    departureSlot: 'night',
    boardingPoint: 'Babughat Bus Stand',
    droppingPoint: 'Siliguri Junction Stand',
    amenities: ['Charging', 'Live GPS'],
  },
  {
    id: 'wbtc-1',
    operator: 'WBTC Himalayan Queen',
    busType: 'Volvo Luxury Seater • Panoramic Vista Windows',
    rating: 4.5,
    reviewsCount: 1450,
    departureTime: '06:15',
    originStation: 'Esplanade Terminal',
    originDetails: 'Kolkata Central Hub',
    arrivalTime: '17:30',
    destinationStation: 'Siliguri Junction Stand',
    destinationDetails: 'Junction Bus Terminal',
    duration: '11h 15m',
    onTimeRate: 'Daytime Scenic Highway Run',
    originalPrice: 850,
    price: 760,
    seatsLeft: 14,
    tag: 'Day Vista Coach',
    subtag: 'Scenic NH-12 Run',
    operatorType: 'government',
    moodMatch: 'Scenic route',
    departureSlot: 'morning',
    boardingPoint: 'Esplanade / Dharmatala',
    droppingPoint: 'Siliguri Junction Stand',
    amenities: ['Free WiFi', 'Charging', 'Water', 'Live GPS'],
  },
];

export const ResultsPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state as { from?: string; to?: string; date?: string; mood?: string }) || {};

  const origin = state.from || 'Kolkata';
  const destination = state.to || 'Siliguri';
  const [selectedDateId, setSelectedDateId] = useState('2026-11-14');

  const [activeModalData, setActiveModalData] = useState<{
    ticket: BusTicket;
    seatId: string;
  } | null>(null);

  const [selectedBusForModal, setSelectedBusForModal] = useState<BusTicket | null>(null);
  const [bookingConfirmedInfo, setBookingConfirmedInfo] = useState<{
    ticket: BusTicket;
    seats: SelectedSeatInfo[];
  } | null>(null);

  const [heldSeat, setHeldSeat] = useState<string>('L6');

  const [filters, setFilters] = useState<FilterState>({
    mood: state.mood || 'Sleep well',
    maxPrice: 800,
    departureSlots: ['night'],
    busTypes: ['AC Sleeper (2+1)', 'AC Semi-Sleeper / Recliner'],
    boardingPoints: ['Esplanade / Dharmatala', 'Babughat Bus Stand'],
    droppingPoints: ['Tenzing Norgay Bus Terminus', 'Siliguri Junction Stand'],
    amenities: [],
    operators: ['NBSTC (Govt of WB)', 'SBSTC & WBTC', 'Shyamoli Paribahan'],
    sortBy: 'best',
  });

  const handleResetFilters = () => {
    setFilters({
      mood: 'All',
      maxPrice: 1500,
      departureSlots: [],
      busTypes: [],
      boardingPoints: [],
      droppingPoints: [],
      amenities: [],
      operators: [],
      sortBy: 'best',
    });
  };

  const filteredBuses = useMemo(() => {
    return MOCK_BUSES.filter((bus) => {
      // Mood filter
      if (filters.mood !== 'All' && bus.moodMatch !== filters.mood) {
        return false;
      }
      // Max price
      if (bus.price > filters.maxPrice) {
        return false;
      }
      // Departure slot
      if (filters.departureSlots.length > 0 && !filters.departureSlots.includes(bus.departureSlot)) {
        return false;
      }
      // Bus type
      if (filters.busTypes.length > 0 && !filters.busTypes.some((bt) => bus.busType.includes(bt.split(' ')[0]))) {
        return false;
      }
      // Boarding point
      if (filters.boardingPoints.length > 0 && !filters.boardingPoints.includes(bus.boardingPoint)) {
        return false;
      }
      // Dropping point
      if (filters.droppingPoints.length > 0 && !filters.droppingPoints.includes(bus.droppingPoint)) {
        return false;
      }
      // Operator
      if (
        filters.operators.length > 0 &&
        !filters.operators.some((op) => bus.operator.toLowerCase().includes(op.split(' ')[0].toLowerCase()))
      ) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'cheapest') return a.price - b.price;
      if (filters.sortBy === 'earliest') return a.departureTime.localeCompare(b.departureTime);
      if (filters.sortBy === 'fastest') return a.duration.localeCompare(b.duration);
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      return b.rating - a.rating; // best default
    });
  }, [filters]);

  const handleContinueBooking = (ticket: BusTicket, seatId: string) => {
    setActiveModalData({ ticket, seatId });
  };

  const handleOpenSeatModal = (ticket: BusTicket) => {
    setSelectedBusForModal(ticket);
  };

  const handleConfirmSeatBooking = (ticket: BusTicket, selectedSeats: SelectedSeatInfo[]) => {
    const seatList = selectedSeats.map((s) => s.id).join(', ');
    setHeldSeat(seatList);
    setSelectedBusForModal(null);
    setBookingConfirmedInfo({ ticket, seats: selectedSeats });
  };

  const handleConfirmedBooking = () => {
    if (activeModalData) {
      setHeldSeat(activeModalData.seatId);
      alert(
        `🎉 OneGoHold™ Activated! Seat ${activeModalData.seatId} on ${activeModalData.ticket.operator} is reserved for 7 minutes.`
      );
      setActiveModalData(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col space-y-6 pb-12 selection:bg-accent-tint selection:text-on-accent-tint">
      {/* 1. TOP PROMO STRIP */}
      <div className="bg-[#0B2341] text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 rounded-2xl shadow-xs">
        <span className="inline-flex items-center gap-1 bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full text-[11px] font-bold">
          <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
          <span>Bengal AI Route Advisor</span>
        </span>
        <span className="hidden sm:inline">
          Heavy holiday rush expected on NH-12 for North Bengal routes. Book night sleeper berths early to lock fares!
        </span>
        <span className="sm:hidden">Holiday rush on NH-12: Lock fares early!</span>
      </div>

      {/* 2. ROUTE SUMMARY BAR (Clean Card) */}
      <div className="bg-white rounded-2xl border border-[#E5E1D8] p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full border border-[#E5E1D8] bg-[#FBF9F5] hover:bg-[#F6F4EE] flex items-center justify-center text-[#64748B] hover:text-[#0B2341] transition-colors cursor-pointer"
            title="Back to Route Planner"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-sans text-2xl font-extrabold text-[#0B2341] tracking-tight flex items-center gap-2">
                <span>{origin}</span>
                <span className="text-[#FC7728] font-normal">⟿</span>
                <span>{destination}</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 font-bold text-xs border border-teal-200">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                <span>SAT, 14 NOV • 1 PASSENGER • AC SLEEPER</span>
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1 flex items-center gap-2 flex-wrap">
              <span>Direct NH-12 Corridor</span>
              <span className="text-[#E5E1D8]">•</span>
              <span>Est. Distance: 574 km</span>
              <span className="text-[#E5E1D8]">•</span>
              <span className="text-teal-700 font-semibold">Average Travel Time: 11 hrs 15 mins</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          <div className="text-right hidden sm:block">
            <span className="text-sm font-bold text-[#0B2341] block">
              {filteredBuses.length} Verified Rides
            </span>
            <span className="text-xs text-[#64748B]">Government &amp; Private fleets</span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E1D8] bg-[#FBF9F5] hover:bg-[#F6F4EE] text-[#0B2341] text-xs font-bold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#FC7728]">tune</span>
            <span>Modify Route</span>
          </button>
        </div>
      </div>

      {/* 3. DATE CAROUSEL STRIP */}
      <DateStrip selectedDateId={selectedDateId} onSelectDate={setSelectedDateId} />

      {/* 4. MAIN TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Sidebar (~4 cols) */}
        <FilterSidebar filters={filters} onChange={setFilters} onReset={handleResetFilters} />

        {/* Right Results Stream (~8 cols) */}
        <section className="lg:col-span-8 xl:col-span-8.5 space-y-5">
          {/* Results Header & Segmented Sort Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E5E1D8] shadow-xs">
            <div>
              <h2 className="font-sans font-bold text-xl text-[#0B2341]">
                {filteredBuses.length} Buses Available
              </h2>
              <p className="text-xs text-[#64748B]">
                Showing budget-filtered buses between ₹400 – ₹{filters.maxPrice}
              </p>
            </div>

            {/* Segmented Sort Control */}
            <div className="inline-flex p-1 rounded-xl bg-[#F6F4EE] border border-[#E5E1D8] text-xs font-semibold overflow-x-auto">
              {[
                { id: 'best', label: 'Best for You', icon: 'auto_awesome' },
                { id: 'cheapest', label: 'Cheapest' },
                { id: 'earliest', label: 'Earliest' },
                { id: 'fastest', label: 'Fastest' },
                { id: 'rating', label: 'Top Rated' },
              ].map((s) => {
                const active = filters.sortBy === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, sortBy: s.id as typeof prev.sortBy }))}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                      active
                        ? 'bg-white text-[#0B2341] font-bold shadow-xs border border-[#E5E1D8]'
                        : 'text-[#64748B] hover:text-[#0B2341]'
                    }`}
                  >
                    {s.icon && (
                      <span className="material-symbols-outlined text-[14px] text-teal-700">
                        {s.icon}
                      </span>
                    )}
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Recommendation Banner */}
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200/80 shadow-xs flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0B2341] text-sm">OneGoBus AI Trip Intelligence</span>
                <span className="px-2 py-0.5 rounded-full bg-teal-700 text-white text-[10px] font-extrabold uppercase">
                  Sleep Well Match
                </span>
              </div>
              <p className="text-[#64748B] mt-1 leading-relaxed">
                Night departures between 20:00 – 22:30 bypass peak NH-12 bottleneck traffic around Malda town bypass,
                arriving in Siliguri refreshed right before sunrise. Recommended for your{' '}
                <strong className="text-[#0B2341]">Sleep Well</strong> mood preference.
              </p>
              <Link
                to="/ask-ai"
                className="inline-flex items-center gap-1 font-bold text-teal-800 hover:underline mt-2"
              >
                <span>Ask AI about road conditions &amp; dinner stops on this route</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Ticket Stream */}
          {filteredBuses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E5E1D8] p-12 text-center flex flex-col items-center">
              <span className="material-symbols-outlined text-4xl text-[#64748B] mb-2">
                directions_bus
              </span>
              <h3 className="font-sans text-lg font-bold text-[#0B2341] mb-1">
                No rides matching filters
              </h3>
              <p className="text-xs text-[#64748B] max-w-sm mb-4">
                Try widening your budget cap above ₹{filters.maxPrice} or resetting your mood filters to view all available coaches.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-full bg-[#FC7728] hover:bg-[#E06547] text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredBuses.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onViewSeats={handleOpenSeatModal}
                onContinueBooking={handleContinueBooking}
              />
            ))
          )}

          {/* Load More Button */}
          {filteredBuses.length > 0 && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => alert('All verified regional departures for this date corridor are already loaded.')}
                className="px-8 py-3 rounded-full bg-white border border-[#E5E1D8] text-[#0B2341] text-sm font-bold hover:bg-[#F6F4EE] hover:border-teal-500/40 transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#FC7728]">
                  expand_more
                </span>
                <span>Load 14 more verified buses</span>
              </button>
            </div>
          )}
        </section>
      </div>

      {/* 5. SEAT HOLD PROTECTION TOAST / PREVIEW BANNER */}
      <div className="bg-white rounded-2xl border border-teal-200/80 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">timer</span>
          </div>
          <div>
            <span className="text-sm font-bold text-[#0B2341] flex items-center gap-1.5">
              <span>7-Minute OneGoHold™ Seat Protection Guarantee Active</span>
              <span className="text-[10px] uppercase font-bold bg-teal-700 text-white px-1.5 py-0.5 rounded">
                Instant Lock
              </span>
            </span>
            <p className="text-xs text-[#64748B] mt-0.5">
              When you click a berth, your seat is held exclusively for 7 minutes without price spikes while you enter traveler details.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-teal-800">
            Seat {heldSeat} Reserved
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-pulse" />
        </div>
      </div>

      {/* 6. TRUST STRIP (3 Light Cards) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="bg-white rounded-2xl border border-[#E5E1D8] p-5 flex items-start gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">verified_user</span>
          </div>
          <div>
            <h4 className="font-sans font-bold text-base text-[#0B2341]">
              100% Safe Journey &amp; GPS
            </h4>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              Live tracking link shared via WhatsApp, dedicated SOS emergency desk, and verified CCTV sleeper coaches.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E1D8] p-5 flex items-start gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-[#FC7728]/20 text-[#A04100] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">
              airline_seat_recline_normal
            </span>
          </div>
          <div>
            <h4 className="font-sans font-bold text-base text-[#0B2341]">
              Verified Bengal RTC &amp; Fleets
            </h4>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              Direct real-time inventory from NBSTC, SBSTC, Shyamoli, and Greenline with zero hidden markups.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E1D8] p-5 flex items-start gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-[#F6F4EE] border border-[#E5E1D8] text-[#0B2341] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">currency_exchange</span>
          </div>
          <div>
            <h4 className="font-sans font-bold text-base text-[#0B2341]">
              15-Min Instant UPI Refunds
            </h4>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              Instant refund credited straight to your Google Pay, PhonePe, or bank account if a bus is delayed or canceled.
            </p>
          </div>
        </div>
      </section>

      {/* 7. SEAT HOLD MODAL */}
      {activeModalData && (
        <SeatHoldModal
          ticket={activeModalData.ticket}
          seatId={activeModalData.seatId}
          origin={origin}
          destination={destination}
          onClose={() => setActiveModalData(null)}
          onConfirmed={handleConfirmedBooking}
        />
      )}

      {/* 8. STITCH SEAT SELECTION MODAL (Desktop Light 13a355a4fb44436b8b133a2b76e1f65d & Mobile Light dce2b070c6034041b93a50314ff81778) */}
      {selectedBusForModal && (
        <SeatSelectionModal
          isOpen={!!selectedBusForModal}
          ticket={selectedBusForModal}
          origin={origin}
          destination={destination}
          onClose={() => setSelectedBusForModal(null)}
          onConfirmBooking={handleConfirmSeatBooking}
        />
      )}

      {/* 9. BOOKING CONFIRMED STAGING MODAL (DPDP 2025 COMPLIANT PASSENGER DETAILS PROMPT) */}
      {bookingConfirmedInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-modal-backdrop">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E1D8] shadow-2xl animate-modal-scale relative text-[#0B2341]">
            <button
              type="button"
              onClick={() => setBookingConfirmedInfo(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                OneGoHold™ 7-Min Guarantee Active
              </span>
            </div>

            <h3 className="font-sans text-2xl font-extrabold text-[#0B2341]">
              Seats Locked Successfully!
            </h3>
            <p className="text-xs text-[#64748B] mt-1 mb-5">
              {bookingConfirmedInfo.ticket.operator} • {bookingConfirmedInfo.ticket.busType}
            </p>

            <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E5E1D8] space-y-2.5 text-xs mb-5">
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Route:</span>
                <span className="font-bold text-[#0B2341]">
                  {origin} ➔ {destination}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Confirmed Seats:</span>
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {bookingConfirmedInfo.seats.map((s) => (
                    <span
                      key={s.id}
                      className="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 font-bold font-mono text-[11px]"
                    >
                      {s.id} ({s.deck})
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Boarding Point:</span>
                <span className="font-semibold text-[#0B2341]">
                  {bookingConfirmedInfo.ticket.originStation} ({bookingConfirmedInfo.ticket.departureTime})
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#E5E1D8]">
                <span className="text-[#64748B] font-medium">Total Fare:</span>
                <span className="font-sans font-extrabold text-lg text-[#FC7728]">
                  ₹{bookingConfirmedInfo.seats.reduce((sum, s) => sum + s.price, 0).toLocaleString('en-IN')}{' '}
                  <span className="text-[10px] text-[#64748B] font-normal">(all taxes incl.)</span>
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200/80 mb-6 text-xs text-teal-900 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-teal-700 shrink-0">
                security
              </span>
              <p className="leading-relaxed">
                <strong>DPDP Act 2025 Protected:</strong> Zero personal data leakage. Your seats are held in memory for 7 minutes while you proceed to passenger details.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedBusForModal(bookingConfirmedInfo.ticket);
                  setBookingConfirmedInfo(null);
                }}
                className="w-full sm:w-1/2 py-3 rounded-xl border border-[#0B2341] text-[#0B2341] hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
              >
                Change Seats
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(
                    `Proceeding to Stage 3: Passenger Details for seat(s) ${bookingConfirmedInfo.seats.map((s) => s.id).join(', ')}!`
                  );
                  setBookingConfirmedInfo(null);
                }}
                className="w-full sm:w-1/2 py-3 rounded-xl bg-[#FC7728] hover:bg-[#E06547] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Enter Passenger Details</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
