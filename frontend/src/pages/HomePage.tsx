import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, Chip, BottomBar, JourneyLine } from '../components/ui';
import { useTimeTheme } from '../hooks/useTimeTheme';
import { tokenStorage } from '../utils/tokenStorage';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTimeTheme();
  const user = tokenStorage.getUser();

  const handleLogout = () => {
    tokenStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#FFF7ED] pb-24 p-4">
      <div className="max-w-md mx-auto w-full pt-4">
        {/* Header with greeting */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#2DD4BF]">
              {theme.greeting}
            </p>
            <h1 className="font-sora text-2xl font-bold text-white">
              {user?.name || 'Traveler'}
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className="w-10 h-10 rounded-full bg-[#19202E] border border-white/10 flex items-center justify-center font-bold text-[#FF7A59] hover:bg-[#232A39] transition-colors"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
          </button>
        </header>

        {/* Plan your line card */}
        <GlassCard className="mb-6">
          <h2 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-4">
            Plan your line
          </h2>

          <div className="flex items-center justify-between mb-6 px-2">
            <button
              type="button"
              className="w-16 h-16 rounded-full bg-[#0B1220] border-2 border-[#2DD4BF] flex flex-col items-center justify-center text-xs font-bold text-[#2DD4BF] shadow-[0_0_15px_rgba(45,212,191,0.3)] active:scale-95 transition-transform"
            >
              <span>KOL</span>
              <span className="text-[9px] font-normal text-gray-400">Kolkata</span>
            </button>

            <JourneyLine variant="connector" />

            <button
              type="button"
              className="w-16 h-16 rounded-full bg-[#0B1220] border-2 border-[#FF7A59] flex flex-col items-center justify-center text-xs font-bold text-[#FF7A59] shadow-[0_0_15px_rgba(255,122,89,0.3)] active:scale-95 transition-transform"
            >
              <span>DAR</span>
              <span className="text-[9px] font-normal text-gray-400">Darjeeling</span>
            </button>
          </div>

          {/* Date row */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
            <Chip variant="date" active>
              Today, 14 Nov
            </Chip>
            <Chip variant="date">Tomorrow, 15 Nov</Chip>
            <Chip variant="date">Sat, 16 Nov</Chip>
          </div>

          {/* Mood chips */}
          <div className="flex flex-wrap gap-2">
            <Chip active>✨ Sleep well</Chip>
            <Chip>⚡ Fastest</Chip>
            <Chip>💰 Budget friendly</Chip>
            <Chip>🌄 Scenic route</Chip>
          </div>
        </GlassCard>

        {/* Journeys people love */}
        <h2 className="font-sora text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Journeys people love
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
          <GlassCard className="min-w-[260px] p-4 shrink-0">
            <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
              <span>Siliguri ⟿ Gangtok</span>
              <span className="text-[#2DD4BF] font-bold">₹450</span>
            </div>
            <p className="font-sora text-sm font-semibold text-white mb-1">Teesta Ridge Way</p>
            <p className="text-xs text-gray-400">4h 30m • Himalayan route</p>
          </GlassCard>

          <GlassCard className="min-w-[260px] p-4 shrink-0">
            <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
              <span>Kolkata ⟿ Digha</span>
              <span className="text-[#2DD4BF] font-bold">₹320</span>
            </div>
            <p className="font-sora text-sm font-semibold text-white mb-1">Bay Coastline Express</p>
            <p className="text-xs text-gray-400">4h 00m • AC Volvo</p>
          </GlassCard>
        </div>
      </div>

      <BottomBar />
    </div>
  );
};
