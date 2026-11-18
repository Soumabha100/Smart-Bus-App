import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { Search, Lock, QrCode } from 'lucide-react';

export const HowItWorksPage: FC = () => {
  const steps = [
    {
      step: '01',
      icon: <Search className="w-6 h-6 text-accent" />,
      title: 'Find Your Route & Schedule',
      desc: 'Pick your origin and destination across 450+ routes in Kolkata and regional Bengal.',
    },
    {
      step: '02',
      icon: <Lock className="w-6 h-6 text-accent" />,
      title: 'Hold Your Seat with Zero Fee',
      desc: 'Lock your preferred seat for 7 minutes atomically without upfront payment pressure.',
    },
    {
      step: '03',
      icon: <QrCode className="w-6 h-6 text-success" />,
      title: 'Board Seamlessly with QR Pass',
      desc: 'Confirm your booking via UPI or card and flash your digital board pass to the conductor.',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">Simple & Safe</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-strong mt-1">
          How OneGoBus Works
        </h1>
        <p className="text-sm text-ink-muted mt-3 leading-relaxed">
          From search to boarding in three seamless steps. Guaranteed seats with zero confusion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s) => (
          <div key={s.step} className="glass rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-surface-2 shadow-2xs">
                  {s.icon}
                </div>
                <span className="text-3xl font-black text-ink-muted/30 font-sans">
                  {s.step}
                </span>
              </div>
              <h2 className="text-lg font-bold text-ink-strong">{s.title}</h2>
              <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand hover:bg-brand-hover text-on-brand font-bold text-sm transition-colors shadow-xs"
        >
          Start Exploring Routes
        </Link>
      </div>
    </div>
  );
};

export default HowItWorksPage;
