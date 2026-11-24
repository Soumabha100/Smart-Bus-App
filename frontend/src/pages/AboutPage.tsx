import { type FC } from 'react';
import { ShieldCheck, HeartHandshake, Cpu } from 'lucide-react';

export const AboutPage: FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">Our Mission</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-strong mt-1">
          Modernizing Bengal&apos;s Transit
        </h1>
        <p className="text-sm text-ink-muted mt-3 leading-relaxed">
          OneGoBus was founded in Kolkata to give every daily commuter and weekend traveler a guaranteed, stress-free bus travel platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-3xl p-6 sm:p-8 shadow-xs">
          <Cpu className="w-8 h-8 text-accent mb-4" />
          <h2 className="text-lg font-bold text-ink-strong">High Concurrency Tech</h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed">
            Built with Java 25 virtual threads and atomic Redis distributed locks to withstand peak festive rush without lag.
          </p>
        </div>

        <div className="glass rounded-3xl p-6 sm:p-8 shadow-xs">
          <ShieldCheck className="w-8 h-8 text-success mb-4" />
          <h2 className="text-lg font-bold text-ink-strong">Data Privacy &amp; Security</h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed">
            State-of-the-art encryption and strict data minimization. We never sell your personal information or location history.
          </p>
        </div>

        <div className="glass rounded-3xl p-6 sm:p-8 shadow-xs">
          <HeartHandshake className="w-8 h-8 text-brand mb-4" />
          <h2 className="text-lg font-bold text-ink-strong">Community First</h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed">
            Dedicated 40% fare subsidies for Bengal college students, zero booking surcharges, and instant auto-refunds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
