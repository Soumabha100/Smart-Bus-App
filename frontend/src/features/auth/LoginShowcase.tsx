import type { FC } from 'react';

export const LoginShowcase: FC = () => {
  return (
    <div className="flex flex-col justify-between h-full gap-6">
      {/* Upper Section */}
      <div className="space-y-4">
        {/* Verified Badge */}
        <div className="inline-flex items-center gap-2 bg-surface px-3.5 py-1.5 rounded-full border border-line/60 shadow-sm self-start">
          <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" aria-hidden="true" />
          <span className="text-[11px] font-bold text-ink-strong uppercase tracking-wider">
            Verified Transit Network
          </span>
        </div>

        {/* Headline */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-strong tracking-tight">
            Welcome back, <br />
            <span className="text-accent">Traveler!</span>
          </h2>
          <p className="text-sm text-ink-muted mt-2 leading-relaxed">
            Intercity express routes across West Bengal and India. Concurrency-safe booking with instant confirmations.
          </p>
        </div>

        {/* Scenic Bus Card */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-surface-3 border border-line/40 shadow-sm">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtY84c8Jhq8mVoIYphcB0jVhjlhGwJfhPBuh9NXcOVhZbwWWRVy2oghdz0kYAGVPjshEfMlpOqH1ZmPxwKfaLr_SIz3w-9_rmOwfQ3tloe3Sa4m5swwwO2z8lrJl2L-rAV9k29lgsYPHuUV7Bh0-YYEBkE57_CAYKitNvZQbg60X3U-RMI0Luow74Wjok_MSWD51MB--GXOVyVQYB2ZgPzrXGlVDNDEzdw7CjUlEw"
            alt="One Go Bus traveling through scenic hills at sunrise"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand/85 via-brand/20 to-transparent flex items-end p-4">
            <div className="flex items-center gap-2 text-on-brand text-xs font-semibold">
              <span className="material-symbols-outlined text-[18px] text-accent-bright">route</span>
              <span>Connecting 450+ Cities &amp; Towns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Student Privilege Banner & Trust Badges */}
      <div className="space-y-4 pt-2">
        <div className="bg-accent-tint/60 border border-accent/20 p-3.5 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-accent shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[22px]">school</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-accent-tint">Student Privilege Concession</span>
            <span className="text-xs text-ink-muted">Unlock extra fare discounts with institutional ID.</span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-surface p-2.5 rounded-xl border border-line/40 flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-[20px] text-brand">verified_user</span>
            <span className="text-[11px] font-semibold text-ink-strong">100% Secure</span>
          </div>
          <div className="bg-surface p-2.5 rounded-xl border border-line/40 flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-[20px] text-accent">price_check</span>
            <span className="text-[11px] font-semibold text-ink-strong">Zero Booking Fee</span>
          </div>
          <div className="bg-surface p-2.5 rounded-xl border border-line/40 flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-[20px] text-success">schedule</span>
            <span className="text-[11px] font-semibold text-ink-strong">Fast Refunds</span>
          </div>
        </div>
      </div>
    </div>
  );
};
