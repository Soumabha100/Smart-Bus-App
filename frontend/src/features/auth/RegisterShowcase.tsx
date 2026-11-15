import type { FC } from 'react';

export const RegisterShowcase: FC = () => {
  return (
    <div className="flex flex-col justify-between h-full gap-6">
      <div className="space-y-4">
        {/* Verified Badge */}
        <div className="inline-flex items-center gap-2 bg-surface px-3.5 py-1.5 rounded-full border border-line/60 shadow-sm self-start">
          <span className="material-symbols-outlined text-accent text-[18px]">verified</span>
          <span className="text-[11px] font-bold text-ink-strong uppercase tracking-wider">
            Join 1M+ Smart Travelers
          </span>
        </div>

        {/* Headline */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-strong tracking-tight">
            Travel Smart. <br />
            <span className="text-accent">Save Every Trip.</span>
          </h2>
          <p className="text-sm text-ink-muted mt-2 leading-relaxed">
            Daily intercity commutes, weekend college getaways, and interstate routes at transparent tariffs.
          </p>
        </div>

        {/* Scenic Bus Card */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-surface-3 border border-line/40 shadow-sm">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJQq4yk0DzwfSqQO9Ux2BBXdphlfFUWkWfW1osql-us7rdy_VELhmP0LKLJJMOqS3DYM8McLZtmzV_8aSXZ88luewu9cs-NnXaD7z0PO5vOZQKNNpYTmARqVmTAROfl5o2GVUpbKG28IkWF0Tu-o1mzGbtSWQii5_37dnuowi_tUeRBSlUkbr8qaHI_0uENY_fSM0rkeCQkXo8vK8Oskhjpwh1S-syAdfmcuoqH8o"
            alt="One Go Bus modern express bus on highway"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand/85 via-brand/20 to-transparent flex items-end p-4">
            <div className="flex items-center justify-between w-full text-on-brand text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-accent-bright">eco</span>
                <span>Low Carbon Footprint</span>
              </span>
              <span className="bg-surface/20 px-2 py-0.5 rounded-full">4.8 ★ Rated</span>
            </div>
          </div>
        </div>

        {/* Highlight Card */}
        <div className="rounded-2xl bg-accent-tint/60 border border-accent/20 p-3.5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-accent shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[24px]">redeem</span>
          </div>
          <div>
            <div className="text-xs font-bold text-on-accent-tint">₹150 Welcome Credits</div>
            <p className="text-xs text-ink-muted">Unlocked on registration. Valid on your first journey.</p>
          </div>
        </div>
      </div>

      {/* Trust Checkmarks */}
      <div className="space-y-2.5 pt-2">
        {[
          'Live GPS seat selection and boarding pass verification',
          'Free cancellation up to 4 hours before departure',
          'Exclusive student concessions on AC Seater & Sleeper buses',
        ].map((perk) => (
          <div key={perk} className="flex items-center gap-2.5 text-xs text-ink-strong">
            <span className="material-symbols-outlined text-success text-[18px] shrink-0">
              check_circle
            </span>
            <span>{perk}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
