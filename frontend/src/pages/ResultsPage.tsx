import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { PerforatedTicket, type BusTicketData, GlassCard, Chip } from '../components/ui';

const INITIAL_RESULTS: BusTicketData[] = [
  {
    id: 'bus-1',
    operator: 'NBSTC Twilight Classic',
    busType: 'AC Sleeper (2+1)',
    rating: 4.8,
    reviewsCount: 342,
    departureTime: '20:30',
    arrivalTime: '07:45',
    duration: '11h 15m',
    originStation: 'Esplanade Central, Kolkata',
    destinationStation: 'Mall Road Terminal, Darjeeling',
    price: 1150,
    seatsLeft: 6,
    comfortTags: ['Charging Points', 'Warm Blankets', 'Mineral Water', 'GPS Tracking'],
    isBestForYou: true,
    bestForReason: 'Sleep well pick',
  },
  {
    id: 'bus-2',
    operator: 'Greenline Royal Multi-Axle',
    busType: 'Volvo B11R AC Sleeper',
    rating: 4.7,
    reviewsCount: 512,
    departureTime: '19:45',
    arrivalTime: '06:30',
    duration: '10h 45m',
    originStation: 'Karunamoyee, Salt Lake',
    destinationStation: 'Siliguri Junction & Darjeeling',
    price: 1450,
    seatsLeft: 10,
    comfortTags: ['High-speed WiFi', 'Individual Screens', 'Snacks', 'Live Camera'],
    isBestForYou: false,
    bestForReason: 'Fastest route',
  },
  {
    id: 'bus-3',
    operator: 'SBSTC North Bengal Express',
    busType: 'AC 2+2 Semi-Sleeper',
    rating: 4.5,
    reviewsCount: 198,
    departureTime: '21:15',
    arrivalTime: '08:45',
    duration: '11h 30m',
    originStation: 'Babughat Depot, Kolkata',
    destinationStation: 'Ghum & Darjeeling Motor Stand',
    price: 880,
    seatsLeft: 14,
    comfortTags: ['Reclining Seats', 'Reading Light', 'Charging USB'],
    isBestForYou: false,
    bestForReason: 'Budget friendly',
  },
  {
    id: 'bus-4',
    operator: 'WBTC Himalayan Queen',
    busType: 'Volvo Luxury Seater',
    rating: 4.6,
    reviewsCount: 276,
    departureTime: '06:15',
    arrivalTime: '17:30',
    duration: '11h 15m',
    originStation: 'Esplanade Terminal, Kolkata',
    destinationStation: 'Chowrasta Stand, Darjeeling',
    price: 990,
    seatsLeft: 8,
    comfortTags: ['Panoramic Vista Windows', 'Air Suspension', 'Audio Tour'],
    isBestForYou: false,
    bestForReason: 'Scenic route',
  },
];

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state as { from?: string; to?: string; date?: string; mood?: string }) || {};
  const origin = state.from || 'Kolkata';
  const destination = state.to || 'Darjeeling';
  const dateString = state.date || 'Today, 14 Nov';

  const [selectedMood, setSelectedMood] = useState<string>(state.mood || 'Sleep well');
  const [selectedOperator, setSelectedOperator] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'rating' | 'departure'>('recommended');
  const [selectedTicket, setSelectedTicket] = useState<BusTicketData | null>(null);

  // Filter & Sort Logic
  const filteredBuses = useMemo(() => {
    let list = INITIAL_RESULTS.map((bus) => {
      // Dynamic best-for-you assignment based on active mood
      const isBest =
        (selectedMood === 'Sleep well' && bus.bestForReason?.includes('Sleep')) ||
        (selectedMood === 'Fastest' && bus.bestForReason?.includes('Fastest')) ||
        (selectedMood === 'Budget friendly' && bus.bestForReason?.includes('Budget')) ||
        (selectedMood === 'Scenic route' && bus.bestForReason?.includes('Scenic'));

      return {
        ...bus,
        isBestForYou: isBest,
      };
    });

    if (selectedOperator !== 'All') {
      list = list.filter((b) => b.operator.toLowerCase().includes(selectedOperator.toLowerCase()));
    }

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'departure') {
      list.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    } else {
      // Recommended: prioritize isBestForYou
      list.sort((a, b) => (b.isBestForYou ? 1 : 0) - (a.isBestForYou ? 1 : 0));
    }

    return list;
  }, [selectedMood, selectedOperator, sortBy]);

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#FFF7ED] flex flex-col selection:bg-[#2DD4BF]/30 selection:text-[#2DD4BF]">
      {/* Desktop Header Navbar */}
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Route Summary & Modify Header */}
        <section className="mb-8 p-6 rounded-3xl bg-[#151B2A]/90 border border-white/10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="w-11 h-11 rounded-full bg-[#19202E] border border-white/15 flex items-center justify-center text-white hover:bg-white/10 transition-colors shrink-0 shadow-sm"
              aria-label="Back to Route Planner"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#2DD4BF] uppercase tracking-wider">
                <span>Active Journey Line</span>
                <span>•</span>
                <span>{dateString}</span>
              </div>
              <h1 className="font-sora text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight mt-0.5">
                {origin} <span className="text-[#FF7A59]">⟿</span> {destination}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-gray-400 block">Found Options</span>
              <span className="font-sora text-sm font-semibold text-white">
                {filteredBuses.length} Verified Rides
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="h-10 px-5 rounded-full bg-white/5 border border-white/15 hover:bg-white/10 text-white font-inter text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px] text-[#FF7A59]">tune</span>
              <span>Modify Route</span>
            </button>
          </div>
        </section>

        {/* Desktop 2-Column Grid: Filter Sidebar + Results Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Desktop Sidebar Filters (3 Cols) */}
          <aside className="lg:col-span-4 flex flex-col gap-6 sticky top-28">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <span className="font-sora text-sm font-bold text-white uppercase tracking-wider">
                  Journey Filters
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMood('All');
                    setSelectedOperator('All');
                    setSortBy('recommended');
                  }}
                  className="text-xs text-[#2DD4BF] hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Mood Filter */}
              <div className="mb-6">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2.5">
                  Travel Mood
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Sleep well', 'Fastest', 'Budget friendly', 'Scenic route', 'All'].map((mood) => (
                    <Chip
                      key={mood}
                      variant="mood"
                      active={selectedMood === mood}
                      onClick={() => setSelectedMood(mood)}
                    >
                      {mood}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* State Transport / Operator Filter */}
              <div className="mb-6">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2.5">
                  Bus Operator
                </label>
                <div className="flex flex-col gap-2">
                  {['All', 'NBSTC', 'SBSTC', 'WBTC', 'Greenline'].map((op) => (
                    <button
                      key={op}
                      type="button"
                      onClick={() => setSelectedOperator(op)}
                      className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium text-left transition-colors flex items-center justify-between ${
                        selectedOperator === op
                          ? 'bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/30'
                          : 'bg-[#151B2A] text-gray-300 hover:text-white border border-white/5'
                      }`}
                    >
                      <span>{op === 'All' ? 'All Operators' : op}</span>
                      {selectedOperator === op && (
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By Filter */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2.5">
                  Sort Journeys
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full h-11 px-3.5 bg-[#151B2A] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
                >
                  <option value="recommended">Best for You (Mood Match)</option>
                  <option value="price-low">Price: Lowest First</option>
                  <option value="rating">Rating: Highest First</option>
                  <option value="departure">Departure Time: Earliest</option>
                </select>
              </div>
            </GlassCard>

            {/* Travel Diary Advice Callout */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#151B2A] to-[#19202E] border border-white/10 text-xs text-[#DFC0B8]">
              <div className="flex items-center gap-2 text-white font-sora font-semibold mb-1">
                <span className="material-symbols-outlined text-[18px] text-[#FF7A59]">wb_twilight</span>
                <span>Conductor Advice</span>
              </div>
              <p className="leading-relaxed">
                Overnight journeys climbing to Darjeeling offer breathtaking morning views over Kurseong and Batasia Loop. Window seats on the right side are highly recommended.
              </p>
            </div>
          </aside>

          {/* Right Column: List of Perforated Ticket Stubs (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {filteredBuses.length === 0 ? (
              <GlassCard className="p-12 text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">directions_bus</span>
                <h3 className="font-sora text-lg font-bold text-white mb-1">No rides matching filters</h3>
                <p className="text-xs text-gray-400 max-w-sm mb-4">
                  Try adjusting your travel mood or operator selection to reveal more options on this line.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMood('All');
                    setSelectedOperator('All');
                  }}
                  className="px-4 py-2 rounded-full bg-[#FF7A59] text-white text-xs font-semibold"
                >
                  Reset All Filters
                </button>
              </GlassCard>
            ) : (
              filteredBuses.map((ticket) => (
                <PerforatedTicket
                  key={ticket.id}
                  ticket={ticket}
                  onSelect={(t) => setSelectedTicket(t)}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Seat Reservation Modal / Dialog */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <GlassCard className="max-w-md w-full p-6 sm:p-8 relative border border-white/20 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
              <span className="text-[11px] font-semibold text-[#2DD4BF] uppercase tracking-wider">
                Seat Hold Staged
              </span>
            </div>

            <h3 className="font-sora text-xl font-bold text-white mb-1">
              {selectedTicket.operator}
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              {selectedTicket.busType} • {selectedTicket.departureTime} Departure
            </p>

            <div className="p-4 rounded-2xl bg-[#0B1220] border border-white/10 mb-6 flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Route:</span>
                <span className="text-white font-medium">{origin} ⟿ {destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Boarding Station:</span>
                <span className="text-white font-medium">{selectedTicket.originStation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Seat Fare:</span>
                <span className="font-sora text-base font-bold text-[#FF7A59]">
                  ₹{selectedTicket.price.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 leading-relaxed mb-6">
              In accordance with DPDP rules &amp; West Bengal Smart Bus regulations, your seat is held for 7 minutes while you confirm your passenger details.
            </p>

            <button
              type="button"
              onClick={() => {
                alert(`Booking confirmed for ${selectedTicket.operator}! Your electronic ticket pass has been added to your travel diary.`);
                setSelectedTicket(null);
              }}
              className="w-full h-12 rounded-full bg-[#FF7A59] hover:bg-[#E06547] text-white font-sora font-semibold text-sm shadow-[0_6px_20px_rgba(255,122,89,0.4)] transition-all active:scale-95"
            >
              Confirm Seat Pass (₹{selectedTicket.price})
            </button>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
