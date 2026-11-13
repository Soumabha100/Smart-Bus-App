import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenStorage } from '../utils/tokenStorage';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const user = tokenStorage.getUser();

  // Smart Route Planner Form State
  const [origin, setOrigin] = useState('Kolkata (Esplanade Terminus)');
  const [destination, setDestination] = useState('Siliguri (Tenzing Norgay Terminus)');
  const [departDate, setDepartDate] = useState('18 Oct 2025');
  const [departTime, setDepartTime] = useState('07:30 PM');
  const [maxBudget, setMaxBudget] = useState(1800);
  const [selectedFleetClass, setSelectedFleetClass] = useState('Volvo Multi-Axle Sleeper');

  // Interactive UI States
  const [activeNavTab, setActiveNavTab] = useState<'dashboard' | 'route-planning' | 'my-bookings' | 'ai-assistant' | 'risk-reports'>('dashboard');
  const [selectedMapFilter, setSelectedMapFilter] = useState<'all' | 'fleet' | 'risk'>('all');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Namaskar! I am ROAMLY AI Copilot. Ask me anything about West Bengal bus corridors, sleeper berth comfort, NH12 conditions, or rest-stop hygiene.',
    },
  ]);

  const handleSwapTerminals = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearchSmartRoutes = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    navigate('/results', {
      state: {
        from: origin.split(' ')[0] || 'Kolkata',
        to: destination.split(' ')[0] || 'Siliguri',
        date: departDate,
        mood: 'Fastest',
      },
    });
  };

  const handleSelectRecommendedJourney = () => {
    navigate('/results', {
      state: {
        from: 'Kolkata',
        to: 'Siliguri',
        date: departDate,
        mood: 'Sleep well',
      },
    });
  };

  const handleSignOut = () => {
    tokenStorage.clear();
    navigate('/login');
  };

  const handleSendAiMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatInput.trim()) return;

    const query = aiChatInput.trim();
    setAiChatMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setAiChatInput('');

    setTimeout(() => {
      let reply = 'Our real-time NH12 radar confirms road expansion between Farakka and Raiganj is operating smoothly with minimal fog index.';
      const lower = query.toLowerCase();
      if (lower.includes('berth') || lower.includes('seat') || lower.includes('sleeper')) {
        reply = 'Lower berths 04L & 06L on the Greenline Volvo B11R 9600 feature 180° flat beds, individual reading lamps, and universal 220V charging ports.';
      } else if (lower.includes('food') || lower.includes('malda') || lower.includes('hygiene') || lower.includes('stop')) {
        reply = 'The Malda Midnight Rest Hub (01:15 AM) has Grade A+ certified sanitized restrooms, vegetarian & non-veg dining options, and 24/7 security.';
      } else if (lower.includes('delay') || lower.includes('traffic') || lower.includes('jam')) {
        reply = 'Dalkhola bypass currently has a minor +14 min delay which is already factored into your 07:30 AM arrival schedule.';
      }
      setAiChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="bg-[#0B1020] font-['Inter',sans-serif] text-[#F5F5FA] min-h-screen relative selection:bg-[#FF8066]/30 selection:text-[#FF8066]">
      {/* ─────────────────────────────────────────────────────────────
          TOP FIXED NAVIGATION BAR
          ───────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B1020]/90 backdrop-blur-xl border-b border-[#1E293B]">
        <div className="h-16 max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-6">
          {/* Logo & Navigation Links */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/home')}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF8066] to-[#19C6B5] p-0.5 flex items-center justify-center shadow-lg shadow-[#FF8066]/20">
                <div className="w-full h-full bg-[#0B1020] rounded-[6px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#FF8066] text-[20px]">directions_bus</span>
                </div>
              </div>
              <span className="font-['Sora',sans-serif] text-lg font-bold tracking-wider text-[#F5F5FA] uppercase">
                ROAMLY
              </span>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveNavTab('dashboard')}
                className={`px-4 py-2 font-['Inter',sans-serif] text-sm font-semibold rounded-lg transition-colors ${
                  activeNavTab === 'dashboard'
                    ? 'bg-[#202B40] text-[#FF8066] border border-[#232F48]'
                    : 'text-[#A5ADBE] hover:text-[#F5F5FA] hover:bg-[#192235]'
                }`}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveNavTab('route-planning');
                  const el = document.getElementById('route-planner-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-4 py-2 font-['Inter',sans-serif] text-sm transition-colors rounded-lg ${
                  activeNavTab === 'route-planning'
                    ? 'bg-[#202B40] text-[#FF8066] border border-[#232F48]'
                    : 'text-[#A5ADBE] hover:text-[#F5F5FA] hover:bg-[#192235]'
                }`}
              >
                Route Planning
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveNavTab('my-bookings');
                  navigate('/results');
                }}
                className={`px-4 py-2 font-['Inter',sans-serif] text-sm transition-colors rounded-lg ${
                  activeNavTab === 'my-bookings'
                    ? 'bg-[#202B40] text-[#FF8066] border border-[#232F48]'
                    : 'text-[#A5ADBE] hover:text-[#F5F5FA] hover:bg-[#192235]'
                }`}
              >
                My Bookings
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveNavTab('ai-assistant');
                  setIsAiChatOpen(true);
                }}
                className={`px-4 py-2 font-['Inter',sans-serif] text-sm transition-colors rounded-lg ${
                  activeNavTab === 'ai-assistant'
                    ? 'bg-[#202B40] text-[#FF8066] border border-[#232F48]'
                    : 'text-[#A5ADBE] hover:text-[#F5F5FA] hover:bg-[#192235]'
                }`}
              >
                AI Assistant
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveNavTab('risk-reports');
                  const el = document.getElementById('travel-intelligence-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-4 py-2 font-['Inter',sans-serif] text-sm transition-colors rounded-lg ${
                  activeNavTab === 'risk-reports'
                    ? 'bg-[#202B40] text-[#FF8066] border border-[#232F48]'
                    : 'text-[#A5ADBE] hover:text-[#F5F5FA] hover:bg-[#192235]'
                }`}
              >
                Risk Reports
              </button>
            </nav>
          </div>

          {/* Right Header Status, Alerts & Profile */}
          <div className="flex items-center gap-4">
            {/* Live Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#19C6B5]/10 border border-[#19C6B5]/30">
              <span className="w-2 h-2 rounded-full bg-[#19C6B5] animate-pulse"></span>
              <span className="font-['Inter',sans-serif] text-xs font-semibold text-[#19C6B5] tracking-wider uppercase">
                AI Engine Online
              </span>
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button
                aria-label="Notifications"
                type="button"
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileMenuOpen(false);
                }}
                className="relative p-2 rounded-lg text-[#A5ADBE] hover:text-[#F5F5FA] hover:bg-[#192235] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF8066] ring-2 ring-[#0B1020]"></span>
              </button>

              {/* Notification Popover Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#192235] border border-[#232F48] rounded-xl shadow-2xl p-4 z-50 text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-[#232F48] mb-3">
                    <span className="font-['Sora',sans-serif] text-sm font-semibold text-[#F5F5FA]">
                      Radar Alerts (2)
                    </span>
                    <span className="text-xs text-[#19C6B5]">Live Synced</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-lg bg-[#202B40] text-xs">
                      <div className="flex items-center gap-1.5 text-[#F5B95F] font-semibold mb-1">
                        <span className="material-symbols-outlined text-[14px]">warning</span>
                        NH12 Dalkhola Bypass
                      </div>
                      <p className="text-[#A5ADBE]">
                        +14 min heavy traffic delay factored into arrival timetable.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#202B40] text-xs">
                      <div className="flex items-center gap-1.5 text-[#19C6B5] font-semibold mb-1">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        Greenline Volvo B11R 9600
                      </div>
                      <p className="text-[#A5ADBE]">
                        Pre-departure inspection completed at Esplanade Bay 04.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(!isProfileMenuOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-[#192235] transition-colors focus:outline-none"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF8066] to-[#75E5D0] flex items-center justify-center text-xs font-bold text-[#0B1020] ring-1 ring-[#232F48]">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#19C6B5] ring-2 ring-[#0B1020]"></span>
                </div>
                <span className="hidden md:inline-block font-['Inter',sans-serif] text-sm text-[#F5F5FA] font-medium">
                  {user?.name || 'Alex Reed'}
                </span>
                <span className="hidden md:inline-block material-symbols-outlined text-[#A5ADBE] text-[18px]">
                  expand_more
                </span>
              </button>

              {/* Profile Menu Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#192235] border border-[#232F48] rounded-xl shadow-2xl p-2 z-50 text-left">
                  <div className="px-3 py-2 border-b border-[#232F48] mb-1">
                    <p className="text-sm font-semibold text-[#F5F5FA] truncate">
                      {user?.name || 'Alex Reed'}
                    </p>
                    <p className="text-xs text-[#A5ADBE] truncate">
                      {user?.email || 'alex.reed@roamly.ai'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/results');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#F5F5FA] hover:bg-[#202B40] rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#19C6B5]">confirmation_number</span>
                    My Bookings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate('/system-status');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#F5F5FA] hover:bg-[#202B40] rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#75E5D0]">health_and_safety</span>
                    System Health
                  </button>
                  <div className="border-t border-[#232F48] my-1"></div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-xs text-[#F36B75] hover:bg-[#202B40] rounded-lg transition-colors flex items-center gap-2 font-medium"
                  >
                    <span className="material-symbols-outlined text-[16px]">logout</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT WORKSPACE
          ───────────────────────────────────────────────────────────── */}
      <main className="w-full pt-20 bg-[#0B1020] min-h-[calc(100vh-4rem)] max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col w-full text-[#F5F5FA] pb-12">
          {/* Top Breadcrumb & Status Ribbon */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#202B40] text-[#FF8066] border border-[#232F48]">
                <span className="material-symbols-outlined text-[18px]">alt_route</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-['Inter',sans-serif]">
                <span className="text-[#A5ADBE]">Telemetry Workspace</span>
                <span className="text-[#A5ADBE]/40">/</span>
                <span className="text-[#F5F5FA] font-semibold">Bengal Transit Radar</span>
                <span className="px-2 py-0.5 rounded-full bg-[#19C6B5]/20 text-[#19C6B5] text-[11px] font-semibold uppercase tracking-wider ml-1">
                  v4.8 Predictive
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[#A5ADBE] text-xs bg-[#192235] px-3 py-1.5 rounded-lg border border-[#232F48] shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-[#19C6B5]">satellite_alt</span>
                <span>
                  Telemetry Stream:{' '}
                  <span className="text-[#F5F5FA] font-medium">NH12 / NH19 High-Speed Sensor Array</span>
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-[#192235] px-3 py-1.5 rounded-lg border border-[#232F48] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#19C6B5] animate-ping"></span>
                <span className="text-xs text-[#F5F5FA] font-medium uppercase tracking-wider">
                  Sync: 12ms
                </span>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              SECTION 1: TOP 3-COLUMN DESKTOP GRID (12 Cols)
              ───────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ── LEFT COLUMN: SMART ROUTE PLANNER (lg:col-span-3) ── */}
            <div
              id="route-planner-section"
              className="lg:col-span-3 flex flex-col gap-4 bg-[#111827] border border-[#232F48] p-5 rounded-2xl shadow-xl relative overflow-hidden"
            >
              {/* Ambient Glow */}
              <div className="absolute -top-12 -left-12 w-36 h-36 bg-[#FF8066]/10 rounded-full blur-2xl pointer-events-none"></div>

              {/* Title & Adaptive Tag */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] tracking-wider uppercase text-[#A5ADBE] block font-semibold">
                    Predictive Engine
                  </span>
                  <h2 className="font-['Sora',sans-serif] text-lg font-bold text-[#F5F5FA]">
                    Smart Route Planner
                  </h2>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-[#19C6B5]/20 flex items-center gap-1 border border-[#19C6B5]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#19C6B5]"></span>
                  <span className="text-[10px] text-[#19C6B5] font-bold uppercase tracking-wider">
                    Adaptive
                  </span>
                </div>
              </div>

              {/* Planner Form */}
              <form className="flex flex-col gap-3.5 mt-1" onSubmit={handleSearchSmartRoutes}>
                {/* Origin Input */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-[#A5ADBE] flex items-center gap-1 uppercase">
                    <span className="material-symbols-outlined text-[14px] text-[#FF8066]">trip_origin</span>
                    Origin Terminus
                  </label>
                  <div className="relative flex items-center bg-[#202B40] rounded-xl px-3 py-2.5 border border-[#232F48] focus-within:border-[#FF8066] transition-colors">
                    <span className="material-symbols-outlined text-[18px] text-[#FF8066] mr-2">near_me</span>
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="bg-transparent w-full text-[#F5F5FA] text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* Terminus Swap Button */}
                <div className="flex justify-center -my-2 relative z-10">
                  <button
                    type="button"
                    onClick={handleSwapTerminals}
                    className="w-7 h-7 rounded-full bg-[#192235] border border-[#232F48] flex items-center justify-center text-[#A5ADBE] hover:text-[#FF8066] hover:border-[#FF8066] transition-colors shadow-md"
                    title="Swap Origin and Destination"
                  >
                    <span className="material-symbols-outlined text-[16px]">swap_vert</span>
                  </button>
                </div>

                {/* Destination Input */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-[#A5ADBE] flex items-center gap-1 uppercase">
                    <span className="material-symbols-outlined text-[14px] text-[#19C6B5]">location_on</span>
                    Destination Hub
                  </label>
                  <div className="relative flex items-center bg-[#202B40] rounded-xl px-3 py-2.5 border border-[#232F48] focus-within:border-[#19C6B5] transition-colors">
                    <span className="material-symbols-outlined text-[18px] text-[#19C6B5] mr-2">fmd_good</span>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="bg-transparent w-full text-[#F5F5FA] text-sm focus:outline-none"
                    />
                  </div>
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-[#A5ADBE] uppercase">Depart Date</label>
                    <div className="flex items-center bg-[#202B40] rounded-xl px-3 py-2 border border-[#232F48]">
                      <span className="material-symbols-outlined text-[16px] text-[#A5ADBE] mr-1.5">calendar_today</span>
                      <input
                        type="text"
                        value={departDate}
                        onChange={(e) => setDepartDate(e.target.value)}
                        className="bg-transparent w-full text-[#F5F5FA] text-xs font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-[#A5ADBE] uppercase">Depart Time</label>
                    <div className="flex items-center bg-[#202B40] rounded-xl px-3 py-2 border border-[#232F48]">
                      <span className="material-symbols-outlined text-[16px] text-[#A5ADBE] mr-1.5">schedule</span>
                      <input
                        type="text"
                        value={departTime}
                        onChange={(e) => setDepartTime(e.target.value)}
                        className="bg-transparent w-full text-[#F5F5FA] text-xs font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Reach-By Constraint */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-semibold text-[#A5ADBE] uppercase">Reach-By Deadline</label>
                    <span className="text-[11px] text-[#19C6B5] font-semibold">Target Met</span>
                  </div>
                  <div className="flex items-center bg-[#202B40] rounded-xl px-3 py-2 border border-[#232F48]">
                    <span className="material-symbols-outlined text-[18px] text-[#75E5D0] mr-2">alarm_on</span>
                    <span className="text-xs text-[#F5F5FA] font-medium">08:30 AM (Next Day)</span>
                  </div>
                </div>

                {/* Maximum Budget Slider */}
                <div className="flex flex-col gap-2 bg-[#192235] p-3 rounded-xl border border-[#232F48]">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-[#A5ADBE] uppercase font-semibold">Max Budget Cap</span>
                    <span className="font-['Sora',sans-serif] text-base font-bold text-[#FF8066]">
                      ₹{maxBudget.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="800"
                    max="3500"
                    step="50"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-full accent-[#FF8066] h-1.5 bg-[#202B40] rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#A5ADBE]">
                    <span>₹800 (Standard)</span>
                    <span>₹3,500 (Executive)</span>
                  </div>
                </div>

                {/* Fleet Class Chips */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-[#A5ADBE] uppercase font-semibold">Bus Specification</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Volvo Multi-Axle Sleeper', 'BharatBenz Seater', 'Electric Luxury'].map((fleet) => (
                      <button
                        type="button"
                        key={fleet}
                        onClick={() => setSelectedFleetClass(fleet)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          selectedFleetClass === fleet
                            ? 'bg-[#FF8066] text-[#0B1020] font-bold shadow-md shadow-[#FF8066]/20'
                            : 'bg-[#202B40] text-[#A5ADBE] hover:text-[#F5F5FA] border border-[#232F48]'
                        }`}
                      >
                        {fleet}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  type="submit"
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-[#FF8066] text-[#0B1020] font-['Sora',sans-serif] text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#FF8066]/20 hover:bg-[#ff947d] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">route</span>
                  <span>Find Smart Routes</span>
                </button>

                {/* Route Summary Helper */}
                <div className="flex items-center justify-between text-[#A5ADBE] text-xs px-1 pt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#19C6B5]">model_training</span>
                    3 Routes Computed
                  </span>
                  <span className="text-[#19C6B5] font-semibold">99.2% Timetable Fit</span>
                </div>
              </form>
            </div>

            {/* ── CENTRAL COLUMN: AI RECOMMENDED JOURNEY (lg:col-span-6) ── */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              {/* Header Banner Pill */}
              <div className="flex items-center justify-between bg-[#192235] border border-[#232F48] p-3.5 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#19C6B5]/15 flex items-center justify-center text-[#19C6B5]">
                    <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                  </div>
                  <div>
                    <h3 className="font-['Sora',sans-serif] text-sm sm:text-base font-bold text-[#F5F5FA]">
                      AI Recommended Journey
                    </h3>
                    <span className="text-xs text-[#A5ADBE]">Continuous telemetry rerouting active</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-3 py-1 rounded-full bg-[#19C6B5]/20 text-[#19C6B5] text-xs font-semibold tracking-wide border border-[#19C6B5]/30">
                    98.4% Match Score
                  </span>
                </div>
              </div>

              {/* Main Master Card */}
              <div className="bg-[#161B2B] border border-[#232F48] p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col gap-5 relative overflow-hidden">
                {/* Glowing accent gradient */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#19C6B5]/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Operator Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#202B40] border border-[#232F48] flex items-center justify-center text-[#FF8066] shadow-inner">
                      <span className="material-symbols-outlined text-[26px]">directions_bus</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-['Sora',sans-serif] text-base sm:text-lg font-bold text-[#F5F5FA]">
                          Greenline Volvo B11R 9600
                        </h4>
                        <span className="material-symbols-outlined text-[#19C6B5] text-[18px]" title="Verified Operator">
                          verified
                        </span>
                      </div>
                      <span className="text-xs text-[#A5ADBE]">
                        Multi-Axle Ultra Luxury Sleeper (2+1 Berth configuration)
                      </span>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between">
                    <div className="flex items-center gap-1 text-[#FF8066]">
                      <span className="material-symbols-outlined text-[16px]">star</span>
                      <span className="font-['Sora',sans-serif] text-sm font-bold">4.9</span>
                      <span className="text-xs text-[#A5ADBE]">(842)</span>
                    </div>
                    <span className="text-[11px] text-[#19C6B5] uppercase font-bold tracking-wider">
                      Tier-1 Fleet
                    </span>
                  </div>
                </div>

                {/* Origin -> Destination Nodes with Metrics */}
                <div className="bg-[#192235] border border-[#232F48] p-4 rounded-xl flex flex-col gap-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#FF8066] uppercase font-bold">Departs Kolkata</span>
                      <div className="font-['Sora',sans-serif] text-2xl font-bold text-[#F5F5FA] tracking-tight">
                        07:45 PM
                      </div>
                      <span className="text-xs text-[#A5ADBE]">Esplanade Central (Bay 04)</span>
                    </div>
                    <div className="flex flex-col items-center px-2 text-center">
                      <span className="text-[11px] text-[#19C6B5] font-semibold">11 hrs 45 mins</span>
                      <div className="flex items-center gap-1 my-1">
                        <span className="w-2 h-2 rounded-full bg-[#FF8066]"></span>
                        <span className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-[#FF8066] via-[#19C6B5] to-[#75E5D0]"></span>
                        <span className="w-2 h-2 rounded-full bg-[#75E5D0]"></span>
                      </div>
                      <span className="text-[11px] text-[#A5ADBE]">584 km via NH12 Bypass</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-[#19C6B5] uppercase font-bold">Arrives Siliguri</span>
                      <div className="font-['Sora',sans-serif] text-2xl font-bold text-[#F5F5FA] tracking-tight">
                        07:30 AM
                      </div>
                      <span className="text-xs text-[#A5ADBE]">Tenzing Norgay Junction</span>
                    </div>
                  </div>

                  {/* Route Timeline Node Bar */}
                  <div className="bg-[#202B40] border border-[#232F48] p-2.5 rounded-lg flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF8066] ring-2 ring-[#FF8066]/20"></span>
                      <span className="text-[#F5F5FA] font-medium">Esplanade (07:45 PM)</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#A5ADBE] text-[11px] bg-[#192235] px-2.5 py-1 rounded border border-[#232F48]">
                      <span className="material-symbols-outlined text-[14px] text-[#75E5D0]">restaurant</span>
                      <span>Malda Midnight Hub (01:15 AM - 30m break)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#19C6B5] ring-2 ring-[#19C6B5]/20"></span>
                      <span className="text-[#F5F5FA] font-medium">Siliguri (07:30 AM)</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Seat Availability */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#192235]/60 border border-[#232F48] p-3.5 rounded-xl">
                  <div className="flex items-baseline gap-2">
                    <span className="font-['Sora',sans-serif] text-3xl font-bold text-[#F5F5FA]">₹1,450</span>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#19C6B5] font-bold uppercase">Best Value</span>
                      <span className="text-xs text-[#A5ADBE] line-through">₹1,700 avg</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF8066] animate-pulse"></div>
                      <span className="text-xs text-[#FF8066] font-bold">7 Lower Berths Left</span>
                    </div>
                    <div className="h-5 w-px bg-[#232F48]"></div>
                    <div className="flex items-center gap-1 text-[#A5ADBE] text-xs">
                      <span className="material-symbols-outlined text-[16px] text-[#19C6B5]">power</span>
                      <span>AC • Wi-Fi • Charging</span>
                    </div>
                  </div>
                </div>

                {/* AI Validation Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="bg-[#192235] border border-[#232F48] p-2.5 rounded-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#19C6B5] text-[18px]">verified</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#F5F5FA]">99.1% On-Time</span>
                      <span className="text-[10px] text-[#A5ADBE]">Historic adherence</span>
                    </div>
                  </div>
                  <div className="bg-[#192235] border border-[#232F48] p-2.5 rounded-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#19C6B5] text-[18px]">savings</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#F5F5FA]">19% Savings</span>
                      <span className="text-[10px] text-[#A5ADBE]">Inside ₹1,800 limit</span>
                    </div>
                  </div>
                  <div className="bg-[#192235] border border-[#232F48] p-2.5 rounded-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#19C6B5] text-[18px]">av_timer</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#F5F5FA]">+60m Headroom</span>
                      <span className="text-[10px] text-[#A5ADBE]">Ahead of 08:30 AM</span>
                    </div>
                  </div>
                </div>

                {/* AI Recommendation Explanation Box */}
                <div className="bg-[#202B40] border border-[#232F48] p-3.5 rounded-xl flex gap-3 items-start shadow-sm">
                  <div className="mt-0.5 text-[#19C6B5]">
                    <span className="material-symbols-outlined text-[22px]">psychology</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] uppercase tracking-wide text-[#19C6B5] font-bold">
                      AI Synthesis Reasoning
                    </span>
                    <p className="text-xs text-[#F5F5FA] leading-relaxed">
                      NH12 road expansion completed between Farakka and Raiganj saves 45 minutes of idling.
                      Greenline operates newest BS6 Euro-6 chassis with certified dual-driver midnight
                      rotation, eliminating midnight fatigue risk on the Malda corridor.
                    </p>
                  </div>
                </div>

                {/* Primary CTA Button */}
                <button
                  type="button"
                  onClick={handleSelectRecommendedJourney}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#FF8066] text-[#0B1020] font-['Sora',sans-serif] text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-xl shadow-[#FF8066]/25 hover:shadow-[#FF8066]/40 hover:bg-[#ff947d] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">airline_seat_individual_suite</span>
                  <span>View Journey &amp; Select Berths</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* ── RIGHT COLUMN: TRAVEL INTELLIGENCE PANEL (lg:col-span-3) ── */}
            <div id="travel-intelligence-section" className="lg:col-span-3 flex flex-col gap-3.5">
              {/* Radar Header */}
              <div className="flex items-center justify-between bg-[#192235] border border-[#232F48] p-3.5 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#19C6B5] text-[20px]">radar</span>
                  <h3 className="font-['Sora',sans-serif] text-sm font-bold text-[#F5F5FA]">
                    Travel Intelligence
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 bg-[#202B40] border border-[#232F48] px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#19C6B5] animate-pulse"></span>
                  <span className="text-[10px] text-[#19C6B5] font-bold uppercase">Live Telemetry</span>
                </div>
              </div>

              {/* Widget Stack */}
              <div className="flex flex-col gap-3">
                {/* 1. En Route Micro-Climates */}
                <div className="bg-[#111827] border border-[#232F48] p-3.5 rounded-xl flex flex-col gap-2.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#A5ADBE] uppercase font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#75E5D0]">partly_cloudy_day</span>
                      En Route Micro-Climates
                    </span>
                    <span className="text-[10px] text-[#19C6B5] font-semibold">Dry Tarmac</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 bg-[#192235] p-2 rounded-lg text-center border border-[#232F48]">
                    <div className="flex flex-col py-0.5">
                      <span className="text-[10px] text-[#A5ADBE]">Kolkata</span>
                      <span className="font-['Sora',sans-serif] text-sm font-bold text-[#F5F5FA]">28°C</span>
                      <span className="text-[10px] text-[#A5ADBE]/80">Clear</span>
                    </div>
                    <div className="flex flex-col py-0.5 border-x border-[#232F48]">
                      <span className="text-[10px] text-[#A5ADBE]">Farakka</span>
                      <span className="font-['Sora',sans-serif] text-sm font-bold text-[#F5F5FA]">24°C</span>
                      <span className="text-[10px] text-[#A5ADBE]/80">Mist 800m</span>
                    </div>
                    <div className="flex flex-col py-0.5">
                      <span className="text-[10px] text-[#A5ADBE]">Siliguri</span>
                      <span className="font-['Sora',sans-serif] text-sm font-bold text-[#F5F5FA]">21°C</span>
                      <span className="text-[10px] text-[#A5ADBE]/80">Crisp</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#A5ADBE] text-[11px]">
                    <span className="material-symbols-outlined text-[14px] text-[#19C6B5]">check_circle</span>
                    <span>Zero precipitation risk along entire corridor.</span>
                  </div>
                </div>

                {/* 2. Route Disruption Radar */}
                <div className="bg-[#111827] border border-[#232F48] p-3.5 rounded-xl flex flex-col gap-2.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#A5ADBE] uppercase font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#FF8066]">traffic</span>
                      Route Disruption Radar
                    </span>
                    <span className="text-[10px] text-[#F5B95F] font-bold bg-[#F5B95F]/15 px-2 py-0.5 rounded border border-[#F5B95F]/30">
                      1 Warning
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-[#192235] p-2.5 rounded-lg border border-[#232F48] flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#F5B95F] text-[16px] mt-0.5">warning</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[#F5F5FA]">NH12 Dalkhola Bypass</span>
                        <span className="text-[11px] text-[#FF8066]">+14m delay factored in AI timetable</span>
                      </div>
                    </div>
                    <div className="bg-[#192235] p-2.5 rounded-lg border border-[#232F48] flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#19C6B5] text-[16px] mt-0.5">verified_user</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[#F5F5FA]">Farakka Barrage Crossing</span>
                        <span className="text-[11px] text-[#19C6B5]">Smooth flow • Avg 48 km/h</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Operator Telemetry Index */}
                <div className="bg-[#111827] border border-[#232F48] p-3.5 rounded-xl flex flex-col gap-2.5 shadow-md">
                  <span className="text-[11px] text-[#A5ADBE] uppercase font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-[#19C6B5]">shield</span>
                    Operator Telemetry Index
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#192235] p-2 rounded-lg text-center border border-[#232F48]">
                      <span className="text-[10px] text-[#A5ADBE] block">Safety</span>
                      <span className="font-['Sora',sans-serif] text-sm font-bold text-[#19C6B5]">
                        9.8<span className="text-[10px] font-normal text-[#A5ADBE]">/10</span>
                      </span>
                    </div>
                    <div className="bg-[#192235] p-2 rounded-lg text-center border border-[#232F48]">
                      <span className="text-[10px] text-[#A5ADBE] block">Fleet Age</span>
                      <span className="font-['Sora',sans-serif] text-sm font-bold text-[#F5F5FA]">
                        1.2<span className="text-[10px] font-normal text-[#A5ADBE]"> yr</span>
                      </span>
                    </div>
                    <div className="bg-[#192235] p-2 rounded-lg text-center border border-[#232F48]">
                      <span className="text-[10px] text-[#A5ADBE] block">Punctual</span>
                      <span className="font-['Sora',sans-serif] text-sm font-bold text-[#19C6B5]">96.8%</span>
                    </div>
                  </div>
                </div>

                {/* 4. Quality & Security Checklist */}
                <div className="bg-[#111827] border border-[#232F48] p-3.5 rounded-xl flex flex-col gap-2 shadow-md">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#A5ADBE] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[#19C6B5]">local_police</span>
                      Highway Security Patrol
                    </span>
                    <span className="text-[11px] text-[#19C6B5] font-semibold">Active 24/7</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#A5ADBE] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[#19C6B5]">sanitizer</span>
                      Rest Stop Hygiene
                    </span>
                    <span className="text-[11px] text-[#19C6B5] font-semibold">Grade A+ Certified</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#A5ADBE] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[#19C6B5]">speed</span>
                      Road Surface Quality
                    </span>
                    <span className="text-[11px] text-[#19C6B5] font-semibold">94% Smooth Asphalt</span>
                  </div>
                </div>

                {/* Terminal Advisory Notice */}
                <div className="bg-[#202B40] border border-[#232F48] p-2.5 rounded-xl flex items-center gap-2 text-[#A5ADBE] text-xs">
                  <span className="material-symbols-outlined text-[18px] text-[#FF8066]">info</span>
                  <span>Friday exodus peak clears by 08:15 PM. Board at Gate 03.</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────
              SECTION 2: FULL-WIDTH INTERACTIVE GEOGRAPHICAL ROUTE MAP
              ───────────────────────────────────────────────────────── */}
          <div className="mt-8 flex flex-col gap-4">
            {/* Map Control / Header Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#111827] border border-[#232F48] p-4 rounded-2xl shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#19C6B5]/15 flex items-center justify-center text-[#19C6B5]">
                  <span className="material-symbols-outlined text-[22px]">map</span>
                </div>
                <div>
                  <h3 className="font-['Sora',sans-serif] text-sm sm:text-base font-bold text-[#F5F5FA]">
                    Interactive Route Map — West Bengal Regional Transit Corridors
                  </h3>
                  <span className="text-xs text-[#A5ADBE]">
                    Live vehicle telemetry, radar overlays &amp; corridor topology
                  </span>
                </div>
              </div>

              {/* Legend & Filter Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Legend Chips */}
                <div className="flex items-center gap-3 bg-[#192235] px-3 py-1.5 rounded-xl border border-[#232F48]">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF8066]"></span>
                    <span className="text-[#A5ADBE]">Primary Active</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#19C6B5]"></span>
                    <span className="text-[#A5ADBE]">Express Highway</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F5B95F]"></span>
                    <span className="text-[#A5ADBE]">Slow Corridor</span>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-[#192235] p-1 rounded-xl border border-[#232F48]">
                  <button
                    type="button"
                    onClick={() => setSelectedMapFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedMapFilter === 'all'
                        ? 'bg-[#202B40] text-[#F5F5FA] font-bold border border-[#232F48]'
                        : 'text-[#A5ADBE] hover:text-[#F5F5FA]'
                    }`}
                  >
                    All Corridors
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMapFilter('fleet')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedMapFilter === 'fleet'
                        ? 'bg-[#202B40] text-[#F5F5FA] font-bold border border-[#232F48]'
                        : 'text-[#A5ADBE] hover:text-[#F5F5FA]'
                    }`}
                  >
                    Live Fleet (42)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMapFilter('risk')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      selectedMapFilter === 'risk'
                        ? 'bg-[#202B40] text-[#F5F5FA] font-bold border border-[#232F48]'
                        : 'text-[#A5ADBE] hover:text-[#F5F5FA]'
                    }`}
                  >
                    Risk Hotspots
                  </button>
                </div>
              </div>
            </div>

            {/* Map Canvas Container */}
            <div className="w-full h-[460px] bg-[#080D1D] border border-[#232F48] rounded-2xl relative overflow-hidden shadow-2xl flex items-center justify-center">
              {/* Scalable SVG Map Representation */}
              <div
                className="w-full h-full transition-transform duration-300 origin-center flex items-center justify-center"
                style={{ transform: `scale(${mapZoom})` }}
              >
                <svg
                  className="w-full h-full object-cover"
                  fill="none"
                  viewBox="0 0 1200 460"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="primaryRouteGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#FF8066" />
                      <stop offset="50%" stopColor="#42DCCA" />
                      <stop offset="100%" stopColor="#19C6B5" />
                    </linearGradient>
                    <linearGradient id="dighaGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#FF8066" />
                      <stop offset="100%" stopColor="#42B7A3" />
                    </linearGradient>
                    <radialGradient cx="50%" cy="50%" id="hubGlow" r="50%">
                      <stop offset="0%" stopColor="#FF8066" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#FF8066" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient cx="50%" cy="50%" id="tealGlow" r="50%">
                      <stop offset="0%" stopColor="#42DCCA" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#42DCCA" stopOpacity="0" />
                    </radialGradient>
                    <pattern height="40" id="gridPattern" patternUnits="userSpaceOnUse" width="40">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#161B2B" strokeWidth="0.8" />
                    </pattern>
                  </defs>

                  {/* Subtle Topographic Grid */}
                  <rect fill="url(#gridPattern)" height="460" width="1200" />

                  {/* River Paths (Hooghly / Ganges) */}
                  <path
                    d="M 580 460 C 560 380, 570 310, 610 260 C 640 220, 620 180, 590 140 C 580 120, 610 60, 630 0"
                    stroke="#1A253E"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="6"
                  />
                  <path
                    d="M 610 260 C 680 270, 750 250, 840 270"
                    stroke="#162035"
                    strokeLinecap="round"
                    strokeWidth="3"
                  />

                  {/* Western Secondary Corridor (NH19: Kolkata -> Durgapur -> Asansol) */}
                  <path
                    d="M 590 350 L 450 310 L 370 290"
                    stroke="#25293A"
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                  <path
                    d="M 590 350 L 450 310 L 370 290"
                    stroke="#42DCCA"
                    strokeDasharray="4 4"
                    strokeWidth="1.5"
                  />

                  {/* Coastal Corridor (NH114A: Kolkata -> Digha) */}
                  <path
                    d="M 590 350 L 530 420"
                    stroke="url(#dighaGrad)"
                    strokeLinecap="round"
                    strokeWidth="3"
                  />

                  {/* Primary Active North-South Highway (NH12: Kolkata -> Malda -> Dalkhola -> Siliguri -> Darjeeling) */}
                  <path
                    d="M 590 350 C 600 300, 620 230, 630 190 C 640 150, 660 120, 680 75 L 670 35"
                    stroke="url(#primaryRouteGrad)"
                    strokeLinecap="round"
                    strokeWidth="4.5"
                  />

                  {/* Active Bus Particle */}
                  <circle cx="625" cy="210" fill="#FF8066" r="4">
                    <animate attributeName="opacity" dur="2s" repeatCount="indefinite" values="1;0.4;1" />
                  </circle>

                  {/* Node 1: Kolkata (Origin) */}
                  <circle cx="590" cy="350" fill="url(#hubGlow)" r="22" />
                  <circle cx="590" cy="350" fill="#FF8066" r="6" />
                  <circle cx="590" cy="350" r="10" stroke="#FF8066" strokeDasharray="3 3" strokeWidth="1.5">
                    <animateTransform
                      attributeName="transform"
                      dur="8s"
                      from="0 590 350"
                      repeatCount="indefinite"
                      to="360 590 350"
                      type="rotate"
                    />
                  </circle>
                  <text fill="#F5F5FA" fontFamily="Sora" fontSize="12" fontWeight="600" x="608" y="355">
                    KOLKATA (Esplanade)
                  </text>

                  {/* Node 2: Digha */}
                  <circle cx="530" cy="420" fill="#42B7A3" r="5" />
                  <text fill="#A5ADBE" fontFamily="Inter" fontSize="11" fontWeight="500" x="475" y="425">
                    DIGHA
                  </text>

                  {/* Node 3: Durgapur */}
                  <circle cx="450" cy="310" fill="#42DCCA" r="4.5" />
                  <text fill="#A5ADBE" fontFamily="Inter" fontSize="11" x="430" y="332">
                    Durgapur
                  </text>

                  {/* Node 4: Asansol */}
                  <circle cx="370" cy="290" fill="#42DCCA" r="5" />
                  <text fill="#A5ADBE" fontFamily="Inter" fontSize="11" fontWeight="500" x="310" y="295">
                    ASANSOL
                  </text>

                  {/* Node 5: Malda Hub */}
                  <circle cx="630" cy="190" fill="#FF8066" r="5" />
                  <text fill="#F5F5FA" fontFamily="Inter" fontSize="11" fontWeight="600" x="645" y="195">
                    Malda (Hub)
                  </text>

                  {/* Node 6: Siliguri (Northern Terminus) */}
                  <circle cx="680" cy="75" fill="url(#tealGlow)" r="24" />
                  <circle cx="680" cy="75" fill="#42DCCA" r="7" />
                  <circle cx="680" cy="75" r="12" stroke="#42DCCA" strokeDasharray="4 4" strokeWidth="1.5">
                    <animateTransform
                      attributeName="transform"
                      dur="10s"
                      from="360 680 75"
                      repeatCount="indefinite"
                      to="0 680 75"
                      type="rotate"
                    />
                  </circle>
                  <text fill="#F5F5FA" fontFamily="Sora" fontSize="13" fontWeight="700" x="702" y="80">
                    SILIGURI (Junction)
                  </text>

                  {/* Node 7: Darjeeling */}
                  <circle cx="670" cy="35" fill="#69D9C5" r="5" />
                  <text fill="#A5ADBE" fontFamily="Inter" fontSize="11" fontWeight="500" x="686" y="38">
                    DARJEELING
                  </text>
                </svg>
              </div>

              {/* Floating Dynamic Node Card: Siliguri Hub */}
              <div className="absolute top-8 right-12 hidden md:flex items-center gap-3 bg-[#192235]/90 backdrop-blur-md p-3.5 rounded-xl border border-[#232F48] shadow-2xl max-w-xs">
                <div className="w-10 h-10 rounded-lg bg-[#19C6B5]/15 flex items-center justify-center text-[#19C6B5]">
                  <span className="material-symbols-outlined text-[22px]">navigation</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-['Sora',sans-serif] text-xs font-bold text-[#F5F5FA]">
                      Siliguri Gateway Hub
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#19C6B5]/20 text-[#19C6B5] text-[10px] font-semibold">
                      21°C
                    </span>
                  </div>
                  <span className="text-[11px] text-[#A5ADBE]">
                    ETA: 07:30 AM • On Timetable • NH10 Open
                  </span>
                </div>
              </div>

              {/* Floating Dynamic Node Card: Kolkata Origin */}
              <div className="absolute bottom-8 left-12 hidden md:flex items-center gap-3 bg-[#192235]/90 backdrop-blur-md p-3.5 rounded-xl border border-[#232F48] shadow-2xl max-w-xs">
                <div className="w-10 h-10 rounded-lg bg-[#FF8066]/20 flex items-center justify-center text-[#FF8066]">
                  <span className="material-symbols-outlined text-[22px]">departure_board</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-['Sora',sans-serif] text-xs font-bold text-[#F5F5FA]">
                      Esplanade Central
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#FF8066]/20 text-[#FF8066] text-[10px] font-semibold">
                      Gate 03
                    </span>
                  </div>
                  <span className="text-[11px] text-[#A5ADBE]">
                    Boarding scheduled in 2h 15m • Platform Clear
                  </span>
                </div>
              </div>

              {/* On-Map Floating Controls */}
              <div className="absolute top-4 left-4 flex flex-col gap-1 bg-[#192235]/90 backdrop-blur-md p-1 rounded-xl border border-[#232F48] shadow-lg">
                <button
                  type="button"
                  onClick={() => setMapZoom((prev) => Math.min(prev + 0.2, 1.8))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#F5F5FA] hover:bg-[#202B40] transition-colors"
                  title="Zoom In"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMapZoom((prev) => Math.max(prev - 0.2, 0.8))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#F5F5FA] hover:bg-[#202B40] transition-colors"
                  title="Zoom Out"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <div className="w-6 h-px bg-[#232F48] mx-auto my-0.5"></div>
                <button
                  type="button"
                  onClick={() => setMapZoom(1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#F5F5FA] hover:bg-[#202B40] transition-colors"
                  title="Center Map"
                >
                  <span className="material-symbols-outlined text-[18px]">my_location</span>
                </button>
              </div>

              {/* Telemetry Watermark Info */}
              <div className="absolute bottom-4 right-4 bg-[#080D1D]/80 backdrop-blur-sm px-3 py-1 rounded-full text-[#A5ADBE] text-[10px] flex items-center gap-1.5 border border-[#232F48]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#19C6B5]"></span>
                <span>Geodetic Datum: WGS 84 • Corridor NH12/19 Real-Time Feed</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          FLOATING AI COPILOT BUTTON ("Ask ROAMLY")
          ───────────────────────────────────────────────────────────── */}
      <aside className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsAiChatOpen(!isAiChatOpen)}
          className="group relative flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#FF8066] text-[#0B1020] shadow-[0_8px_30px_-4px_rgba(255,128,102,0.35)] hover:shadow-[0_0_24px_rgba(255,128,102,0.5)] active:scale-95 transition-all font-['Sora',sans-serif] font-bold text-xs sm:text-sm tracking-wide uppercase cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">smart_toy</span>
          <span>Ask ROAMLY</span>
        </button>

        {/* AI Copilot Chat Drawer */}
        {isAiChatOpen && (
          <div className="absolute bottom-16 right-0 w-88 sm:w-96 bg-[#192235] border border-[#232F48] rounded-2xl shadow-2xl p-4 flex flex-col z-50 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#232F48]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#19C6B5]/15 flex items-center justify-center text-[#19C6B5]">
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                </div>
                <div>
                  <span className="font-['Sora',sans-serif] text-sm font-bold text-[#F5F5FA]">
                    ROAMLY Copilot
                  </span>
                  <span className="text-[10px] text-[#19C6B5] block">Bengal Transit Expert</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiChatOpen(false)}
                className="text-[#A5ADBE] hover:text-[#F5F5FA] p-1"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="h-60 overflow-y-auto my-3 space-y-2.5 pr-1 text-xs">
              {aiChatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl ${
                    msg.sender === 'ai'
                      ? 'bg-[#202B40] text-[#F5F5FA] border border-[#232F48]'
                      : 'bg-[#FF8066] text-[#0B1020] font-medium ml-6'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendAiMessage} className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={aiChatInput}
                onChange={(e) => setAiChatInput(e.target.value)}
                placeholder="Ask about sleeper berths, delays, stops..."
                className="flex-1 bg-[#202B40] border border-[#232F48] rounded-xl px-3 py-2 text-xs text-[#F5F5FA] focus:outline-none focus:border-[#FF8066]"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-[#FF8066] text-[#0B1020] flex items-center justify-center hover:bg-[#ff947d] transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </form>
          </div>
        )}
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER STATUS BAR
          ───────────────────────────────────────────────────────────── */}
      <footer className="w-full bg-[#080D1D] border-t border-[#1E293B] py-6 mt-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[#A5ADBE] text-xs">
          <div className="flex items-center gap-2">
            <span className="font-['Sora',sans-serif] text-xs font-semibold text-[#F5F5FA] uppercase tracking-wider">
              ROAMLY
            </span>
            <span>•</span>
            <span>AI Predictive Travel Telemetry</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Global Radar Node #402-A</span>
            <span className="text-[#19C6B5]">Precision 99.8%</span>
            <span>© 2025 ROAMLY Inc.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
