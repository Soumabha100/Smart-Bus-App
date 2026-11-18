import { useState, type FC, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Send } from 'lucide-react';
import { footerConfig, type SocialLink } from './footer.config';

export const Footer: FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  const renderSocialIcon = (platform: SocialLink['platform']) => {
    switch (platform) {
      case 'github':
        return (
          <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24M7.86 18.5V10.13H5.07V18.5h2.79z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-4 h-4 fill-none stroke-currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
        );
      case 'x':
        return (
          <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const { brand, columns, newsletter, bottom } = footerConfig;

  return (
    <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 mb-8 mt-16">
      <div className="glass rounded-3xl p-6 sm:p-10 lg:p-12 shadow-[0_12px_45px_rgba(11,35,65,0.06)] border border-white/80">
        {/* TOP ROW: 5-COLUMN RESPONSIVE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-10 border-b border-line/30">
          {/* COLUMN 1: BRAND & MISSION */}
          <div className="lg:col-span-1 flex flex-col gap-3.5">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 rounded-xl bg-brand text-on-brand flex items-center justify-center shadow-xs">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-white"
                  aria-hidden="true"
                >
                  <path d="M4 17V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v11" />
                  <path d="M4 10h12" />
                  <path d="M16 8l3 2v7h-3" />
                  <circle cx="7" cy="18" r="1.5" />
                  <circle cx="15" cy="18" r="1.5" />
                </svg>
              </div>
              <span className="font-sans text-xl font-extrabold text-ink-strong">
                One<span className="text-accent-bright">Go</span>Bus
              </span>
            </Link>

            <p className="text-xs font-bold text-accent">
              {brand.tagline}
            </p>
            <p className="text-xs text-ink-muted leading-relaxed">
              {brand.description}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              {brand.socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-2 hover:bg-brand hover:text-on-brand text-ink-strong transition-colors duration-200 shadow-2xs"
                >
                  {renderSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* COLUMN 2: PRODUCT */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-strong">
              {columns.product.title}
            </h3>
            <ul className="flex flex-col gap-2 text-xs">
              {columns.product.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink-strong transition-colors"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-accent-tint text-accent">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: COMPANY */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-strong">
              {columns.company.title}
            </h3>
            <ul className="flex flex-col gap-2 text-xs">
              {columns.company.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-ink-muted hover:text-ink-strong transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: SUPPORT */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-strong">
              {columns.support.title}
            </h3>
            <ul className="flex flex-col gap-2 text-xs">
              {columns.support.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-ink-muted hover:text-ink-strong transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 5: CONTACT & OFFICE */}
          <div className="flex flex-col gap-3 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-ink-strong">
              {columns.contact.title}
            </h3>
            <div className="flex flex-col gap-1.5 text-ink-muted">
              <p className="leading-snug">{columns.contact.address}</p>
              <a
                href={`mailto:${columns.contact.email}`}
                className="hover:text-accent font-semibold text-ink-strong transition-colors"
              >
                {columns.contact.email}
              </a>
              <p className="font-semibold text-ink-strong">{columns.contact.phone}</p>
              <p className="text-[11px] text-ink-muted/80 mt-0.5">
                {columns.contact.hours}
              </p>
            </div>
          </div>
        </div>

        {/* MIDDLE ROW: NEWSLETTER INPUT */}
        <div className="py-6 border-b border-line/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h4 className="text-sm font-bold text-ink-strong">
              {newsletter.title}
            </h4>
            <p className="text-xs text-ink-muted mt-0.5">
              {newsletter.description}
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex items-center gap-2">
            <div className="relative w-full sm:w-72">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={newsletter.placeholder}
                required
                className="w-full min-h-[42px] px-3.5 py-2 text-xs rounded-xl bg-surface-2 border border-line/60 text-ink-strong placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <button
              type="submit"
              className="min-h-[42px] px-4 py-2 rounded-xl text-xs font-bold bg-brand hover:bg-brand-hover text-on-brand transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{newsletter.buttonText}</span>
            </button>
          </form>
        </div>

        {isSubscribed && (
          <div className="mt-3 p-3 rounded-xl bg-success-tint border border-success/30 text-success text-xs font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Thank you for subscribing! We&apos;ve added you to our transit dispatch list.</span>
          </div>
        )}

        {/* BOTTOM ROW: COPYRIGHT & LEGAL */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <p>{bottom.copyright}</p>
          <div className="flex items-center gap-4">
            {bottom.links.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="hover:text-ink-strong transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-[11px] font-semibold text-accent">
            {bottom.madeWith}
          </p>
        </div>
      </div>
    </footer>
  );
};
