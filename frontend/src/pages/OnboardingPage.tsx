import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PillButton } from '../components/ui/PillButton';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0C1321] text-[#DCE2F6] flex flex-col items-center justify-start relative overflow-x-hidden selection:bg-[#44E2CD]/30 selection:text-[#44E2CD]">
      {/* Outer wrapper for desktop & mobile centering */}
      <div className="w-full max-w-[480px] min-h-screen flex flex-col justify-between relative z-10 shadow-2xl bg-[#0C1321]">
        {/* Top Atmospheric Scenic Stage */}
        <div className="relative w-full h-[400px] flex flex-col justify-between p-4 sm:p-6 overflow-hidden bg-gradient-to-b from-[#FDBA74]/25 via-[#FF7A59]/20 to-transparent">
          {/* Ambient Radial Light Glows */}
          <div className="absolute -top-16 -left-12 w-64 h-64 bg-[#FF7A59]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-12 -right-16 w-56 h-56 bg-[#44E2CD]/15 rounded-full blur-2xl pointer-events-none" />

          {/* Top Brand & Status Pills */}
          <div className="relative z-10 flex items-center justify-between w-full">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#19202E]/70 backdrop-blur-xl border border-white/5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FF7A59] shadow-[0_0_8px_#FF7A59]" />
              <span className="font-inter text-xs text-[#DCE2F6] font-medium tracking-wide">
                Roamly • The Journey Line
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#19202E]/50 backdrop-blur-md border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#44E2CD] animate-pulse" />
              <span className="font-inter text-[10px] text-[#44E2CD] tracking-widest uppercase font-semibold">
                Live Trail
              </span>
            </div>
          </div>

          {/* Scenic SVG Landscape & Glowing Journey Line */}
          <div className="absolute inset-0 pointer-events-none flex items-end">
            <svg
              className="w-full h-[330px] overflow-visible"
              viewBox="0 0 390 320"
              fill="none"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="mistRidgeBack" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF7A59" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0C1321" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="mistRidgeFront" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2E3544" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0C1321" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="journeyGlow" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#44E2CD" />
                  <stop offset="45%" stopColor="#FDBA74" />
                  <stop offset="100%" stopColor="#FF7A59" />
                </linearGradient>
                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur result="blur" stdDeviation="3.5" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Distant Tea Hills & Terraces */}
              <path
                d="M-20 220 C 60 170, 140 210, 210 165 C 290 120, 340 150, 410 130 L410 320 L-20 320 Z"
                fill="url(#mistRidgeBack)"
              />
              <path
                d="M-10 260 C 80 230, 160 250, 240 210 C 310 180, 360 195, 410 175 L410 320 L-10 320 Z"
                fill="url(#mistRidgeFront)"
              />
              <path
                d="M20 270 Q 120 240, 220 260"
                stroke="#44E2CD"
                strokeDasharray="3 4"
                strokeOpacity="0.18"
                strokeWidth="1.5"
              />
              <path
                d="M140 235 Q 240 210, 340 225"
                stroke="#FFB4A2"
                strokeDasharray="4 6"
                strokeOpacity="0.2"
                strokeWidth="1.5"
              />

              {/* The Glowing Ribbon Journey Line */}
              <path
                d="M 45 285 C 90 275, 120 210, 195 205 C 265 200, 280 135, 335 125"
                filter="url(#softGlow)"
                stroke="url(#journeyGlow)"
                strokeLinecap="round"
                strokeWidth="4"
              />

              {/* Waypoint Beads along the path */}
              <circle cx="45" cy="285" fill="#44E2CD" fillOpacity="0.3" r="8" />
              <circle cx="45" cy="285" fill="#44E2CD" r="4.5" />
              <circle cx="45" cy="285" fill="#FFFDF9" r="2" />

              <circle cx="195" cy="205" fill="#FDBA74" fillOpacity="0.3" r="8" />
              <circle cx="195" cy="205" fill="#FDBA74" r="4" />

              <circle cx="335" cy="125" fill="#FF7A59" fillOpacity="0.35" r="9" />
              <circle cx="335" cy="125" fill="#FF7A59" r="5" />
              <circle cx="335" cy="125" fill="#FFFDF9" r="2.5" />

              {/* Hilltop Roamly Bus Marker with Headlight Beam */}
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

          {/* Active Waypoint Pill */}
          <div className="relative z-10 self-center mb-1">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#232A39]/85 backdrop-blur-xl border border-white/10 shadow-lg">
              <span className="material-symbols-outlined text-[#44E2CD] text-[16px]">alt_route</span>
              <span className="font-inter text-xs text-[#DCE2F6] font-medium">
                Siliguri <span className="text-[#FF7A59]">⟿</span> Darjeeling
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-500" />
              <span className="font-inter text-[11px] text-[#DFC0B8]">3h 15m</span>
              <span className="w-1 h-1 rounded-full bg-gray-500" />
              <span className="font-inter text-[11px] text-[#44E2CD] font-medium">
                Twilight express
              </span>
            </div>
          </div>
        </div>

        {/* Travel Chronicle Stage */}
        <div className="flex flex-col px-5 sm:px-6 pt-2 pb-8 relative z-20">
          {/* Chapter badge */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FF7A59]/15">
              <span className="material-symbols-outlined text-[#FF7A59] text-[16px]">auto_stories</span>
            </div>
            <span className="font-inter text-[11px] font-semibold tracking-widest text-[#FFB4A2] uppercase">
              Chapter I • The Serpentine Way
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-sora text-3xl sm:text-4xl font-bold text-[#DCE2F6] tracking-tight leading-tight mb-2">
            Every journey
            <br />
            has a story.
          </h1>

          {/* Subtitle */}
          <p className="font-inter text-sm text-[#DFC0B8] leading-relaxed mb-6">
            Find your ride. Feel the road. Handcrafted routes across mist-covered hills and coastal highways.
          </p>

          {/* Route Feature Mosaic Chips */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="p-3.5 rounded-24 bg-[#151B2A] border border-white/5 flex flex-col gap-1.5 shadow-sm">
              <div className="flex items-center gap-1.5 text-[#44E2CD]">
                <span className="material-symbols-outlined text-[18px]">filter_hdr</span>
                <span className="font-inter text-xs font-semibold tracking-wide">Scenic Horizons</span>
              </div>
              <span className="font-inter text-xs text-[#DFC0B8] line-clamp-1">
                Curated window-side seats
              </span>
            </div>

            <div className="p-3.5 rounded-24 bg-[#151B2A] border border-white/5 flex flex-col gap-1.5 shadow-sm">
              <div className="flex items-center gap-1.5 text-[#FFB4A2]">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                <span className="font-inter text-xs font-semibold tracking-wide">Unhurried Transit</span>
              </div>
              <span className="font-inter text-xs text-[#DFC0B8] line-clamp-1">
                Slow travel for quiet souls
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          <PillButton
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/register')}
            className="shadow-[0_8px_24px_rgba(255,122,89,0.4)]"
            icon={<span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
          >
            Start my journey
          </PillButton>

          {/* Secondary Action */}
          <div className="flex items-center justify-center mt-5 mb-2">
            <Link
              to="/login"
              className="font-inter text-sm text-[#FFF7ED] hover:text-[#FF7A59] transition-colors flex items-center gap-1.5 py-1"
            >
              <span>I already have an account</span>
              <span className="material-symbols-outlined text-[16px] text-gray-400">login</span>
            </Link>
          </div>

          {/* Footer tagline */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#44E2CD]/60" />
            <p className="font-inter text-[10px] text-gray-400 tracking-wider uppercase">
              Journeys curated with care &amp; quiet wonder
            </p>
            <span className="w-1.5 h-1.5 rounded-full bg-[#44E2CD]/60" />
          </div>
        </div>
      </div>
    </div>
  );
};
