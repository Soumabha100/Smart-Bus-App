import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage: FC = () => {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-16 text-center">
      <div className="glass rounded-3xl p-8 sm:p-10 shadow-[0_12px_45px_rgba(11,35,65,0.06)] flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-accent-tint flex items-center justify-center text-accent text-2xl font-black">
          <Compass className="w-8 h-8 text-accent animate-spin duration-1000" />
        </div>
        <h1 className="text-3xl font-extrabold text-ink-strong">Route Not Found</h1>
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
          This transit stop does not exist on the OneGoBus network line. Let&apos;s return to the main terminus.
        </p>
        <Link
          to="/"
          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-on-brand font-bold text-xs transition-colors shadow-xs"
        >
          <Home className="w-4 h-4 text-white" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
