import { useMemo } from 'react';

export type TimeThemePeriod = 'morning' | 'evening' | 'night';

export interface TimeThemeColors {
  primary: string;
  secondary: string;
  glow: string;
  accent: string;
  bgGradient: string;
}

export interface TimeTheme {
  period: TimeThemePeriod;
  greeting: string;
  colors: TimeThemeColors;
}

const THEMES: Record<TimeThemePeriod, { greeting: string; colors: TimeThemeColors }> = {
  morning: {
    greeting: 'Good morning',
    colors: {
      primary: '#FDBA74', // peach
      secondary: '#F59E0B', // gold
      glow: 'rgba(253, 186, 116, 0.3)',
      accent: '#FF7A59',
      bgGradient: 'from-[#FDBA74]/25 via-[#FF7A59]/20 to-transparent',
    },
  },
  evening: {
    greeting: 'Good evening',
    colors: {
      primary: '#8B5CF6', // violet
      secondary: '#1E1B4B', // deep blue
      glow: 'rgba(139, 92, 246, 0.3)',
      accent: '#FF7A59',
      bgGradient: 'from-[#8B5CF6]/25 via-[#1E1B4B]/30 to-transparent',
    },
  },
  night: {
    greeting: 'Good night',
    colors: {
      primary: '#0B1220', // midnight navy
      secondary: '#2DD4BF', // teal
      glow: 'rgba(45, 212, 191, 0.35)',
      accent: '#2DD4BF',
      bgGradient: 'from-[#19202E]/60 via-[#0B1220]/80 to-transparent',
    },
  },
};

/**
 * Hook to retrieve time-of-day theme and greeting.
 * Can be driven by current system hour or departure time string (e.g. "08:30" or "20:30").
 */
export function useTimeTheme(timeOrHour?: number | string): TimeTheme {
  return useMemo(() => {
    let hour: number;

    if (typeof timeOrHour === 'number') {
      hour = timeOrHour;
    } else if (typeof timeOrHour === 'string' && timeOrHour.includes(':')) {
      const parsed = parseInt(timeOrHour.split(':')[0], 10);
      hour = Number.isNaN(parsed) ? new Date().getHours() : parsed;
    } else {
      hour = new Date().getHours();
    }

    let period: TimeThemePeriod;
    if (hour >= 5 && hour < 12) {
      period = 'morning';
    } else if (hour >= 17 && hour < 22) {
      period = 'evening';
    } else {
      period = 'night';
    }

    const selected = THEMES[period];
    return {
      period,
      greeting: selected.greeting,
      colors: selected.colors,
    };
  }, [timeOrHour]);
}

