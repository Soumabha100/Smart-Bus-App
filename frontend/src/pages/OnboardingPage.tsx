import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { PillButton } from '../components/ui/PillButton';
import { GlassCard } from '../components/ui/GlassCard';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0C1321] text-[#DCE2F6] flex flex-col selection:bg-[#44E2CD]/30 selection:text-[#44E2CD] overflow-x-hidden">
      {/* Desktop Navigation */}
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 flex flex-col justify-center">
        {/* Desktop 2-Column Hero Grid (1440px / 1280px friendly) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Brand Story & Call-to-Actions (6-7 Cols on Desktop) */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-20">
            {/* Chapter Badge */}
            <div className="flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full bg-[#19202E]/80 border border-white/10 backdrop-blur-md">
              <span className="material-symbols-outlined text-[#FF7A59] text-[18px]">auto_stories</span>
              <span className="font-inter text-xs font-semibold tracking-widest text-[#FFB4A2] uppercase">
                Chapter I • The Serpentine Way
              </span>
            </div>

            {/* Display Typography */}
            <h1 className="font-sora text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#DCE2F6] tracking-tight leading-[1.15] mb-4">
              Every journey
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A59] via-[#FDBA74] to-[#44E2CD]">
                has a story.
              </span>
            </h1>

            {/* Poetic Subtitle */}
            <p className="font-inter text-base sm:text-lg text-[#DFC0B8] leading-relaxed mb-8 max-w-xl">
              Find your ride. Feel the road. Handcrafted bus routes across mist-covered Bengal hills, serene tea terraces, and sweeping coastal highways.
            </p>

            {/* Route Feature Mosaic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8 max-w-lg">
              <div className="p-4 rounded-24 bg-[#151B2A] border border-white/10 flex flex-col gap-1.5 shadow-md">
                <div className="flex items-center gap-2 text-[#44E2CD]">
                  <span className="material-symbols-outlined text-[20px]">filter_hdr</span>
                  <span className="font-inter text-sm font-semibold tracking-wide">Scenic Horizons</span>
                </div>
                <span className="font-inter text-xs text-[#DFC0B8]">
                  Curated window-side seats facing Himalayan valleys &amp; lush estuaries.
                </span>
              </div>

              <div className="p-4 rounded-24 bg-[#151B2A] border border-white/10 flex flex-col gap-1.5 shadow-md">
                <div className="flex items-center gap-2 text-[#FFB4A2]">
                  <span className="material-symbols-outlined text-[20px]">schedule</span>
                  <span className="font-inter text-sm font-semibold tracking-wide">Unhurried Transit</span>
                </div>
                <span className="font-inter text-xs text-[#DFC0B8]">
                  Slow travel for quiet souls with verified overnight sleeper coaches.
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <PillButton
                variant="primary"
                size="lg"
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8 shadow-[0_8px_24px_rgba(255,122,89,0.45)] text-base"
                icon={<span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
              >
                Start my journey
              </PillButton>

              <Link
                to="/login"
                className="font-inter text-sm text-[#FFF7ED] hover:text-[#FF7A59] transition-colors flex items-center gap-1.5 px-6 py-3 rounded-full hover:bg-white/5"
              >
                <span>I already have an account</span>
                <span className="material-symbols-outlined text-[16px] text-gray-400">login</span>
              </Link>
            </div>

            {/* Footnote */}
            <div className="mt-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#44E2CD]" />
              <p className="font-inter text-xs text-gray-400 tracking-wider uppercase">
                Journeys curated with care &amp; quiet wonder
              </p>
            </div>
          </div>

          {/* Right Column: Panoramic Scenic Journey Line Stage (5-6 Cols on Desktop) */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            {/* Ambient Background Glows */}
            <div className="absolute -top-16 -left-12 w-80 h-80 bg-[#FF7A59]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-12 -right-16 w-80 h-80 bg-[#44E2CD]/15 rounded-full blur-3xl pointer-events-none" />

            <GlassCard className="w-full relative overflow-hidden p-6 sm:p-8 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-gradient-to-b from-[#FDBA74]/15 via-[#FF7A59]/10 to-[#0C1321]/90">
              {/* Top Pill Bar inside card */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#19202E]/80 border border-white/10 text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#FF7A59] shadow-[0_0_8px_#FF7A59]" />
                  <span className="font-inter text-[#DCE2F6] font-medium">Siliguri ⟿ Darjeeling</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#19202E]/60 border border-white/10 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#44E2CD] animate-pulse" />
                  <span className="font-inter text-[10px] text-[#44E2CD] uppercase font-bold tracking-widest">
                    Live Trail
                  </span>
                </div>
              </div>

              {/* Majestic SVG Hillside & Route Path */}
              <div className="w-full relative py-4">
                <svg
                  className="w-full h-[280px] sm:h-[320px] overflow-visible"
                  viewBox="0 0 390 320"
                  fill="none"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="mistRidgeBackDesktop" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF7A59" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#0C1321" stopOpacity="0.9" />
                    </linearGradient>
                    <linearGradient id="mistRidgeFrontDesktop" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2E3544" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#0C1321" stopOpacity="1" />
                    </linearGradient>
                    <linearGradient id="journeyGlowDesktop" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#44E2CD" />
                      <stop offset="45%" stopColor="#FDBA74" />
                      <stop offset="100%" stopColor="#FF7A59" />
                    </linearGradient>
                    <filter id="softGlowDesktop" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur result="blur" stdDeviation="3.5" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Terraces */}
                  <path
                    d="M-20 220 C 60 170, 140 210, 210 165 C 290 120, 340 150, 410 130 L410 320 L-20 320 Z"
                    fill="url(#mistRidgeBackDesktop)"
                  />
                  <path
                    d="M-10 260 C 80 230, 160 250, 240 210 C 310 180, 360 195, 410 175 L410 320 L-10 320 Z"
                    fill="url(#mistRidgeFrontDesktop)"
                  />
                  <path
                    d="M20 270 Q 120 240, 220 260"
                    stroke="#44E2CD"
                    strokeDasharray="3 4"
                    strokeOpacity="0.2"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M140 235 Q 240 210, 340 225"
                    stroke="#FFB4A2"
                    strokeDasharray="4 6"
                    strokeOpacity="0.25"
                    strokeWidth="1.5"
                  />

                  {/* Glowing Route Line */}
                  <path
                    d="M 45 285 C 90 275, 120 210, 195 205 C 265 200, 280 135, 335 125"
                    filter="url(#softGlowDesktop)"
                    stroke="url(#journeyGlowDesktop)"
                    strokeLinecap="round"
                    strokeWidth="4"
                  />

                  {/* Stops */}
                  <circle cx="45" cy="285" fill="#44E2CD" fillOpacity="0.3" r="8" />
                  <circle cx="45" cy="285" fill="#44E2CD" r="4.5" />
                  <circle cx="45" cy="285" fill="#FFFDF9" r="2" />

                  <circle cx="195" cy="205" fill="#FDBA74" fillOpacity="0.3" r="8" />
                  <circle cx="195" cy="205" fill="#FDBA74" r="4" />

                  <circle cx="335" cy="125" fill="#FF7A59" fillOpacity="0.35" r="9" />
                  <circle cx="335" cy="125" fill="#FF7A59" r="5" />
                  <circle cx="335" cy="125" fill="#FFFDF9" r="2.5" />

                  {/* Hilltop Bus silhouette */}
                  <g transform="translate(315, 88)">
                    <polygon fill="#FDBA74" fillOpacity="0.3" points="0,18 -34,26 -30,33 0,22" />
                    <rect x="0" y="4" width="36" height="20" rx="6" fill="#FFFDF9" className="shadow-lg" />
                    <rect x="3" y="7" width="8" height="6" rx="1.5" fill="#0C1321" />
                    <rect x="13" y="7" width="8" height="6" rx="1.5" fill="#0C1321" />
                    <rect x="23" y="7" width="9" height="6" rx="1.5" fill="#0C1321" />
                    <circle cx="8" cy="24" r="3.5" fill="#19202E" />
                    <circle cx="28" cy="24" r="3.5" fill="#19202E" />
                    <circle cx="8" cy="24" r="1.5" fill="#FFFDF9" />
                    <circle cx="28" cy="24" r="1.5" fill="#FFFDF9" />
                    <circle cx="1" cy="17" r="2" fill="#FF7A59" className="animate-pulse" />
                  </g>
                </svg>
              </div>

              {/* Card Footer Tagline */}
              <div className="flex items-center justify-between text-xs text-[#DFC0B8] pt-2 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#44E2CD]">schedule</span>
                  <span>3h 15m Mountain Pass</span>
                </span>
                <span className="text-[#44E2CD] font-medium">Twilight Express Service</span>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
};
