import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Sparkles, Clock } from 'lucide-react';

export const FeaturesPage: FC = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-accent" />,
      title: '7-Minute Atomic Seat Holds',
      description: 'Distributed Redis locks reserve your seat while you pay — zero double-booking ever.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-accent" />,
      title: 'AI Smart Recommendations',
      description: 'Spring AI finds the fastest, most economical routes tailored to your schedule and mood.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-success" />,
      title: 'DPDP 2025 Certified',
      description: 'Passenger privacy by design. Strict zero-PII transmission to external AI models.',
    },
    {
      icon: <Clock className="w-6 h-6 text-brand" />,
      title: 'Real-Time Schedule Sync',
      description: 'Live updates from SBSTC, NBSTC, and verified private luxury express lines.',
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">Capabilities</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-strong mt-1">
          Engineered for Smarter Transit
        </h1>
        <p className="text-sm text-ink-muted mt-3 leading-relaxed">
          OneGoBus combines virtual thread concurrency with intelligent transit models to deliver West Bengal’s fastest booking experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feat) => (
          <div key={feat.title} className="glass rounded-3xl p-6 sm:p-8 flex gap-4 items-start shadow-xs">
            <div className="p-3 rounded-2xl bg-surface-2 shrink-0 shadow-2xs">
              {feat.icon}
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink-strong">{feat.title}</h2>
              <p className="text-xs sm:text-sm text-ink-muted mt-1.5 leading-relaxed">
                {feat.description}
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
          Book Your First Journey
        </Link>
      </div>
    </div>
  );
};

export default FeaturesPage;
