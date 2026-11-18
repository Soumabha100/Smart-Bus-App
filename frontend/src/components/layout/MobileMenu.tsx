import { useEffect, useRef, type FC } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on route change
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape or Outside Click
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Features', to: '/features' },
    { label: 'How it Works', to: '/how-it-works' },
    { label: 'Routes', to: '/routes' },
    { label: 'Ask AI', to: '/ask-ai', isAi: true },
    { label: 'About', to: '/about' },
  ];

  return (
    <div
      id="mobile-navigation"
      ref={menuRef}
      className="md:hidden fixed top-20 inset-x-3 max-w-6xl mx-auto rounded-2xl p-5 glass shadow-2xl z-50 flex flex-col gap-4 animate-in fade-in slide-in-from-top-3 duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-between pb-3 border-b border-line/30">
        <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
          Navigation
        </span>
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-ink-strong hover:bg-surface-2 transition-colors"
          aria-label="Close navigation menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-1.5" aria-label="Mobile links">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) =>
              `min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-colors ${
                isActive
                  ? 'bg-brand text-on-brand shadow-xs font-bold'
                  : link.isAi
                  ? 'text-accent font-bold bg-accent-tint/70 border border-accent/20'
                  : 'text-ink-strong hover:bg-surface-2'
              }`
            }
          >
            <span className="flex items-center gap-2">
              {link.isAi && <Sparkles className="w-4 h-4 text-accent-bright" />}
              {link.label}
            </span>
            {link.isAi && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-tint text-accent">
                AI
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Pinned Auth Actions */}
      <div className="pt-3 border-t border-line/30 grid grid-cols-2 gap-2.5">
        <Link
          to="/login"
          onClick={onClose}
          className="min-h-[44px] flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-brand bg-surface-2 hover:bg-surface-3 transition-colors"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          onClick={onClose}
          className="min-h-[44px] flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-bold bg-brand hover:bg-brand-hover text-on-brand shadow-sm transition-colors"
        >
          Register
        </Link>
      </div>
    </div>
  );
};
