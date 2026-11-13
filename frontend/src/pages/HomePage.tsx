import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { GlassCard, Chip, BottomBar, JourneyLine, PillButton } from '../components/ui';
import { useTimeTheme } from '../hooks/useTimeTheme';
import { tokenStorage } from '../utils/tokenStorage';

interface JourneyStory {
  id: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  title: string;
  duration: string;
  price: number;
  highlight: string;
  mood: string;
  busType: string;
  operator: string;
}

const FEATURED_JOURNEYS: JourneyStory[] = [
  {
    id: 'j-1',
    from: 'Siliguri',
    fromCode: 'IXB',
    to: 'Gangtok',
    toCode: 'GTK',
    title: 'Teesta River Canyon Way',
    duration: '4h 30m',
    price: 450,
    highlight: 'Window seat facing cloud valleys & deep gorges',
    mood: 'Scenic route',
    busType: 'AC Executive Mini-Coach',
    operator: 'NBSTC Glacier Line',
  },
  {
    id: 'j-2',
    from: 'Kolkata',
    fromCode: 'KOL',
    to: 'Darjeeling',
    toCode: 'DAR',
    title: 'Tea Estate Serpentine Trail',
    duration: '11h 15m',
    price: 1150,
    highlight: 'Overnight sleeper with morning mountain sunrise',
    mood: 'Sleep well',
    busType: 'AC Multi-Axle Sleeper',
    operator: 'NBSTC Twilight Classic',
  },
  {
    id: 'j-3',
    from: 'Kolkata',
    fromCode: 'KOL',
    to: 'Digha',
    toCode: 'DGH',
    title: 'Bay Coastline Express',
    duration: '4h 00m',
    price: 320,
    highlight: 'Smooth four-lane expressway to sandy shores',
    mood: 'Fastest',
    busType: 'Volvo AC Seater',
    operator: 'SBSTC Sagar Kanya',
  },
  {
    id: 'j-4',
    from: 'Kolkata',
    fromCode: 'KOL',
    to: 'Bolpur Santiniketan',
    toCode: 'BLP',
    title: 'Red Soil Cultural Trail',
    duration: '3h 45m',
    price: 260,
    highlight: 'Scenic rural Bengal groves & Baul ballad stations',
    mood: 'Budget friendly',
    busType: 'Express Seater',
    operator: 'WBTC Mayurakshi',
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTimeTheme();
  const user = tokenStorage.getUser();

  // Booking line state
  const [fromCity, setFromCity] = useState({ name: 'Kolkata', code: 'KOL', station: 'Esplanade Terminal' });
  const [toCity, setToCity] = useState({ name: 'Darjeeling', code: 'DAR', station: 'Mall Road Stand' });
  const [selectedDate, setSelectedDate] = useState('Today, 14 Nov');
  const [selectedMood, setSelectedMood] = useState('Sleep well');

  const handleSwapCities = () => {
    setFromCity(toCity);
    setToCity(fromCity);
  };

  const handleSearchBuses = () => {
    navigate('/results', {
      state: {
        from: fromCity.name,
        to: toCity.name,
        date: selectedDate,
        mood: selectedMood,
      },
    });
  };

  const filteredJourneys = FEATURED_JOURNEYS.filter((journey) => {
    if (selectedMood === 'All') return true;
    return journey.mood === selectedMood || selectedMood === 'Sleep well';
  });

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#FFF7ED] flex flex-col selection:bg-[#2DD4BF]/30 selection:text-[#2DD4BF]">
      {/* Full Desktop Navigation */}
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Desktop Greeting & Horizon Header */}
        <section className="mb-8 lg:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#2DD4BF] mb-2 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
              <span className="font-inter uppercase tracking-widest font-semibold text-[10px]">
                {theme.period} Departure Window
              </span>
            </div>
            <h1 className="font-sora text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              {theme.greeting},{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A59] to-[#FDBA74]">
                {user?.name || 'Traveler'}
              </span>
            </h1>
            <p className="font-inter text-sm sm:text-base text-[#DFC0B8] mt-2 max-w-2xl">
              Where would your travel diary take you today? Chart your journey line across mist-covered ridges and coastal highways.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-xs text-gray-400 bg-[#151B2A]/80 border border-white/10 px-5 py-3 rounded-2xl">
            <span className="material-symbols-outlined text-[#2DD4BF] text-[20px]">verified</span>
            <div>
              <div className="text-white font-medium">NBSTC, SBSTC &amp; WBTC Live</div>
              <div className="text-[11px] text-gray-400">Direct state transport &amp; verified Volvo coaches</div>
            </div>
          </div>
        </section>

        {/* MAIN BOOKING SECTION: Plan Your Line */}
        <section aria-labelledby="plan-your-line-heading" className="mb-12 lg:mb-16">
          <GlassCard className="relative overflow-visible p-6 sm:p-8 lg:p-10 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Header row of booking card */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FF7A59]/15 flex items-center justify-center text-[#FF7A59]">
                  <span className="material-symbols-outlined text-[18px]">route</span>
                </div>
                <h2 id="plan-your-line-heading" className="font-sora text-base sm:text-lg font-bold text-white tracking-wide uppercase">
                  Plan Your Journey Line
                </h2>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-[#2DD4BF]">
                <span className="material-symbols-outlined text-[16px]">touch_app</span>
                <span>Select origin and destination to chart route</span>
              </div>
            </div>

            {/* Desktop Horizontal Route Selector Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-8">
              {/* Origin Circle Card */}
              <div className="lg:col-span-4 bg-[#0B1220]/90 border border-white/15 rounded-3xl p-5 sm:p-6 flex items-center gap-4 transition-all hover:border-[#2DD4BF]/50 shadow-inner group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#151B2A] border-2 border-[#2DD4BF] flex flex-col items-center justify-center text-center shrink-0 shadow-[0_0_20px_rgba(45,212,191,0.3)] group-hover:scale-105 transition-transform">
                  <span className="font-sora text-lg sm:text-xl font-bold text-[#2DD4BF]">
                    {fromCity.code}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                    Origin
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest block mb-0.5">
                    Departure From
                  </span>
                  <span className="font-sora text-xl sm:text-2xl font-bold text-white block truncate">
                    {fromCity.name}
                  </span>
                  <span className="text-xs text-[#DFC0B8] truncate block mt-0.5">
                    {fromCity.station}
                  </span>
                </div>
              </div>

              {/* Center Route Line & Swap Button */}
              <div className="lg:col-span-4 flex items-center justify-center relative py-2">
                <div className="w-full hidden lg:block">
                  <JourneyLine variant="connector" />
                </div>
                <button
                  type="button"
                  onClick={handleSwapCities}
                  aria-label="Swap origin and destination"
                  className="w-12 h-12 rounded-full bg-[#19202E] border border-white/20 hover:border-[#FF7A59] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
                >
                  <span className="material-symbols-outlined text-[22px] text-[#FF7A59]">
                    swap_horiz
                  </span>
                </button>
              </div>

              {/* Destination Circle Card */}
              <div className="lg:col-span-4 bg-[#0B1220]/90 border border-white/15 rounded-3xl p-5 sm:p-6 flex items-center gap-4 transition-all hover:border-[#FF7A59]/50 shadow-inner group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#151B2A] border-2 border-[#FF7A59] flex flex-col items-center justify-center text-center shrink-0 shadow-[0_0_20px_rgba(255,122,89,0.3)] group-hover:scale-105 transition-transform">
                  <span className="font-sora text-lg sm:text-xl font-bold text-[#FF7A59]">
                    {toCity.code}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                    Target
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest block mb-0.5">
                    Arrival At
                  </span>
                  <span className="font-sora text-xl sm:text-2xl font-bold text-white block truncate">
                    {toCity.name}
                  </span>
                  <span className="text-xs text-[#DFC0B8] truncate block mt-0.5">
                    {toCity.station}
                  </span>
                </div>
              </div>
            </div>

            {/* Travel Date & Mood Chips Desktop Row */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Date selection */}
              <div className="lg:col-span-5 flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#FF7A59]">calendar_today</span>
                  Departure Date
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Today, 14 Nov', 'Tomorrow, 15 Nov', 'Sat, 16 Nov'].map((date) => (
                    <Chip
                      key={date}
                      variant="date"
                      active={selectedDate === date}
                      onClick={() => setSelectedDate(date)}
                    >
                      {date}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Mood preferences */}
              <div className="lg:col-span-5 flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#2DD4BF]">sentiment_satisfied</span>
                  Travel Preference Mood
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Sleep well', icon: '✨' },
                    { label: 'Fastest', icon: '⚡' },
                    { label: 'Budget friendly', icon: '💰' },
                    { label: 'Scenic route', icon: '🌄' },
                  ].map((mood) => (
                    <Chip
                      key={mood.label}
                      variant="mood"
                      active={selectedMood === mood.label}
                      onClick={() => setSelectedMood(mood.label)}
                    >
                      {mood.icon} {mood.label}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Desktop Direct Search CTA */}
              <div className="lg:col-span-2 flex items-end">
                <PillButton
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleSearchBuses}
                  className="shadow-[0_8px_24px_rgba(255,122,89,0.45)] h-[52px]"
                  icon={<span className="material-symbols-outlined text-[20px]">search</span>}
                >
                  Find Buses
                </PillButton>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* JOURNEY RECOMMENDATIONS SECTION: Journeys People Love */}
        <section aria-labelledby="journeys-loved-heading" className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#FF7A59]" />
                <span className="text-xs font-semibold uppercase tracking-widest text-[#FFB4A2]">
                  Curated Travel Diaries
                </span>
              </div>
              <h2 id="journeys-loved-heading" className="font-sora text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Journeys people love
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md">
              Handcrafted intercity routes across Bengal with verified timings, window views, and overnight sleepers.
            </p>
          </div>

          {/* Desktop Responsive Grid: 1 col on mobile, 2 on tablet, 3-4 on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredJourneys.map((story) => (
              <GlassCard
                key={story.id}
                className="flex flex-col justify-between p-6 transition-all duration-300 hover:border-white/30 hover:scale-[1.02] hover:shadow-[0_16px_36px_rgba(0,0,0,0.6)] group"
              >
                <div>
                  {/* Card top tag and price */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-[#2DD4BF]">
                      {story.mood}
                    </span>
                    <div className="text-right">
                      <span className="font-sora text-xl font-bold text-[#FF7A59]">
                        ₹{story.price}
                      </span>
                      <span className="text-[10px] text-gray-400 block -mt-0.5">fare</span>
                    </div>
                  </div>

                  {/* Route ribbon */}
                  <div className="flex items-center justify-between text-xs text-gray-300 font-medium mb-2">
                    <span className="font-sora">{story.from}</span>
                    <span className="text-[#FF7A59]">⟿</span>
                    <span className="font-sora">{story.to}</span>
                  </div>

                  <h3 className="font-sora text-base font-bold text-white mb-2 group-hover:text-[#2DD4BF] transition-colors">
                    {story.title}
                  </h3>

                  <p className="text-xs text-[#DFC0B8] leading-relaxed mb-4 line-clamp-2">
                    {story.highlight}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-gray-400">schedule</span>
                    <span>{story.duration}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFromCity({ name: story.from, code: story.fromCode, station: 'Main Terminal' });
                      setToCity({ name: story.to, code: story.toCode, station: 'Stand' });
                      navigate('/results', {
                        state: { from: story.from, to: story.to, date: selectedDate, mood: story.mood },
                      });
                    }}
                    className="font-sora text-xs font-semibold text-[#FF7A59] group-hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>View buses</span>
                    <span className="material-symbols-outlined text-[14px]">east</span>
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Bottom Bar: Only active on mobile viewport (<768px) */}
      <BottomBar onGo={handleSearchBuses} />
    </div>
  );
};
