import React from 'react';

export interface JourneyStop {
  name?: string;
  code?: string;
  time?: string;
  color?: string;
}

export interface JourneyLineProps {
  variant?: 'hero' | 'login' | 'connector' | 'timeline';
  stops?: JourneyStop[];
  className?: string;
  showBus?: boolean;
  animated?: boolean;
}

export const JourneyLine: React.FC<JourneyLineProps> = ({
  variant = 'hero',
  stops = [],
  className = '',
  showBus = true,
  animated = true,
}) => {
  if (variant === 'hero') {
    return (
      <div className={`w-full relative pointer-events-none ${className}`}>
        <svg
          className="w-full h-[320px] overflow-visible"
          viewBox="0 0 390 320"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="mistRidgeBack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF7A59" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0B1220" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="mistRidgeFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2E3544" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0B1220" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="journeyGlowHero" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#44E2CD" />
              <stop offset="45%" stopColor="#FDBA74" />
              <stop offset="100%" stopColor="#FF7A59" />
            </linearGradient>
            <filter id="softGlowHero" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur result="blur" stdDeviation="3" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Distant Tea Hills & Ridges */}
          <path
            d="M-20 220 C 60 170, 140 210, 210 165 C 290 120, 340 150, 410 130 L410 320 L-20 320 Z"
            fill="url(#mistRidgeBack)"
          />
          {/* Fore-ridge with Contours */}
          <path
            d="M-10 260 C 80 230, 160 250, 240 210 C 310 180, 360 195, 410 175 L410 320 L-10 320 Z"
            fill="url(#mistRidgeFront)"
          />
          <path
            d="M20 270 Q 120 240, 220 260"
            stroke="#44E2CD"
            strokeDasharray="3 4"
            strokeOpacity="0.15"
            strokeWidth="1.5"
          />
          <path
            d="M140 235 Q 240 210, 340 225"
            stroke="#FFB4A2"
            strokeDasharray="4 6"
            strokeOpacity="0.18"
            strokeWidth="1.5"
          />

          {/* The Glowing Ribbon Journey Line */}
          <path
            id="mainHeroRoute"
            d="M 45 285 C 90 275, 120 210, 195 205 C 265 200, 280 135, 335 125"
            filter="url(#softGlowHero)"
            stroke="url(#journeyGlowHero)"
            strokeLinecap="round"
            strokeWidth="3.5"
            className={animated ? 'transition-all duration-700' : ''}
          />

          {/* Waypoint Beads along the path */}
          {/* Origin Stop */}
          <circle cx="45" cy="285" fill="#44E2CD" fillOpacity="0.25" r="8" className="animate-pulse" />
          <circle cx="45" cy="285" fill="#44E2CD" r="4.5" />
          <circle cx="45" cy="285" fill="#FFFDF9" r="2" />

          {/* Midpoint Stop */}
          <circle cx="195" cy="205" fill="#FDBA74" fillOpacity="0.3" r="8" />
          <circle cx="195" cy="205" fill="#FDBA74" r="4" />

          {/* Hilltop Destination Stop */}
          <circle cx="335" cy="125" fill="#FF7A59" fillOpacity="0.35" r="9" className="animate-pulse" />
          <circle cx="335" cy="125" fill="#FF7A59" r="5" />
          <circle cx="335" cy="125" fill="#FFFDF9" r="2.5" />

          {/* Handcrafted Roamly Travel Bus on Peak */}
          {showBus && (
            <g transform="translate(315, 88)" className="transition-transform duration-500 hover:scale-105">
              {/* Headlight beam */}
              <polygon fill="#FDBA74" fillOpacity="0.3" points="0,18 -34,26 -30,33 0,22" />
              {/* Bus Frame */}
              <rect x="0" y="4" width="36" height="20" rx="6" fill="#FFFDF9" />
              {/* Windows */}
              <rect x="3" y="7" width="8" height="6" rx="1.5" fill="#0B1220" />
              <rect x="13" y="7" width="8" height="6" rx="1.5" fill="#0B1220" />
              <rect x="23" y="7" width="9" height="6" rx="1.5" fill="#0B1220" />
              {/* Wheels */}
              <circle cx="8" cy="24" r="3.5" fill="#19202E" />
              <circle cx="28" cy="24" r="3.5" fill="#19202E" />
              <circle cx="8" cy="24" r="1.5" fill="#FFFDF9" />
              <circle cx="28" cy="24" r="1.5" fill="#FFFDF9" />
              {/* Tiny glowing headlight bead */}
              <circle cx="1" cy="17" r="2" fill="#FF7A59" className="animate-pulse" />
            </g>
          )}
        </svg>
      </div>
    );
  }

  if (variant === 'login') {
    return (
      <div className={`w-48 h-20 relative flex items-center justify-center ${className}`}>
        <svg
          className="w-full h-full overflow-visible drop-shadow-[0_4px_16px_rgba(45,212,191,0.25)]"
          viewBox="0 0 200 90"
          fill="none"
        >
          <defs>
            <linearGradient id="loginRouteGrad" x1="20" y1="70" x2="180" y2="55" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF7A59" />
              <stop offset="50%" stopColor="#FFDAD2" />
              <stop offset="100%" stopColor="#44E2CD" />
            </linearGradient>
            <filter id="loginSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur result="blur" stdDeviation="3" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Contour Lines */}
          <path
            d="M 10 45 C 50 15, 110 90, 190 35"
            stroke="#FFDAD2"
            strokeDasharray="3 4"
            strokeOpacity="0.2"
            strokeWidth="1.5"
          />
          <path
            d="M 5 65 C 60 10, 130 95, 195 50"
            stroke="#44E2CD"
            strokeDasharray="2 3"
            strokeOpacity="0.2"
            strokeWidth="1.5"
          />

          {/* Main Path */}
          <path
            d="M 28 68 C 45 45, 65 20, 100 20 C 135 20, 145 60, 172 58"
            stroke="url(#loginRouteGrad)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Beads */}
          <circle cx="28" cy="68" r="8" fill="#FF7A59" fillOpacity="0.3" />
          <circle cx="28" cy="68" r="5" fill="#FF7A59" />
          <circle cx="28" cy="68" r="2.5" fill="#FFFDF9" />

          <circle cx="100" cy="20" r="4.5" fill="#FFB4A2" />

          <circle cx="172" cy="58" r="9" fill="#44E2CD" fillOpacity="0.25" filter="url(#loginSoftGlow)" />
          <circle cx="172" cy="58" r="6" fill="#44E2CD" />
          <circle cx="172" cy="58" r="3" fill="#FFFDF9" />

          {/* Mini Carriage */}
          {showBus && (
            <g transform="translate(156, 12)">
              <rect width="26" height="20" rx="6" fill="#FFFDF9" />
              <rect x="4" y="4" width="7" height="6" rx="2" fill="#0B1220" />
              <rect x="15" y="4" width="7" height="6" rx="2" fill="#0B1220" />
              <circle cx="7" cy="21" r="2.5" fill="#0B1220" />
              <circle cx="19" cy="21" r="2.5" fill="#0B1220" />
            </g>
          )}
        </svg>
      </div>
    );
  }

  if (variant === 'connector') {
    return (
      <div className={`flex-1 relative flex items-center justify-center ${className}`}>
        <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 24" fill="none">
          <path
            d="M 0 12 C 30 2, 70 22, 100 12"
            stroke="#44E2CD"
            strokeWidth="2.5"
            strokeDasharray="4 4"
            className="opacity-80"
          />
          <circle cx="50" cy="12" r="3" fill="#FF7A59" className="animate-pulse" />
        </svg>
      </div>
    );
  }

  // Timeline / mini card variant
  return (
    <div className={`w-full flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-1.5 text-xs">
        <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] shadow-[0_0_8px_#2DD4BF]"></span>
        <span className="text-gray-300 font-medium">{stops[0]?.name || 'Origin'}</span>
      </div>

      <div className="flex-1 mx-3 relative flex items-center">
        <div className="w-full h-0.5 bg-gradient-to-r from-[#2DD4BF] via-[#FDBA74] to-[#FF7A59]"></div>
        <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#FF7A59]"></div>
      </div>

      <div className="flex items-center gap-1.5 text-xs">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A59] shadow-[0_0_8px_#FF7A59]"></span>
        <span className="text-gray-300 font-medium">{stops[1]?.name || 'Destination'}</span>
      </div>
    </div>
  );
};

