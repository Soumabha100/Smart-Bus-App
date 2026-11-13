import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { tokenStorage } from '../../utils/tokenStorage';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = tokenStorage.getUser();
  const isAuthenticated = tokenStorage.isAuthenticated();

  const handleLogout = () => {
    tokenStorage.clear();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Explore Routes', path: '/home' },
    { label: 'Find Buses', path: '/results' },
    { label: 'System Health', path: '/system-status' },
  ];

  return (
    <header className="w-full sticky top-0 z-50 bg-[#0B1220]/85 backdrop-blur-xl border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-8 lg:gap-12">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF7A59] to-[#2DD4BF] p-0.5 shadow-[0_0_16px_rgba(255,122,89,0.35)] group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-[#0B1220] rounded-[14px] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px] text-[#FF7A59]">
                  directions_bus
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-sora text-xl font-bold tracking-tight text-white">
                  Roamly
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
              </div>
              <span className="text-[11px] font-inter text-[#DFC0B8] tracking-wider uppercase font-medium">
                The Journey Line
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-full font-inter text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-white/10 text-[#2DD4BF] border border-[#2DD4BF]/30 shadow-[0_0_12px_rgba(45,212,191,0.2)]'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions & User Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="font-sora text-xs font-semibold text-white">
                  {user?.name || 'Traveler'}
                </span>
                <span className="text-[10px] text-gray-400 truncate max-w-[150px]">
                  {user?.email || 'wanderer@roamly.journal'}
                </span>
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-[#19202E] border border-white/15 flex items-center justify-center font-sora font-bold text-sm text-[#FF7A59] shadow-md ring-2 ring-[#2DD4BF]/20">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'R'}
              </div>

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={handleLogout}
                title="Sign Out"
                className="h-10 px-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 text-gray-300 font-inter text-xs font-medium transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="h-10 px-4 sm:px-5 rounded-full bg-transparent hover:bg-white/5 text-gray-200 hover:text-white font-inter text-xs font-semibold transition-all flex items-center"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="h-10 px-5 rounded-full bg-[#FF7A59] hover:bg-[#E06547] text-white font-sora text-xs font-semibold transition-all shadow-[0_4px_16px_rgba(255,122,89,0.35)] flex items-center gap-1.5"
              >
                <span>Start Journey</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

