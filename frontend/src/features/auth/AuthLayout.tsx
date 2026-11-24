import type { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../../components/brand/Logo';
import loginHeroBg from '../../assets/Login_Hero.webp';

export interface AuthLayoutProps {
  children: ReactNode;
  activeMode: 'login' | 'register';
  title: string;
  subtitle: string;
}

export const AuthLayout: FC<AuthLayoutProps> = ({
  children,
  activeMode,
  title,
  subtitle,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] w-full flex flex-col justify-between overflow-x-hidden antialiased selection:bg-accent-tint selection:text-on-accent-tint">
      {/* 1. FIXED VIEWPORT BACKGROUND: Locked to 100vw x 100vh so it NEVER stretches between pages.
          z-0 ensures it renders above body canvas background, while content at z-10 renders crisply on top */}
      <div className="fixed inset-0 z-0 w-screen h-screen overflow-hidden pointer-events-none select-none">
        <img
          src={loginHeroBg}
          alt="West Bengal Heritage Travel Backdrop"
          aria-hidden="true"
          className="w-full h-full object-cover object-bottom"
        />
        {/* Soft responsive ambient scrim on small mobile (<1024px) for readability */}
        <div className="absolute inset-0 bg-canvas/30 lg:bg-transparent backdrop-blur-[1px] lg:backdrop-blur-none" />
      </div>

      {/* 2. MAIN ARENA (TWO-LAYOUT DESIGN: Sky Capsule Narrative + Floating Auth Form) */}
      {/* Fixed top-alignment (justify-start) guarantees zero jumping or vertical layout shifts */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 flex flex-col justify-start pt-2 sm:pt-4 pb-4">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Compact Floating Sky Glass Pod (Docked in the open sky zone, shifted rightwards away from the tree) */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-start items-start self-start pt-1 lg:pt-2 lg:pl-10 xl:pl-16">
            <div className="w-full max-w-[390px] bg-surface/80 backdrop-blur-md border border-white/85 shadow-[0_10px_30px_rgba(0,13,33,0.06)] ring-1 ring-white/60 rounded-2xl p-4 sm:p-5">
              {/* Brand Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-line/25">
                <Link to="/" className="inline-block focus:outline-none">
                  <Logo size="sm" variant="bus" />
                </Link>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-tint/80 border border-accent/20 text-[11px] font-bold text-on-accent-tint">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" aria-hidden="true" />
                  <span>Smart Transit Verified</span>
                </div>
              </div>

              {/* High-Contrast Popping Headline */}
              <h1 className="font-sans text-2xl sm:text-[28px] font-extrabold text-ink-strong tracking-tight leading-tight mt-2.5">
                Your journey <br className="hidden sm:inline" />
                <span className="text-accent">begins here.</span>
              </h1>

              {/* Informative Subtext */}
              <p className="font-sans text-xs sm:text-sm font-medium text-ink-muted leading-relaxed mt-1">
                Discover Bengal, one ride at a time. Luxury express coaches across Kolkata, Howrah, Digha, and beyond.
              </p>

              {/* Slim Single-Line Trust Badges (Compact & clean, zero landmark overlap) */}
              <div className="flex items-center gap-2.5 pt-2.5 mt-2.5 border-t border-line/25 text-[11px] font-semibold text-ink-strong">
                <div className="inline-flex items-center gap-1 text-accent">
                  <span className="material-symbols-outlined text-[15px]">directions_bus</span>
                  <span>450+ Routes</span>
                </div>
                <span className="text-line text-[9px]">&bull;</span>
                <div className="inline-flex items-center gap-1 text-success">
                  <span className="material-symbols-outlined text-[15px]">verified_user</span>
                  <span>Instant Seat Holds</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating iOS Frosted Glass Form Card */}
          <div className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end xl:justify-center self-start">
            <div className="w-full max-w-[430px] bg-surface/90 backdrop-blur-xl border border-white/70 shadow-[0_20px_50px_rgba(0,13,33,0.12)] rounded-3xl p-5 sm:p-7 max-h-[calc(100vh-120px)] overflow-y-auto">
              {/* Segmented Sign In / Sign Up Switcher */}
              <div className="flex p-1 bg-surface-2/80 rounded-xl mb-4 border border-line/50" role="tablist">
                <Link
                  to="/login"
                  role="tab"
                  aria-selected={activeMode === 'login'}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all min-h-[38px] ${
                    activeMode === 'login'
                      ? 'bg-brand text-on-brand shadow-sm'
                      : 'text-ink-muted hover:text-ink-strong'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">person</span>
                  <span>Sign In</span>
                </Link>

                <Link
                  to="/register"
                  role="tab"
                  aria-selected={activeMode === 'register'}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all min-h-[38px] ${
                    activeMode === 'register'
                      ? 'bg-brand text-on-brand shadow-sm'
                      : 'text-ink-muted hover:text-ink-strong'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">person_add</span>
                  <span>Sign Up</span>
                </Link>
              </div>

              {/* Card Header */}
              <div className="mb-4">
                <h2 className="text-2xl font-extrabold text-ink-strong tracking-tight">
                  {title}
                </h2>
                <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                  {subtitle}
                </p>
              </div>

              {/* Form Content */}
              <div>{children}</div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. SLEEK RETAIL/TRANSIT MICRO-FOOTER: Anchored over the road, zero scrolling required */}
      <footer className="relative z-10 w-full py-2.5 sm:py-3 px-4 text-center shrink-0">
        <p className="text-[11px] sm:text-xs text-ink-strong/80 font-medium flex items-center justify-center flex-wrap gap-x-2 gap-y-1">
          <span>&copy; {new Date().getFullYear()} OneGoBus</span>
          <span className="opacity-40">&bull;</span>
          <span>West Bengal AI Smart Bus Booking Platform</span>
          <span className="opacity-40">&bull;</span>
          <Link to="/privacy" className="hover:text-accent transition-colors hover:underline">
            Privacy
          </Link>
          <span className="opacity-40">&bull;</span>
          <Link to="/terms" className="hover:text-accent transition-colors hover:underline">
            Terms
          </Link>
          <span className="opacity-40">&bull;</span>
          <span className="inline-flex items-center gap-1 text-ink-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Secure &amp; Encrypted
          </span>
        </p>
      </footer>
    </div>
  );
};
