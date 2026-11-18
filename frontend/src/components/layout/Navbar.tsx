import { useState, useEffect, useRef, type FC } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Sparkles, Menu } from 'lucide-react';
import { MobileMenu } from './MobileMenu';

export const Navbar: FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Guarantee strict light mode and clear any stale dark preferences
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('onego_theme');
  }, []);

  // Passive scroll listener: toggles data-scrolled without React re-renders
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        headerRef.current.dataset.scrolled = window.scrollY > 8 ? 'true' : 'false';
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const desktopLinks = [
    { label: 'Home', to: '/' },
    { label: 'Features', to: '/features' },
    { label: 'How it Works', to: '/how-it-works' },
    { label: 'Routes', to: '/routes' },
    { label: 'Ask AI', to: '/ask-ai', isAi: true },
    { label: 'About', to: '/about' },
  ];

  return (
    <>
      <header
        ref={headerRef}
        data-scrolled="false"
        className="fixed top-3 inset-x-0 mx-auto w-[calc(100%-1.5rem)] max-w-6xl rounded-2xl z-50 glass transition-all duration-200"
      >
        <nav
          aria-label="Primary"
          className="h-14 sm:h-16 px-3.5 sm:px-5 flex items-center justify-between gap-3"
        >
          {/* LEFT: BRAND LOGO */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl p-1"
          >
            {/* Numeral 1 + Speed Bus Hybrid Icon */}
            <div className="w-9 h-9 rounded-xl bg-brand text-on-brand flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 shrink-0">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-white"
                aria-hidden="true"
              >
                {/* Stylized '1' stem + bus body */}
                <path d="M4 17V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v11" />
                <path d="M4 10h12" />
                <path d="M16 8l3 2v7h-3" />
                <circle cx="7" cy="18" r="1.5" />
                <circle cx="15" cy="18" r="1.5" />
              </svg>
            </div>
            <span className="font-sans text-lg sm:text-xl font-extrabold tracking-tight text-ink-strong">
              One<span className="text-accent-bright">Go</span>Bus
            </span>
          </Link>

          {/* CENTRE: DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center gap-1">
            {desktopLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isActive
                      ? 'bg-brand text-on-brand shadow-xs font-bold'
                      : link.isAi
                      ? 'text-accent font-bold bg-accent-tint/70 hover:bg-accent-tint border border-accent/25'
                      : 'text-ink-strong/85 hover:text-ink-strong hover:bg-surface-2'
                  }`
                }
              >
                {link.isAi && <Sparkles className="w-3.5 h-3.5 text-accent-bright" />}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>

          {/* RIGHT: AUTH CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Desktop Auth Links */}
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-brand hover:bg-surface-2 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs sm:text-sm font-bold bg-brand hover:bg-brand-hover text-on-brand rounded-xl shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Register
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label="Open navigation menu"
              className="md:hidden w-11 h-11 rounded-xl flex items-center justify-center text-ink-strong hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Menu className="w-5 h-5 text-ink-strong" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};
