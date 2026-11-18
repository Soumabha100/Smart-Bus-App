import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { Bus, MapPin, ArrowRight } from 'lucide-react';

export const RoutesPage: FC = () => {
  const popularRoutes = [
    { from: 'Kolkata (Esplanade)', to: 'Siliguri (Tenzing Norgay)', time: '11h 30m', fare: '₹650', type: 'AC Volvo Multi-Axle' },
    { from: 'Howrah Station', to: 'Digha Old Bus Stand', time: '4h 15m', fare: '₹220', type: 'SBSTC Express' },
    { from: 'Kolkata (Karunamoyee)', to: 'Bolpur (Santiniketan)', time: '3h 45m', fare: '₹190', type: 'Deluxe AC' },
    { from: 'Durgapur (City Centre)', to: 'Kolkata (Babughat)', time: '3h 30m', fare: '₹180', type: 'Super Fast Non-AC' },
    { from: 'Malda (Rathbari)', to: 'Siliguri Junction', time: '5h 10m', fare: '₹290', type: 'NBSTC Express' },
    { from: 'Kolkata (Esplanade)', to: 'Haldia City Centre', time: '2h 50m', fare: '₹140', type: 'Express Line' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">Network</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink-strong mt-1">
          State-Wide Express Routes
        </h1>
        <p className="text-sm text-ink-muted mt-3 leading-relaxed">
          Daily departures connecting major metropolitan hubs, coastal corridors, and North Bengal hills.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {popularRoutes.map((r) => (
          <div key={`${r.from}-${r.to}`} className="glass rounded-2xl p-5 flex flex-col justify-between gap-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-accent-tint text-accent border border-accent/20">
                {r.type}
              </span>
              <span className="text-base font-extrabold text-brand">
                {r.fare}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-ink-strong">
                  <MapPin className="w-3.5 h-3.5 text-accent" />
                  <span>{r.from}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-ink-strong mt-1">
                  <MapPin className="w-3.5 h-3.5 text-success" />
                  <span>{r.to}</span>
                </div>
              </div>
              <div className="text-right text-[11px] text-ink-muted">
                <span>{r.time}</span>
              </div>
            </div>

            <Link
              to="/"
              className="mt-1 pt-2 border-t border-line/30 flex items-center justify-between text-xs font-semibold text-brand hover:text-accent transition-colors"
            >
              <span className="flex items-center gap-1">
                <Bus className="w-3.5 h-3.5" /> Book this route
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutesPage;
