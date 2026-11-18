import { type FC } from 'react';
import { FileText } from 'lucide-react';

export const TermsPage: FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="glass rounded-3xl p-6 sm:p-10 shadow-[0_12px_45px_rgba(11,35,65,0.06)] space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-line/30">
          <div className="w-10 h-10 rounded-2xl bg-accent-tint flex items-center justify-center text-accent">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-ink-strong">Terms of Service</h1>
            <p className="text-xs text-ink-muted">Effective as of 2026 Season</p>
          </div>
        </div>

        <section className="space-y-2 text-xs sm:text-sm text-ink-muted leading-relaxed">
          <h2 className="text-base font-bold text-ink-strong">1. Seat Holds & Lock Expiration</h2>
          <p>
            When initiating a booking, your seat is held atomically via an in-memory lock for exactly 7 minutes. If payment is not completed within this window, the lock expires automatically and the seat is released back to the general pool.
          </p>
        </section>

        <section className="space-y-2 text-xs sm:text-sm text-ink-muted leading-relaxed">
          <h2 className="text-base font-bold text-ink-strong">2. Cancellations & Instant Refunds</h2>
          <p>
            Cancellations made 2 or more hours prior to scheduled departure qualify for a 100% full refund with zero platform deduction fee. Refunds are processed back to the original UPI/card payment method within 15 minutes.
          </p>
        </section>

        <section className="space-y-2 text-xs sm:text-sm text-ink-muted leading-relaxed">
          <h2 className="text-base font-bold text-ink-strong">3. Student Pass Concession Verification</h2>
          <p>
            Travelers utilizing the Bengal Student 40% Concession Pass must carry their valid university/college photo ID card for inspection by the onboard bus conductor.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
