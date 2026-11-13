import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { JourneyLine } from '../components/ui/JourneyLine';
import { PillButton } from '../components/ui/PillButton';
import { GlassCard } from '../components/ui/GlassCard';
import { tokenStorage } from '../utils/tokenStorage';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('rohan.wanderer@gmail.com');
  const [password, setPassword] = useState('journey2024');
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setShowErrorBanner(true);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      tokenStorage.setToken('roamly_jwt_token_sample');
      tokenStorage.setUser({
        name: email.split('@')[0].replace('.', ' ').replace(/(?:^|\s)\S/g, (a) => a.toUpperCase()),
        email,
      });

      const destination = (location.state as { from?: { pathname: string } })?.from?.pathname || '/home';
      navigate(destination, { replace: true });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0C1321] text-[#DCE2F6] flex flex-col selection:bg-[#44E2CD]/30 selection:text-[#44E2CD]">
      {/* Desktop Navigation */}
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 flex items-center justify-center">
        {/* Desktop 2-Column Grid (1440px / 1280px / 1366px balanced) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Visual Story & Travel Diary Context (5-6 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#19202E]/70 text-[#DCE2F6] mb-3 border border-white/5 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#44E2CD] animate-pulse" />
              <span className="font-inter text-[10px] tracking-wider uppercase font-semibold text-[#44E2CD]">
                Traveler Vault
              </span>
            </div>

            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-[#DCE2F6] tracking-tight mb-2">
              Good to see you again
            </h1>
            <p className="font-inter text-sm sm:text-base text-[#DFC0B8] mb-6 max-w-md">
              Pick up right where your travel diary left off. Your routes, seat preferences, and offline boarding passes await.
            </p>

            {/* Lyrical Journey Line Illustration */}
            <div className="w-full flex justify-center lg:justify-start py-2 mb-6">
              <JourneyLine variant="login" showBus={true} />
            </div>

            {/* Travel Diary Snippet Preview Tile */}
            <div className="w-full max-w-md bg-[#151B2A]/90 border border-white/10 rounded-24 p-4 flex items-center gap-3 shadow-md mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF7A59] to-[#44E2CD] flex items-center justify-center text-white shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[20px]">train</span>
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <span className="font-inter text-[10px] text-[#44E2CD] uppercase tracking-wider font-semibold">
                  Last Recorded Leg
                </span>
                <span className="font-sora text-sm font-semibold text-white truncate">
                  Kyoto Express · Car 4
                </span>
                <span className="font-inter text-xs text-gray-400 truncate">
                  Draft note: &ldquo;Sunset beyond Mount Hiei&rdquo;
                </span>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="material-symbols-outlined text-[#44E2CD] text-[18px]">verified_user</span>
              <span>Encrypted traveler credentials &amp; conductor validation</span>
            </div>
          </div>

          {/* Right Column: Authentication Card (6-7 Cols) */}
          <div className="lg:col-span-7 flex justify-center">
            <GlassCard className="w-full max-w-lg p-6 sm:p-8 lg:p-10 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              {/* Friendly Error State Banner */}
              {showErrorBanner && (
                <div className="w-full bg-rose-950/40 border border-rose-800/60 rounded-2xl p-3.5 mb-6 flex items-start gap-3 transition-all">
                  <span className="material-symbols-outlined text-[20px] text-[#FF7A59] shrink-0 mt-0.5">
                    info
                  </span>
                  <div className="flex flex-col flex-1 text-xs">
                    <span className="font-medium text-rose-300">
                      That password doesn’t match.
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[#FF7A59]">Try again?</span>
                      <span className="text-[#FF7A59] text-[10px]">✦</span>
                      <button
                        type="button"
                        onClick={() => alert('Password reset link has been dispatched to your email.')}
                        className="text-[#44E2CD] hover:underline"
                      >
                        Forgot passcode?
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Email Input */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="travel-email" className="font-semibold text-gray-300 uppercase tracking-wider">
                      Work / Personal Email
                    </label>
                    <span className="text-[#44E2CD] text-[11px] font-semibold">Saved Traveler</span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-4 text-[20px] text-[#FF7A59] pointer-events-none">
                      local_post_office
                    </span>
                    <input
                      id="travel-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="wanderer@roamly.journal"
                      required
                      className="w-full min-h-[50px] py-3 pl-12 pr-4 bg-[#151B2A] text-white rounded-2xl border border-white/10 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[#44E2CD] focus:border-transparent transition-all placeholder:text-gray-500"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="travel-password" className="font-semibold text-gray-300 uppercase tracking-wider">
                      Passcode
                    </label>
                    <span className="text-gray-400 text-[11px]">6+ Characters</span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-4 text-[20px] text-gray-400 pointer-events-none">
                      lock_open
                    </span>
                    <input
                      id="travel-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full min-h-[50px] py-3 pl-12 pr-12 bg-[#151B2A] text-white rounded-2xl border border-white/10 font-inter text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-[#44E2CD] focus:border-transparent transition-all placeholder:text-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                      className="absolute right-3.5 p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Primary Continue Button */}
                <PillButton
                  type="submit"
                  variant="dark"
                  size="lg"
                  fullWidth
                  disabled={isLoading}
                  showDot={true}
                  dotColor="bg-[#44E2CD]"
                  className="mt-2 bg-[#070E1C] hover:bg-[#151B2A] border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.5)] h-[52px]"
                  icon={<span className="material-symbols-outlined text-[20px] text-[#44E2CD]">arrow_right_alt</span>}
                >
                  {isLoading ? 'Verifying Passport...' : 'Continue to Dashboard'}
                </PillButton>
              </form>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-6">
                <div className="w-full h-px bg-white/10" />
                <span className="absolute px-4 bg-[#19202E] font-inter text-[11px] text-gray-400 uppercase tracking-widest">
                  Or Passport With
                </span>
              </div>

              {/* Social Login Options */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => alert('Apple Passkey authentication connected!')}
                  className="h-12 rounded-full bg-[#151B2A] hover:bg-[#232A39] border border-white/10 text-[#DCE2F6] font-inter text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.76 1.04-1.82.93-2.87-.9.04-1.99.6-2.63 1.36-.57.65-1.07 1.72-.94 2.74 1 .08 2.02-.47 2.64-1.23z" />
                  </svg>
                  <span>Apple ID</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('Google Passkey authentication connected!')}
                  className="h-12 rounded-full bg-[#151B2A] hover:bg-[#232A39] border border-white/10 text-[#DCE2F6] font-inter text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  <span>Google</span>
                </button>
              </div>

              {/* Join us prompt */}
              <div className="flex items-center justify-center gap-1.5 mt-8 pt-4 border-t border-white/10">
                <span className="font-inter text-xs text-gray-400">New traveler here?</span>
                <Link
                  to="/register"
                  className="font-sora text-xs font-semibold text-[#FF7A59] hover:text-[#FFB4A2] transition-colors inline-flex items-center gap-0.5"
                >
                  <span>Join us</span>
                  <span className="material-symbols-outlined text-[14px]">east</span>
                </Link>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
};
