import { lazy, Suspense, useState, useEffect, useRef, type FC } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Menu,
  User,
  LogOut,
  Ticket,
  Settings,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { MobileMenu } from './MobileMenu';
import { preloadKolkataBanner } from '../../utils/preloadKolkataBanner';

const SignOutModal = lazy(() => import('../auth/SignOutModal'));

const preloadSignOutAssets = () => {
  void import('../auth/SignOutModal');
  void preloadKolkataBanner();
};

export const Navbar: FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [hasOpenedSignOutModal, setHasOpenedSignOutModal] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Idle preload SignOutModal chunk and banner image only for signed-in users
  useEffect(() => {
    if (!isAuthenticated) return;
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(preloadSignOutAssets, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(preloadSignOutAssets, 1200);
    return () => window.clearTimeout(timer);
  }, [isAuthenticated]);

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

  // Close profile dropdown on outside click or escape
  useEffect(() => {
    if (!profileDropdownOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProfileDropdownOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileDropdownOpen]);

  const desktopLinks = [
    { label: 'Home', to: '/' },
    { label: 'Features', to: '/features' },
    { label: 'How it Works', to: '/how-it-works' },
    { label: 'Routes', to: '/routes' },
    { label: 'Ask AI', to: '/ask-ai', isAi: true },
    { label: 'About', to: '/about' },
  ];

  const handleOpenSignOutModal = () => {
    preloadSignOutAssets();
    setProfileDropdownOpen(false);
    setHasOpenedSignOutModal(true);
    setIsSignOutModalOpen(true);
  };

  const handleCloseSignOutModal = () => {
    if (!isSigningOut) {
      setIsSignOutModalOpen(false);
    }
  };

  const handleConfirmSignOut = async () => {
    try {
      setIsSigningOut(true);
      await logout();
      navigate('/');
    } catch {
      navigate('/');
    } finally {
      setIsSigningOut(false);
      setIsSignOutModalOpen(false);
    }
  };

  const initials = user?.name
    ? user.name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
    : 'U';

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
                            `px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${isActive
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

                    {/* RIGHT: AUTH CTAs OR LOGGED-IN PROFILE CIRCLE */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {isAuthenticated && user ? (
                        /* Authenticated: Circle Profile Icon with Dropdown */
                        <div className="relative" ref={profileDropdownRef}>
                          <button
                            type="button"
                            onClick={() => {
                              preloadSignOutAssets();
                              setProfileDropdownOpen((prev) => !prev);
                            }}
                            onMouseEnter={preloadSignOutAssets}
                            onFocus={preloadSignOutAssets}
                            aria-expanded={profileDropdownOpen}
                            aria-haspopup="true"
                            aria-label="User profile menu"
                            className="flex items-center gap-1.5 p-1 rounded-full hover:bg-surface-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent group"
                          >
                            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-brand/20 group-hover:border-accent overflow-hidden shadow-xs transition-colors bg-[#0B2341] flex items-center justify-center">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-xs font-bold text-white tracking-wider">
                                  {initials}
                                </span>
                              )}
                              {/* Live Online Pip */}
                              <span
                                className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"
                                title="Active"
                              />
                            </div>
                            <ChevronDown
                              className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 hidden sm:block ${profileDropdownOpen ? 'rotate-180 text-accent' : ''
                                }`}
                            />
                          </button>

                          {/* Profile Glassmorphic Dropdown Pop-up — High-Contrast Opaque Layering */}
                          {profileDropdownOpen && (
                            <div
                              role="menu"
                              className="absolute right-0 top-full mt-3 w-[300px] sm:w-[320px] rounded-[22px] bg-white/98 backdrop-blur-2xl p-3 border border-white/90 shadow-[0_24px_60px_-15px_rgba(11,35,65,0.22),0_4px_20px_rgba(11,35,65,0.08),inset_0_1px_0_rgba(255,255,255,1)] flex flex-col gap-1.5 z-50 text-[#0B2341] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-150 select-none"
                            >
                              {/* Header: Elevated Branded User Preview */}
                              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#FFF8F1] to-[#F5F3EF] border border-[#FC7728]/20 flex items-center gap-3.5 shadow-2xs">
                                <div className="relative w-11 h-11 rounded-full bg-[#0B2341] text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden ring-2 ring-white shadow-xs">
                                  {user.avatar ? (
                                    <img
                                      src={user.avatar}
                                      alt={user.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    initials
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-extrabold text-sm text-[#0B2341] truncate leading-tight">
                                    {user.name}
                                  </div>
                                  <div className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                                    {user.email}
                                  </div>
                                  <div className="mt-1.5 flex items-center gap-1.5">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold shadow-2xs">
                                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                      <span>{user.role || 'Verified Traveler'}</span>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="my-1 border-t border-slate-200/60" />

                              {/* Navigation Items with Dedicated Icon Wells and Chevron Indicators */}
                              <div className="space-y-1">
                                {/* Menu Item: My Profile */}
                                <Link
                                  to="/profile"
                                  role="menuitem"
                                  onClick={() => setProfileDropdownOpen(false)}
                                  className="group flex items-center justify-between p-2 rounded-xl hover:bg-[#F5F3EF] transition-all duration-150 cursor-pointer"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#FFF0E6] flex items-center justify-center text-slate-600 group-hover:text-[#FC7728] transition-colors shadow-2xs">
                                      <User className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                      <div className="text-xs font-bold text-[#0B2341] group-hover:text-[#FC7728] transition-colors">
                                        My Profile
                                      </div>
                                      <div className="text-[10px] text-slate-400 font-medium">
                                        Personal details &amp; identity
                                      </div>
                                    </div>
                                  </div>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#FC7728] group-hover:translate-x-0.5 transition-all" />
                                </Link>

                                {/* Menu Item: My Bookings / Find Buses */}
                                <Link
                                  to="/results"
                                  role="menuitem"
                                  onClick={() => setProfileDropdownOpen(false)}
                                  className="group flex items-center justify-between p-2 rounded-xl hover:bg-[#F5F3EF] transition-all duration-150 cursor-pointer"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#FFF0E6] flex items-center justify-center text-slate-600 group-hover:text-[#FC7728] transition-colors shadow-2xs">
                                      <Ticket className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                      <div className="text-xs font-bold text-[#0B2341] group-hover:text-[#FC7728] transition-colors">
                                        My Bookings / Trips
                                      </div>
                                      <div className="text-[10px] text-slate-400 font-medium">
                                        Active holds &amp; past rides
                                      </div>
                                    </div>
                                  </div>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#FC7728] group-hover:translate-x-0.5 transition-all" />
                                </Link>

                                {/* Menu Item: Preferences & Settings */}
                                <Link
                                  to="/profile#settings"
                                  role="menuitem"
                                  onClick={() => setProfileDropdownOpen(false)}
                                  className="group flex items-center justify-between p-2 rounded-xl hover:bg-[#F5F3EF] transition-all duration-150 cursor-pointer"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#FFF0E6] flex items-center justify-center text-slate-600 group-hover:text-[#FC7728] transition-colors shadow-2xs">
                                      <Settings className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                      <div className="text-xs font-bold text-[#0B2341] group-hover:text-[#FC7728] transition-colors">
                                        Preferences &amp; Settings
                                      </div>
                                      <div className="text-[10px] text-slate-400 font-medium">
                                        Seat choice &amp; notifications
                                      </div>
                                    </div>
                                  </div>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#FC7728] group-hover:translate-x-0.5 transition-all" />
                                </Link>
                              </div>

                              <div className="my-1 border-t border-slate-200/60" />

                              {/* Menu Item: Sign Out */}
                              <button
                                type="button"
                                role="menuitem"
                                onClick={handleOpenSignOutModal}
                                className="group w-full flex items-center justify-between p-2 rounded-xl hover:bg-rose-50 transition-all duration-150 cursor-pointer text-left"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center text-rose-500 group-hover:text-rose-600 transition-colors shadow-2xs">
                                    <LogOut className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-rose-600 group-hover:text-rose-700 transition-colors">
                                      Sign Out
                                    </div>
                                    <div className="text-[10px] text-rose-400 font-medium">
                                      Log out of One Go Bus
                                    </div>
                                  </div>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-rose-300 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Unauthenticated: Desktop Sign In & Register Buttons */
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
                      )}

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
                  onOpenSignOutModal={() => {
                    preloadSignOutAssets();
                    setHasOpenedSignOutModal(true);
                    setIsSignOutModalOpen(true);
                  }}
                />

                {/* Sign Out Confirmation Modal (Lazy-loaded & pre-decoded) */}
                {hasOpenedSignOutModal && (
                  <Suspense fallback={null}>
                    <SignOutModal
                      isOpen={isSignOutModalOpen}
                      onClose={handleCloseSignOutModal}
                      onConfirm={handleConfirmSignOut}
                      isLoading={isSigningOut}
                    />
                  </Suspense>
                )}
              </>
              );
};

              export default Navbar;
