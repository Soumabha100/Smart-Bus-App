import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenStorage } from '../utils/tokenStorage';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const user = tokenStorage.getUser();

  // ─────────────────────────────────────────────────────────────
  // 1. JOURNEY PLANNER FORM STATES
  // ─────────────────────────────────────────────────────────────
  const [origin, setOrigin] = useState('Bengaluru, Majestic & Indiranagar');
  const [destination, setDestination] = useState('Goa (Panaji & Madgaon)');
  const [departDate, setDepartDate] = useState('Fri, 24 Oct 2025');
  const [departTimeWindow, setDepartTimeWindow] = useState('09:30 PM (Night Cruise)');
  const [reachDate, setReachDate] = useState('Sat, 25 Oct 2025');
  const [reachCutoff, setReachCutoff] = useState('07:00 AM (Early Fresh)');
  const [budget, setBudget] = useState(1500);

  // Multi-Select Preference Chips
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    'Sleeper Berth',
    'Climate AC',
    'Fastest Non-Stop',
    'Budget Friendly',
  ]);

  // UI Interactive States
  const [isSearching, setIsSearching] = useState(false);
  const [isSwapRotated, setIsSwapRotated] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // AI Copilot States
  const [aiPromptInput, setAiPromptInput] = useState(
    'Find a sleeper bus reaching Panaji before 8 AM with charging ports under ₹1,400'
  );
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────
  // 2. HANDLERS
  // ─────────────────────────────────────────────────────────────
  const handleSwap = () => {
    setIsSwapRotated(!isSwapRotated);
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleTogglePreference = (prefName: string) => {
    if (selectedPreferences.includes(prefName)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== prefName));
    } else {
      setSelectedPreferences([...selectedPreferences, prefName]);
    }
  };

  const handleSearchJourneys = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      navigate('/results', {
        state: {
          from: origin.split(',')[0].trim(),
          to: destination.split('(')[0].trim(),
          date: departDate,
          budget: budget,
          preferences: selectedPreferences,
          mood: selectedPreferences.includes('Fastest Non-Stop')
            ? 'Fastest'
            : selectedPreferences.includes('Sleeper Berth')
            ? 'Sleep well'
            : 'Recommended',
        },
      });
    }, 400);
  };

  const handleBookFeaturedRoute = (routeFrom: string, routeTo: string, routePrice: number) => {
    navigate('/results', {
      state: {
        from: routeFrom,
        to: routeTo,
        date: departDate,
        budget: routePrice,
        mood: 'Recommended',
      },
    });
  };

  const handleRunAiPrompt = (overridePrompt?: string) => {
    const promptText = overridePrompt || aiPromptInput;
    if (overridePrompt) setAiPromptInput(overridePrompt);

    if (promptText.toLowerCase().includes('hyderabad')) {
      setAiResponse(
        'Found 8 Verified Single-Women Sleeper Coaches matching Bengaluru → Hyderabad, Arrival < 07:30 AM, Budget Cap ₹1,200, CCTV & Emergency Alert Shield.'
      );
    } else if (promptText.toLowerCase().includes('pune')) {
      setAiResponse(
        'Found 12 Superfast Multi-Axle AC Coaches matching Mumbai → Pune, Departures after 06:00 PM, Highway Express Priority Lane, ₹449.'
      );
    } else {
      setAiResponse(
        'Found 14 Luxury Sleeper Coaches matching Bengaluru → Panaji, Arrival < 08:00 AM, Price Cap ₹1,400, Guaranteed Type-C Charging Ports.'
      );
    }
  };

  const handleSignOut = () => {
    tokenStorage.clear();
    navigate('/login');
  };

  return (
    <div className="bg-[#0D1320] font-['Inter',sans-serif] text-[#DDE2F5] min-h-screen selection:bg-[#00D0B2]/30 selection:text-[#00D0B2] overflow-x-hidden relative">
      {/* ─────────────────────────────────────────────────────────────
          AMBIENT CANVAS BACKGROUND REFRACTIONS
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-[#FF6B4A]/15 via-[#43EDCD]/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] -left-64 w-[600px] h-[600px] bg-[#43EDCD]/5 blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-[1600px] -right-64 w-[700px] h-[700px] bg-[#FFB4A3]/5 blur-[180px] pointer-events-none -z-10" />

      {/* ─────────────────────────────────────────────────────────────
          HEADER: FIXED DESKTOP & MOBILE NAVIGATION
          ───────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#080E1B]/85 backdrop-blur-2xl border-b border-[#2F3543]/40 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.5)]">
        <div className="h-20 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-6 lg:gap-10">
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF6B4A] to-[#43EDCD] p-0.5 flex items-center justify-center shadow-lg shadow-[#FF6B4A]/25 transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full bg-[#080E1B] rounded-[10px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#FF6B4A] text-[22px]">directions_bus</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-['Sora',sans-serif] text-xl font-bold tracking-tight text-[#DDE2F5] leading-none">
                  Roamly
                </span>
                <span className="text-[10px] text-[#43EDCD] tracking-widest uppercase font-semibold mt-1">
                  Voyage Systems
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="px-4 py-2 rounded-lg font-['Inter',sans-serif] text-sm font-semibold transition-all duration-200 bg-[#242A38] text-[#57FBDB] shadow-[0_0_16px_-4px_rgba(67,237,205,0.25)] border border-[#2F3543]/50"
              >
                Book Journeys
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('live-tracker-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-lg font-['Inter',sans-serif] text-sm text-[#E1BFB8] hover:text-[#DDE2F5] hover:bg-[#1A1F2D] transition-all duration-200"
              >
                Live Tracker
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('journeys-love-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-lg font-['Inter',sans-serif] text-sm text-[#E1BFB8] hover:text-[#DDE2F5] hover:bg-[#1A1F2D] transition-all duration-200"
              >
                Explore Routes
              </button>
              <button
                type="button"
                onClick={() => navigate('/results')}
                className="px-4 py-2 rounded-lg font-['Inter',sans-serif] text-sm text-[#E1BFB8] hover:text-[#DDE2F5] hover:bg-[#1A1F2D] transition-all duration-200"
              >
                My Bookings
              </button>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('copilot-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-lg font-['Inter',sans-serif] text-sm text-[#E1BFB8] hover:text-[#DDE2F5] hover:bg-[#1A1F2D] transition-all duration-200"
              >
                AI Assistant
              </button>
            </nav>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* 24/7 Telematics Support Pill */}
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161B29] border border-[#2F3543]/60 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#43EDCD] animate-pulse" />
              <span className="text-[11px] text-[#57FBDB] uppercase tracking-wider font-semibold">
                24/7 Telematics Support
              </span>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center justify-center h-8 px-2.5 rounded-lg bg-[#161B29] border border-[#2F3543]/50 text-[#DDE2F5] text-xs font-semibold">
              <span className="text-[#BBC6E6]">₹</span>
              <span className="ml-1 text-[11px] text-[#E1BFB8]">INR</span>
            </div>

            <div className="h-6 w-px bg-[#2F3543]/60 hidden sm:block" />

            {/* Profile Avatar & Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2.5 p-1 rounded-full hover:bg-[#1A1F2D] transition-colors focus:outline-none"
              >
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-xs font-semibold text-[#DDE2F5] leading-tight">
                    {user?.name || 'Anya S.'}
                  </span>
                  <span className="text-[10px] text-[#FFB4A3] flex items-center justify-end gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A] inline-block" />
                    Roamly Club
                  </span>
                </div>
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF6B4A] to-[#43EDCD] p-0.5 flex items-center justify-center">
                    <div className="w-full h-full bg-[#1A1F2D] rounded-full flex items-center justify-center text-xs font-bold text-[#DDE2F5]">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#43EDCD] ring-2 ring-[#080E1B]" />
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#1A1F2D] border border-[#2F3543] rounded-xl shadow-2xl p-2 z-50 text-left">
                  <div className="px-3 py-2 border-b border-[#2F3543] mb-1">
                    <p className="text-sm font-semibold text-[#DDE2F5] truncate">
                      {user?.name || 'Anya S.'}
                    </p>
                    <p className="text-xs text-[#E1BFB8] truncate">
                      {user?.email || 'anya.traveler@roamly.com'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/results');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#DDE2F5] hover:bg-[#242A38] rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#43EDCD]">confirmation_number</span>
                    My Bookings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/system-status');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#DDE2F5] hover:bg-[#242A38] rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#BBC6E6]">health_and_safety</span>
                    System Status
                  </button>
                  <div className="border-t border-[#2F3543] my-1" />
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-xs text-[#FF6B4A] hover:bg-[#242A38] rounded-lg transition-colors flex items-center gap-2 font-medium"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-[#E1BFB8] hover:text-[#DDE2F5] hover:bg-[#1A1F2D] transition-colors"
              aria-label="Toggle Navigation"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#080E1B] border-b border-[#2F3543] px-4 py-3 space-y-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/home');
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold bg-[#242A38] text-[#57FBDB]"
            >
              Book Journeys
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('live-tracker-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#E1BFB8] hover:bg-[#1A1F2D]"
            >
              Live Tracker
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('journeys-love-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#E1BFB8] hover:bg-[#1A1F2D]"
            >
              Explore Routes
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/results');
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#E1BFB8] hover:bg-[#1A1F2D]"
            >
              My Bookings
            </button>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT
          ───────────────────────────────────────────────────────────── */}
      <main className="w-full pt-24 sm:pt-28 pb-16 bg-[#0D1320] min-h-[calc(100vh-20rem)]">
        <div className="flex flex-col w-full relative">
          {/* ─────────────────────────────────────────────────────────
              SECTION 1: HERO & SMART JOURNEY PLANNER
              ───────────────────────────────────────────────────────── */}
          <section className="w-full px-4 sm:px-6 lg:px-12 pt-4 pb-12 flex flex-col items-center">
            {/* Header Callout & Title */}
            <div className="max-w-4xl text-center flex flex-col items-center gap-3 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161B29] border border-[#2F3543]/60 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#43EDCD] animate-ping" />
                <span className="text-xs text-[#57FBDB] uppercase tracking-widest font-semibold">
                  AI-Powered Route Optimization • Live Bus Tracking
                </span>
              </div>
              <h1 className="font-['Sora',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#DDE2F5] leading-tight">
                Where would you like to{' '}
                <span className="bg-gradient-to-r from-[#FF6B4A] via-[#FFB4A3] to-[#43EDCD] bg-clip-text text-transparent">
                  travel today?
                </span>
              </h1>
              <p className="font-['Inter',sans-serif] text-sm sm:text-base text-[#BBC6E6] max-w-2xl font-light">
                Plan your journey. We'll find the right bus for you with precision arrival telemetry and instant fare matching.
              </p>
            </div>

            {/* PRIMARY INTERACTIVE JOURNEY PLANNER CARD */}
            <div className="w-full max-w-6xl bg-[#1A1F2D]/90 backdrop-blur-2xl rounded-[1.75rem] border border-[#2F3543]/60 p-5 sm:p-8 md:p-10 shadow-2xl relative">
              {/* Top Accent Line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#43EDCD]/40 to-transparent" />

              <form onSubmit={handleSearchJourneys} className="flex flex-col gap-6">
                {/* ROW 1: ORIGIN & DESTINATION WITH FLOATING SWAP */}
                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                  {/* FROM FIELD */}
                  <div className="relative flex flex-col p-4 rounded-xl bg-[#080E1B] border border-[#2F3543]/60 focus-within:border-[#FF6B4A] focus-within:bg-[#161B29] transition-all">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-[#FF6B4A] flex items-center gap-1 uppercase tracking-wider font-semibold">
                        <span className="material-symbols-outlined text-base">near_me</span>
                        From / Departing From
                      </span>
                      <span className="text-[10px] text-[#BBC6E6] bg-[#2F3543]/40 px-2 py-0.5 rounded-full font-medium">
                        Origin Hub
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[#FF6B4A] text-2xl">pin_drop</span>
                      <input
                        type="text"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        placeholder="Enter departure city or terminal"
                        className="w-full bg-transparent text-[#DDE2F5] font-['Sora',sans-serif] text-sm sm:text-base font-semibold focus:outline-none placeholder:text-[#E1BFB8]/40"
                      />
                      {origin && (
                        <button
                          type="button"
                          onClick={() => setOrigin('')}
                          className="text-[#E1BFB8] hover:text-[#DDE2F5] transition-colors p-1"
                          title="Clear input"
                        >
                          <span className="material-symbols-outlined text-base">close</span>
                        </button>
                      )}
                    </div>
                    {/* Quick Boarding Pills */}
                    <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                      <span className="text-[10px] text-[#E1BFB8]">Popular boarding:</span>
                      <button
                        type="button"
                        onClick={() => setOrigin('Bengaluru (Silk Board)')}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#2F3543]/40 hover:bg-[#2F3543] text-[#DDE2F5] transition-colors"
                      >
                        Silk Board
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrigin('Bengaluru (Koramangala)')}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#2F3543]/40 hover:bg-[#2F3543] text-[#DDE2F5] transition-colors"
                      >
                        Koramangala
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrigin('Kolkata (Esplanade Terminal)')}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#2F3543]/40 hover:bg-[#2F3543] text-[#DDE2F5] transition-colors"
                      >
                        Kolkata Esplanade
                      </button>
                    </div>
                  </div>

                  {/* SWAP BUTTON (Floating on Desktop, centered on Mobile) */}
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-20 self-center w-12 h-12 rounded-full bg-[#242A38] text-[#43EDCD] hover:text-[#080E1B] hover:bg-[#00D0B2] border border-[#2F3543] transition-all flex items-center justify-center shadow-lg group cursor-pointer"
                    title="Swap Origin and Destination"
                  >
                    <span
                      className={`material-symbols-outlined text-xl transition-transform duration-300 ${
                        isSwapRotated ? 'rotate-180' : ''
                      } group-hover:rotate-180`}
                    >
                      sync_alt
                    </span>
                  </button>

                  {/* TO FIELD */}
                  <div className="relative flex flex-col p-4 rounded-xl bg-[#080E1B] border border-[#2F3543]/60 focus-within:border-[#43EDCD] focus-within:bg-[#161B29] transition-all">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-[#43EDCD] flex items-center gap-1 uppercase tracking-wider font-semibold">
                        <span className="material-symbols-outlined text-base">location_on</span>
                        To / Arriving At
                      </span>
                      <span className="text-[10px] text-[#57FBDB] bg-[#43EDCD]/10 px-2 py-0.5 rounded-full font-medium">
                        Destination
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[#43EDCD] text-2xl">flag</span>
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Enter destination town or drop point"
                        className="w-full bg-transparent text-[#DDE2F5] font-['Sora',sans-serif] text-sm sm:text-base font-semibold focus:outline-none placeholder:text-[#E1BFB8]/40"
                      />
                      {destination && (
                        <button
                          type="button"
                          onClick={() => setDestination('')}
                          className="text-[#E1BFB8] hover:text-[#DDE2F5] transition-colors p-1"
                          title="Clear input"
                        >
                          <span className="material-symbols-outlined text-base">close</span>
                        </button>
                      )}
                    </div>
                    {/* Quick Drop-off Pills */}
                    <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                      <span className="text-[10px] text-[#E1BFB8]">Top drop-offs:</span>
                      <button
                        type="button"
                        onClick={() => setDestination('Goa (Mapusa Junction)')}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#2F3543]/40 hover:bg-[#2F3543] text-[#DDE2F5] transition-colors"
                      >
                        Mapusa
                      </button>
                      <button
                        type="button"
                        onClick={() => setDestination('Goa (Calangute Circle)')}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#2F3543]/40 hover:bg-[#2F3543] text-[#DDE2F5] transition-colors"
                      >
                        Calangute
                      </button>
                      <button
                        type="button"
                        onClick={() => setDestination('Siliguri (Tenzing Norgay)')}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#2F3543]/40 hover:bg-[#2F3543] text-[#DDE2F5] transition-colors"
                      >
                        Siliguri
                      </button>
                    </div>
                  </div>
                </div>

                {/* QUICK DESTINATION PILLS / HOT ROUTES */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-xs text-[#BBC6E6] uppercase tracking-wider flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-sm">trending_up</span> Hot Routes:
                  </span>
                  {['Mumbai', 'Hyderabad', 'Coimbatore', 'Chennai', 'Manali', 'Pune', 'Darjeeling'].map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setDestination(`${city} Terminal Hub`)}
                      className="px-3 py-1 rounded-full bg-[#161B29] hover:bg-[#2F3543] text-[#DDE2F5] text-xs transition-colors border border-[#2F3543]/50"
                    >
                      {city}
                    </button>
                  ))}
                </div>

                {/* ROW 2: DEPARTURE & REACH-BY ARRIVAL REQUIREMENT */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* DEPARTURE SCHEDULE */}
                  <div className="p-4 rounded-xl bg-[#080E1B] border border-[#2F3543]/60 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#DDE2F5] font-semibold flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#FF6B4A]">directions_bus</span>
                        Departure Schedule
                      </span>
                      <span className="text-[10px] text-[#E1BFB8]">Recommended: Evening</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-[#161B29] border border-[#2F3543]/50 flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[#E1BFB8] text-lg">calendar_today</span>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-[#E1BFB8]">Date</span>
                          <input
                            type="text"
                            value={departDate}
                            onChange={(e) => setDepartDate(e.target.value)}
                            className="bg-transparent text-[#DDE2F5] text-xs font-semibold focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-[#161B29] border border-[#2F3543]/50 flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[#E1BFB8] text-lg">schedule</span>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-[#E1BFB8]">Time Window</span>
                          <input
                            type="text"
                            value={departTimeWindow}
                            onChange={(e) => setDepartTimeWindow(e.target.value)}
                            className="bg-transparent text-[#DDE2F5] text-xs font-semibold focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* REACH-BY REQUIREMENT */}
                  <div className="p-4 rounded-xl bg-[#080E1B] border border-[#2F3543]/60 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#43EDCD] font-semibold flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#43EDCD]">alarm_on</span>
                        Required Arrival (Reach-By)
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#43EDCD]/15 text-[#57FBDB] flex items-center gap-1 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#43EDCD]" /> Guaranteed On-Time Match
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-[#161B29] border border-[#2F3543]/50 flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[#E1BFB8] text-lg">event_available</span>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-[#E1BFB8]">Reach Date</span>
                          <input
                            type="text"
                            value={reachDate}
                            onChange={(e) => setReachDate(e.target.value)}
                            className="bg-transparent text-[#DDE2F5] text-xs font-semibold focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-[#161B29] border border-[#2F3543]/50 flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[#43EDCD] text-lg">timer</span>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-[#57FBDB]">Before Morning Cutoff</span>
                          <input
                            type="text"
                            value={reachCutoff}
                            onChange={(e) => setReachCutoff(e.target.value)}
                            className="bg-transparent text-[#DDE2F5] text-xs font-semibold focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ROW 3: BUDGET SELECTOR */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#080E1B] border border-[#2F3543]/60 flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="font-['Sora',sans-serif] text-sm sm:text-base text-[#DDE2F5] font-semibold flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#FF6B4A]">currency_rupee</span>
                        Your Maximum Travel Budget
                      </span>
                      <span className="text-xs text-[#BBC6E6]">
                        Strictly filters verified coaches &amp; berths within your price limit
                      </span>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-xs text-[#E1BFB8]">Max Cap:</span>
                      <div className="px-3.5 py-1.5 rounded-full bg-[#FF6B4A]/20 border border-[#FF6B4A]/40 flex items-center gap-1 shadow-[0_0_16px_-4px_rgba(255,107,74,0.4)]">
                        <span className="font-['Sora',sans-serif] text-sm sm:text-base font-bold text-[#FFB4A3]">₹</span>
                        <span className="font-['Sora',sans-serif] text-sm sm:text-base font-bold text-[#FFB4A3]">
                          {budget.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-[#BBC6E6] ml-1">/ berth</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Slider */}
                  <div className="flex flex-col gap-2 pt-1">
                    <input
                      type="range"
                      min="500"
                      max="3500"
                      step="50"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full accent-[#43EDCD] cursor-pointer h-2 bg-[#242A38] rounded-lg appearance-none"
                    />
                    {/* Scale Marks */}
                    <div className="flex items-center justify-between text-[#E1BFB8] text-[11px] px-1">
                      <span>Min ₹500</span>
                      <span>₹800</span>
                      <span>₹1,200</span>
                      <span className="text-[#43EDCD] font-bold">₹1,500</span>
                      <span>₹2,000</span>
                      <span>Max ₹3,500</span>
                    </div>
                  </div>

                  {/* Quick Preset Chips */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-[#E1BFB8]">Fast Presets:</span>
                    {[
                      { label: '₹800 Saver', val: 800 },
                      { label: '₹1,200 Balanced', val: 1200 },
                      { label: '₹1,500 Popular', val: 1500 },
                      { label: '₹2,200 Luxury Sleeper', val: 2200 },
                    ].map((preset) => (
                      <button
                        key={preset.val}
                        type="button"
                        onClick={() => setBudget(preset.val)}
                        className={`px-3 py-1 rounded text-xs transition-colors ${
                          budget === preset.val
                            ? 'bg-[#43EDCD]/15 text-[#43EDCD] border border-[#43EDCD]/40 font-semibold'
                            : 'bg-[#161B29] hover:bg-[#2F3543] text-[#DDE2F5] border border-[#2F3543]/50'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ROW 4: TRAVEL PREFERENCES & AMENITIES CHIPS (MULTI-SELECT) */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-[#DDE2F5] font-semibold flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#43EDCD]">tune</span>
                      Travel Preferences &amp; Coach Configuration (Multi-select)
                    </span>
                    <span className="text-[11px] text-[#BBC6E6]">Real-time telematics filters</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { name: 'Sleeper Berth', icon: 'airline_seat_flat', color: 'coral' },
                      { name: 'Seater Recliner', icon: 'airline_seat_recline_extra', color: 'coral' },
                      { name: 'Climate AC', icon: 'ac_unit', color: 'teal' },
                      { name: 'Natural Air', icon: 'mode_fan', color: 'teal' },
                      { name: 'Fastest Non-Stop', icon: 'bolt', color: 'teal', extra: 'Save 1h 40m' },
                      { name: 'Budget Friendly', icon: 'savings', color: 'coral', extra: 'Under ₹1,500' },
                      { name: 'Western Ghats Scenic', icon: 'landscape', color: 'teal' },
                      { name: 'Single Women Reserved', icon: 'shield_person', color: 'teal' },
                    ].map((pref) => {
                      const isSelected = selectedPreferences.includes(pref.name);
                      const isCoral = pref.color === 'coral';
                      return (
                        <button
                          key={pref.name}
                          type="button"
                          onClick={() => handleTogglePreference(pref.name)}
                          className={`px-3.5 py-2 rounded-full text-xs flex items-center gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? isCoral
                                ? 'bg-[#FF6B4A] text-[#080E1B] font-bold shadow-[0_0_16px_-4px_rgba(255,107,74,0.4)]'
                                : 'bg-[#43EDCD] text-[#080E1B] font-bold shadow-[0_0_16px_-4px_rgba(67,237,205,0.4)]'
                              : 'bg-[#161B29] text-[#E1BFB8] hover:text-[#DDE2F5] hover:bg-[#242A38] border border-[#2F3543]/50'
                          }`}
                        >
                          <span className="material-symbols-outlined text-base">{pref.icon}</span>
                          <span>{pref.name}</span>
                          {pref.extra && (
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                isSelected
                                  ? 'bg-[#080E1B]/30 text-[#080E1B]'
                                  : 'bg-[#2F3543]/50 text-[#BBC6E6]'
                              }`}
                            >
                              {pref.extra}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* PRIMARY CTA BUTTON & REAL-TIME MATCH BANNER */}
                <div className="flex flex-col items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="w-full sm:w-auto min-w-[320px] px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF6B4A] via-[#FF6B4A] to-[#43EDCD] text-[#080E1B] font-['Sora',sans-serif] text-base font-bold tracking-tight shadow-[0_0_30px_-5px_rgba(255,107,74,0.5)] hover:shadow-[0_0_40px_-2px_rgba(67,237,205,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-80"
                  >
                    {isSearching ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                        <span>Calculating Real-time Corridors...</span>
                      </>
                    ) : (
                      <>
                        <span>Find My Smart Journey</span>
                        <span className="material-symbols-outlined text-2xl group-hover:translate-x-1.5 transition-transform">
                          arrow_forward
                        </span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2 text-[#57FBDB] text-xs bg-[#43EDCD]/10 px-4 py-1.5 rounded-full border border-[#43EDCD]/20 text-center">
                    <span className="material-symbols-outlined text-base text-[#43EDCD]">verified</span>
                    <span>
                      48 verified luxury buses match your timing (
                      <span className="font-bold text-[#DDE2F5]">Reach by {reachCutoff.split(' ')[0]}</span>) &amp; ₹
                      {budget.toLocaleString('en-IN')} budget
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────
              SECTION 2: THE "JOURNEY LINE" LIVE TELEMETRICS VISUALIZATION
              ───────────────────────────────────────────────────────── */}
          <section id="live-tracker-section" className="w-full px-4 sm:px-6 lg:px-12 py-10">
            <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <span className="text-xs text-[#43EDCD] uppercase tracking-widest flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-base">satellite_alt</span>
                    Live Waypoint Telemetry
                  </span>
                  <h2 className="font-['Sora',sans-serif] text-2xl sm:text-3xl font-bold text-[#DDE2F5] mt-1">
                    Smart Route AI Progress Ribbon
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-[#161B29] px-3.5 py-1.5 rounded-full border border-[#2F3543]/50">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#43EDCD] animate-pulse" />
                    <span className="text-xs text-[#DDE2F5]">Trip RL-409: In Transit</span>
                  </div>
                  <span className="text-xs text-[#FFB4A3] font-bold bg-[#FF6B4A]/10 border border-[#FF6B4A]/30 px-3 py-1 rounded-full">
                    99.4% On-Time Index
                  </span>
                </div>
              </div>

              {/* Main Journey Pathway Card */}
              <div className="w-full bg-[#161B29] border border-[#2F3543]/60 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                {/* Live Route Metrics Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-[#2F3543]/40 mb-6">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[#BBC6E6]">Departed Origin</span>
                    <span className="font-['Sora',sans-serif] text-base sm:text-lg font-semibold text-[#DDE2F5]">
                      10:15 PM
                    </span>
                    <span className="text-[11px] text-[#E1BFB8]">Bengaluru Majestic Terminal</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[#BBC6E6]">Current Speed &amp; Cabin</span>
                    <span className="font-['Sora',sans-serif] text-base sm:text-lg font-semibold text-[#43EDCD] flex items-center gap-1">
                      74 km/h <span className="text-xs text-[#E1BFB8] font-normal">| 22.5°C</span>
                    </span>
                    <span className="text-[11px] text-[#E1BFB8]">Optimal cruising trajectory</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[#BBC6E6]">Smart Rest Stop</span>
                    <span className="font-['Sora',sans-serif] text-base sm:text-lg font-semibold text-[#DDE2F5]">
                      Hubballi Food Plaza
                    </span>
                    <span className="text-[11px] text-[#57FBDB]">25 min bio-break concluded</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[#BBC6E6]">Predicted Arrival (ETA)</span>
                    <span className="font-['Sora',sans-serif] text-base sm:text-lg font-bold text-[#FF6B4A]">
                      06:48 AM
                    </span>
                    <span className="text-[11px] text-[#57FBDB]">12 min ahead of schedule</span>
                  </div>
                </div>

                {/* SVG Journey Ribbon Visualizer */}
                <div className="relative py-8">
                  {/* Timeline Track Background */}
                  <div className="relative flex items-center justify-between w-full">
                    {/* Background line */}
                    <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1.5 bg-[#2F3543]/50 rounded-full" />
                    {/* Completed portion fill (65%) */}
                    <div className="absolute left-6 w-[65%] top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-[#00D0B2] via-[#43EDCD] to-[#FF6B4A] rounded-full shadow-[0_0_12px_rgba(67,237,205,0.6)]" />

                    {/* NODE 1: BENGALURU */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-[#43EDCD] flex items-center justify-center text-[#080E1B] shadow-lg">
                        <span className="material-symbols-outlined text-lg">check</span>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-[#DDE2F5] mt-2">Bengaluru</span>
                      <span className="text-[10px] text-[#E1BFB8]">10:15 PM Dep</span>
                    </div>

                    {/* NODE 2: TUMAKURU */}
                    <div className="relative z-10 flex flex-col items-center text-center hidden sm:flex">
                      <div className="w-7 h-7 rounded-full bg-[#00D0B2] flex items-center justify-center text-[#080E1B] shadow-md">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#080E1B]" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-[#DDE2F5] mt-2">Tumakuru</span>
                      <span className="text-[10px] text-[#E1BFB8]">11:32 PM</span>
                    </div>

                    {/* NODE 3: HUBBALLI */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-8 h-8 rounded-full bg-[#43EDCD] flex items-center justify-center text-[#080E1B] shadow-lg">
                        <span className="material-symbols-outlined text-sm">restaurant</span>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-[#DDE2F5] mt-2">Hubballi Hub</span>
                      <span className="text-[10px] text-[#57FBDB]">03:40 AM (Rest)</span>
                    </div>

                    {/* LIVE BUS POSITION PULSE */}
                    <div className="relative z-20 flex flex-col items-center text-center -mt-6">
                      <div className="relative flex items-center justify-center">
                        <span className="absolute w-12 h-12 rounded-full bg-[#FF6B4A]/30 animate-ping" />
                        <div className="w-10 h-10 rounded-full bg-[#FF6B4A] flex items-center justify-center text-[#080E1B] shadow-[0_0_20px_rgba(255,107,74,0.7)]">
                          <span className="material-symbols-outlined text-xl">directions_bus</span>
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-[#FF6B4A] mt-2">Belagavi Bypass</span>
                      <span className="text-[10px] text-[#FFB4A3] font-mono">Current 05:10 AM</span>
                    </div>

                    {/* NODE 4: GOA */}
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-[#242A38] border-2 border-[#43EDCD]/60 flex items-center justify-center text-[#43EDCD] shadow-lg">
                        <span className="material-symbols-outlined text-lg">flag</span>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-[#DDE2F5] mt-2">Goa (Panaji)</span>
                      <span className="text-[10px] text-[#BBC6E6]">Est. 06:48 AM</span>
                    </div>
                  </div>
                </div>

                {/* Telematics Weather & Road Sensor Strip */}
                <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-[#2F3543]/30 mt-4 text-xs">
                  <div className="flex items-center gap-4 text-[#E1BFB8] flex-wrap">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#43EDCD]">thermostat</span> Dry, 21°C Road Surface
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#43EDCD]">shield</span> Twin-driver rest switch verified
                    </span>
                    <span className="flex items-center gap-1 hidden md:flex">
                      <span className="material-symbols-outlined text-sm text-[#43EDCD]">wifi</span> High-throughput 5G Active
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/results')}
                    className="text-[#43EDCD] hover:text-[#57FBDB] flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                  >
                    <span>Open High-Res Satellite Telematics</span>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────
              SECTION 3: "JOURNEYS PEOPLE LOVE" SECTION
              ───────────────────────────────────────────────────────── */}
          <section id="journeys-love-section" className="w-full px-4 sm:px-6 lg:px-12 py-12 bg-[#080E1B]/60">
            <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <span className="text-xs text-[#FF6B4A] uppercase tracking-widest flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-base">favorite</span>
                    Top Rated Nocturnal Cruises
                  </span>
                  <h2 className="font-['Sora',sans-serif] text-2xl sm:text-3xl font-bold text-[#DDE2F5] mt-1">
                    Journeys People Love
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/results')}
                  className="text-xs sm:text-sm text-[#43EDCD] hover:text-[#57FBDB] flex items-center gap-1 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <span>View all 120+ active routes</span>
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              </div>

              {/* 4 Route Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* CARD 1: Bengaluru to Goa */}
                <div className="flex flex-col bg-[#1A1F2D] border border-[#2F3543]/60 rounded-2xl p-4 hover:-translate-y-1.5 transition-all shadow-md group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#FF6B4A]/20 text-[#FF6B4A] text-[10px] font-semibold">
                      Overnight Sleeper
                    </span>
                    <div className="flex items-center gap-1 text-[#43EDCD] text-xs font-bold">
                      <span className="material-symbols-outlined text-sm text-[#43EDCD]">star</span>
                      <span>4.9</span>
                      <span className="text-[#E1BFB8] font-normal text-[10px]">(1.4k)</span>
                    </div>
                  </div>
                  <div className="h-32 rounded-xl mb-3 relative overflow-hidden bg-[#242A38]">
                    <div className="w-full h-full bg-gradient-to-tr from-[#161B29] to-[#242A38] flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-[#FF6B4A]/40">directions_bus</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1F2D] via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[10px] text-[#DDE2F5] bg-[#080E1B]/80 px-2 py-0.5 rounded backdrop-blur-md">
                      Scania Multiaxle
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 mb-3">
                    <h3 className="font-['Sora',sans-serif] text-base font-bold text-[#DDE2F5]">
                      Bengaluru → Goa
                    </h3>
                    <span className="text-xs text-[#BBC6E6]">Dep: 09:30 PM • Reach 06:45 AM</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#2F3543]/40 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#E1BFB8]">Fares from</span>
                      <span className="font-['Sora',sans-serif] text-base font-bold text-[#FF6B4A]">₹1,299</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleBookFeaturedRoute('Bengaluru', 'Goa', 1299)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#242A38] hover:bg-[#43EDCD] hover:text-[#080E1B] text-[#DDE2F5] text-xs font-semibold transition-all cursor-pointer"
                    >
                      Book Seat
                    </button>
                  </div>
                </div>

                {/* CARD 2: Mumbai to Pune */}
                <div className="flex flex-col bg-[#1A1F2D] border border-[#2F3543]/60 rounded-2xl p-4 hover:-translate-y-1.5 transition-all shadow-md group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#43EDCD]/15 text-[#43EDCD] text-[10px] font-semibold">
                      Express Hyperlink
                    </span>
                    <div className="flex items-center gap-1 text-[#43EDCD] text-xs font-bold">
                      <span className="material-symbols-outlined text-sm text-[#43EDCD]">star</span>
                      <span>4.8</span>
                      <span className="text-[#E1BFB8] font-normal text-[10px]">(3.1k)</span>
                    </div>
                  </div>
                  <div className="h-32 rounded-xl mb-3 relative overflow-hidden bg-[#242A38]">
                    <div className="w-full h-full bg-gradient-to-tr from-[#161B29] to-[#242A38] flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-[#43EDCD]/40">bolt</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1F2D] via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[10px] text-[#DDE2F5] bg-[#080E1B]/80 px-2 py-0.5 rounded backdrop-blur-md">
                      Electric Volvo
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 mb-3">
                    <h3 className="font-['Sora',sans-serif] text-base font-bold text-[#DDE2F5]">
                      Mumbai → Pune
                    </h3>
                    <span className="text-xs text-[#BBC6E6]">Hourly departures • 3h 15m</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#2F3543]/40 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#E1BFB8]">Fares from</span>
                      <span className="font-['Sora',sans-serif] text-base font-bold text-[#43EDCD]">₹649</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleBookFeaturedRoute('Mumbai', 'Pune', 649)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#242A38] hover:bg-[#43EDCD] hover:text-[#080E1B] text-[#DDE2F5] text-xs font-semibold transition-all cursor-pointer"
                    >
                      Book Seat
                    </button>
                  </div>
                </div>

                {/* CARD 3: Delhi to Manali */}
                <div className="flex flex-col bg-[#1A1F2D] border border-[#2F3543]/60 rounded-2xl p-4 hover:-translate-y-1.5 transition-all shadow-md group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#FF6B4A]/20 text-[#FF6B4A] text-[10px] font-semibold">
                      Nordic Sleeper
                    </span>
                    <div className="flex items-center gap-1 text-[#43EDCD] text-xs font-bold">
                      <span className="material-symbols-outlined text-sm text-[#43EDCD]">star</span>
                      <span>4.9</span>
                      <span className="text-[#E1BFB8] font-normal text-[10px]">(980)</span>
                    </div>
                  </div>
                  <div className="h-32 rounded-xl mb-3 relative overflow-hidden bg-[#242A38]">
                    <div className="w-full h-full bg-gradient-to-tr from-[#161B29] to-[#242A38] flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-[#FF6B4A]/40">ac_unit</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1F2D] via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[10px] text-[#DDE2F5] bg-[#080E1B]/80 px-2 py-0.5 rounded backdrop-blur-md">
                      Heated Berths
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 mb-3">
                    <h3 className="font-['Sora',sans-serif] text-base font-bold text-[#DDE2F5]">
                      Delhi → Manali
                    </h3>
                    <span className="text-xs text-[#BBC6E6]">Dep: 06:00 PM • Reach 07:30 AM</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#2F3543]/40 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#E1BFB8]">Fares from</span>
                      <span className="font-['Sora',sans-serif] text-base font-bold text-[#FF6B4A]">₹1,450</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleBookFeaturedRoute('Delhi', 'Manali', 1450)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#242A38] hover:bg-[#43EDCD] hover:text-[#080E1B] text-[#DDE2F5] text-xs font-semibold transition-all cursor-pointer"
                    >
                      Book Seat
                    </button>
                  </div>
                </div>

                {/* CARD 4: Hyderabad to Bengaluru */}
                <div className="flex flex-col bg-[#1A1F2D] border border-[#2F3543]/60 rounded-2xl p-4 hover:-translate-y-1.5 transition-all shadow-md group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#43EDCD]/15 text-[#43EDCD] text-[10px] font-semibold">
                      Night Glider
                    </span>
                    <div className="flex items-center gap-1 text-[#43EDCD] text-xs font-bold">
                      <span className="material-symbols-outlined text-sm text-[#43EDCD]">star</span>
                      <span>4.8</span>
                      <span className="text-[#E1BFB8] font-normal text-[10px]">(2.2k)</span>
                    </div>
                  </div>
                  <div className="h-32 rounded-xl mb-3 relative overflow-hidden bg-[#242A38]">
                    <div className="w-full h-full bg-gradient-to-tr from-[#161B29] to-[#242A38] flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-[#43EDCD]/40">nightlight</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1F2D] via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 text-[10px] text-[#DDE2F5] bg-[#080E1B]/80 px-2 py-0.5 rounded backdrop-blur-md">
                      Twin Axle AC
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 mb-3">
                    <h3 className="font-['Sora',sans-serif] text-base font-bold text-[#DDE2F5]">
                      Hyderabad → BLR
                    </h3>
                    <span className="text-xs text-[#BBC6E6]">Dep: 10:00 PM • Reach 06:15 AM</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#2F3543]/40 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#E1BFB8]">Fares from</span>
                      <span className="font-['Sora',sans-serif] text-base font-bold text-[#43EDCD]">₹1,199</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleBookFeaturedRoute('Hyderabad', 'Bengaluru', 1199)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#242A38] hover:bg-[#43EDCD] hover:text-[#080E1B] text-[#DDE2F5] text-xs font-semibold transition-all cursor-pointer"
                    >
                      Book Seat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────
              SECTION 4: DESTINATION RECOMMENDATIONS & SMART TRAVEL INSIGHTS
              ───────────────────────────────────────────────────────── */}
          <section className="w-full px-4 sm:px-6 lg:px-12 py-12">
            <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
              <div className="flex flex-col">
                <span className="text-xs text-[#43EDCD] uppercase tracking-widest flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-base">explore</span>
                  Weekend Escapes &amp; Curated Getaways
                </span>
                <h2 className="font-['Sora',sans-serif] text-2xl sm:text-3xl font-bold text-[#DDE2F5] mt-1">
                  Smart Travel Recommendations
                </h2>
                <p className="text-xs sm:text-sm text-[#BBC6E6]">
                  Optimized routes paired with weather reports and early morning drop points.
                </p>
              </div>

              {/* Bento-style Getaway Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* ITEM 1: Ooty */}
                <div className="flex flex-col rounded-2xl bg-[#161B29] border border-[#2F3543]/60 p-6 relative overflow-hidden group hover:bg-[#1A1F2D] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#FF6B4A] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">forest</span> Nilgiri Hills
                    </span>
                    <span className="text-xs text-[#43EDCD] font-mono">6h 45m Direct</span>
                  </div>
                  <h3 className="font-['Sora',sans-serif] text-lg font-bold text-[#DDE2F5] mb-1">
                    Ooty &amp; Nilgiri Heights
                  </h3>
                  <p className="text-xs text-[#BBC6E6] mb-4 leading-relaxed">
                    Crisp mountain morning arrivals. Enjoy botanical misty strolls with zero check-in waiting time.
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#2F3543]/40">
                    <span className="text-[11px] text-[#E1BFB8]">Best window: Thu - Sun</span>
                    <span className="text-xs font-semibold text-[#43EDCD]">From ₹899</span>
                  </div>
                </div>

                {/* ITEM 2: Gokarna */}
                <div className="flex flex-col rounded-2xl bg-[#161B29] border border-[#2F3543]/60 p-6 relative overflow-hidden group hover:bg-[#1A1F2D] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#43EDCD] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">waves</span> Arabian Coastline
                    </span>
                    <span className="text-xs text-[#43EDCD] font-mono">8h 15m Overnight</span>
                  </div>
                  <h3 className="font-['Sora',sans-serif] text-lg font-bold text-[#DDE2F5] mb-1">
                    Gokarna Quiet Shores
                  </h3>
                  <p className="text-xs text-[#BBC6E6] mb-4 leading-relaxed">
                    Pristine beach trekking and serene cafes. Bus drops you steps away from Kudle beach trailheads.
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#2F3543]/40">
                    <span className="text-[11px] text-[#E1BFB8]">Best window: Fri night dep</span>
                    <span className="text-xs font-semibold text-[#43EDCD]">From ₹1,120</span>
                  </div>
                </div>

                {/* ITEM 3: Hampi */}
                <div className="flex flex-col rounded-2xl bg-[#161B29] border border-[#2F3543]/60 p-6 relative overflow-hidden group hover:bg-[#1A1F2D] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#FF6B4A] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">temple_hindu</span> Heritage Boulders
                    </span>
                    <span className="text-xs text-[#43EDCD] font-mono">7h 00m Direct</span>
                  </div>
                  <h3 className="font-['Sora',sans-serif] text-lg font-bold text-[#DDE2F5] mb-1">
                    Hampi Ruins &amp; River
                  </h3>
                  <p className="text-xs text-[#BBC6E6] mb-4 leading-relaxed">
                    Sunrise over Matanga Hill. Direct night sleepers ensure you wake up recharged right at the temple ruins.
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#2F3543]/40">
                    <span className="text-[11px] text-[#E1BFB8]">Best window: Oct - Feb</span>
                    <span className="text-xs font-semibold text-[#43EDCD]">From ₹950</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─────────────────────────────────────────────────────────
              SECTION 5: "AI TRAVEL ASSISTANT" (ROAMLY COPILOT WIDGET)
              ───────────────────────────────────────────────────────── */}
          <section id="copilot-section" className="w-full px-4 sm:px-6 lg:px-12 py-10 mb-4">
            <div className="w-full max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-[#242A38] via-[#1A1F2D] to-[#080E1B] border border-[#2F3543]/70 p-6 sm:p-8 shadow-2xl relative">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#43EDCD] to-[#FF6B4A] flex items-center justify-center text-[#080E1B] shadow-lg">
                    <span className="material-symbols-outlined text-2xl">neurology</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="font-['Sora',sans-serif] text-lg sm:text-xl font-bold text-[#DDE2F5]">
                        Roamly Copilot AI
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#43EDCD]/15 text-[#43EDCD] font-semibold border border-[#43EDCD]/30">
                        Natural Query
                      </span>
                    </div>
                    <p className="text-xs text-[#BBC6E6]">
                      Describe your journey in everyday words, our agent structures the schedule.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-[#E1BFB8] flex items-center gap-1.5 self-start md:self-auto">
                  <span className="w-2 h-2 rounded-full bg-[#43EDCD]" /> 24/7 Telemetry Assistant
                </span>
              </div>

              {/* Natural Search Input Field */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#080E1B] border border-[#2F3543]/60 shadow-inner mb-3">
                <span className="material-symbols-outlined text-[#43EDCD] text-2xl pl-2">auto_awesome</span>
                <input
                  type="text"
                  value={aiPromptInput}
                  onChange={(e) => setAiPromptInput(e.target.value)}
                  placeholder="Describe your journey in natural words..."
                  className="w-full bg-transparent text-[#DDE2F5] text-xs sm:text-sm focus:outline-none placeholder:text-[#E1BFB8]/40"
                />
                <button
                  type="button"
                  onClick={() => handleRunAiPrompt()}
                  className="px-4 py-2.5 rounded-lg bg-[#43EDCD] text-[#080E1B] text-xs sm:text-sm font-semibold hover:bg-[#57FBDB] transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <span>Search</span>
                  <span className="material-symbols-outlined text-base">send</span>
                </button>
              </div>

              {/* Quick AI Suggestion Chips */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-[#BBC6E6]">Try asking:</span>
                <button
                  type="button"
                  onClick={() => handleRunAiPrompt('Solo female quiet sleeper to Hyderabad under ₹1,200')}
                  className="text-[11px] px-3 py-1 rounded-full bg-[#1A1F2D] hover:bg-[#242A38] text-[#E1BFB8] hover:text-[#DDE2F5] transition-colors border border-[#2F3543]/40 cursor-pointer"
                >
                  "Solo female quiet sleeper to Hyderabad under ₹1,200"
                </button>
                <button
                  type="button"
                  onClick={() => handleRunAiPrompt('Fastest AC bus from Mumbai to Pune departing after 6 PM')}
                  className="text-[11px] px-3 py-1 rounded-full bg-[#1A1F2D] hover:bg-[#242A38] text-[#E1BFB8] hover:text-[#DDE2F5] transition-colors border border-[#2F3543]/40 cursor-pointer"
                >
                  "Fastest AC bus Mumbai to Pune after 6 PM"
                </button>
              </div>

              {/* Dynamic Response Box */}
              {aiResponse && (
                <div className="mt-4 p-4 rounded-xl bg-[#080E1B]/90 border border-[#43EDCD]/30 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#43EDCD] flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-sm">check_circle</span> Copilot Parsed Parameters
                    </span>
                    <span className="text-[10px] text-[#BBC6E6]">Query ID #CP-892</span>
                  </div>
                  <p className="text-xs text-[#DDE2F5] leading-relaxed">{aiResponse}</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER
          ───────────────────────────────────────────────────────────── */}
      <footer className="w-full bg-[#080E1B] border-t border-[#2F3543]/40 pt-12 pb-8">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#2F3543]/30">
            {/* Column 1 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#43EDCD]">route</span>
                <h4 className="font-['Sora',sans-serif] text-sm font-semibold text-[#DDE2F5]">
                  Popular Highline Routes
                </h4>
              </div>
              <p className="text-xs text-[#E1BFB8]">
                Curated nocturnal expressways engineered for uninterrupted comfort.
              </p>
              <div className="flex flex-col gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => handleBookFeaturedRoute('Bengaluru', 'Goa', 1299)}
                  className="text-xs text-[#E1BFB8] hover:text-[#43EDCD] flex items-center justify-between py-1 transition-colors text-left"
                >
                  <span>Bengaluru → Goa Night Cruise</span>
                  <span className="text-[11px] text-[#00D0B2]">From ₹1,299</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleBookFeaturedRoute('Mumbai', 'Pune', 449)}
                  className="text-xs text-[#E1BFB8] hover:text-[#43EDCD] flex items-center justify-between py-1 transition-colors text-left"
                >
                  <span>Mumbai → Pune Hyperlink</span>
                  <span className="text-[11px] text-[#00D0B2]">From ₹449</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleBookFeaturedRoute('Delhi', 'Manali', 1850)}
                  className="text-xs text-[#E1BFB8] hover:text-[#43EDCD] flex items-center justify-between py-1 transition-colors text-left"
                >
                  <span>Delhi → Manali Nordic Sleeper</span>
                  <span className="text-[11px] text-[#00D0B2]">From ₹1,850</span>
                </button>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#43EDCD]">verified_user</span>
                <h4 className="font-['Sora',sans-serif] text-sm font-semibold text-[#DDE2F5]">
                  Smart Route AI Guarantee
                </h4>
              </div>
              <p className="text-xs text-[#E1BFB8]">
                Dynamic telematics rerouting algorithms predict bottlenecks before departure.
              </p>
              <ul className="flex flex-col gap-2 text-xs text-[#E1BFB8] mt-1">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#43EDCD] text-sm">check_circle</span>
                  <span>Sub-second GPS waypoint verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#43EDCD] text-sm">check_circle</span>
                  <span>Automated ETA compensation shield</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#43EDCD] text-sm">check_circle</span>
                  <span>Real-time cabin air &amp; telemetry feeds</span>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#43EDCD]">shield_with_heart</span>
                <h4 className="font-['Sora',sans-serif] text-sm font-semibold text-[#DDE2F5]">
                  Safety Protocols
                </h4>
              </div>
              <p className="text-xs text-[#E1BFB8]">
                Strict bio-rest cycles and twin-driver telemetry protocols on routes over 5 hours.
              </p>
              <div className="p-3 rounded-lg bg-[#161B29] border border-[#2F3543]/40 mt-1">
                <div className="text-xs text-[#DDE2F5] font-semibold">ISO 39001 Road Traffic Certified</div>
                <div className="text-[10px] text-[#E1BFB8] mt-0.5">Telematics audit verified every 24 hours</div>
              </div>
            </div>

            {/* Column 4 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#43EDCD]">phonelink</span>
                <h4 className="font-['Sora',sans-serif] text-sm font-semibold text-[#DDE2F5]">
                  Roamly Mobile Suite
                </h4>
              </div>
              <p className="text-xs text-[#E1BFB8]">
                Live vehicle telemetry, boarding pass passkeys, and silent coach controls.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mt-1">
                <button
                  type="button"
                  className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#161B29] border border-[#2F3543]/40 hover:border-[#43EDCD]/50 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[#DDE2F5]">android</span>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-[#E1BFB8] leading-none">Download on</span>
                    <span className="text-xs text-[#DDE2F5] font-semibold leading-tight">Google Play</span>
                  </div>
                </button>
                <button
                  type="button"
                  className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#161B29] border border-[#2F3543]/40 hover:border-[#43EDCD]/50 transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[#DDE2F5]">phone_iphone</span>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-[#E1BFB8] leading-none">Download on</span>
                    <span className="text-xs text-[#DDE2F5] font-semibold leading-tight">Apple Store</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#E1BFB8]">
            <div className="flex items-center gap-2 text-center md:text-left">
              <span className="font-['Sora',sans-serif] text-xs font-bold text-[#DDE2F5] tracking-tight">
                ROAMLY
              </span>
              <span>•</span>
              <span>© 2025 Roamly Mobility Technologies India Pvt. Ltd. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
              <button type="button" className="hover:text-[#DDE2F5] transition-colors">
                Privacy Policy
              </button>
              <button type="button" className="hover:text-[#DDE2F5] transition-colors">
                Terms of Carriage
              </button>
              <button type="button" className="hover:text-[#DDE2F5] transition-colors">
                Fleet Telematics API
              </button>
              <button type="button" className="hover:text-[#DDE2F5] transition-colors">
                Security Operations
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
