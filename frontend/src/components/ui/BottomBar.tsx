import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface BottomBarProps {
  onGo?: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({ onGo }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGo = () => {
    if (onGo) {
      onGo();
    } else {
      navigate('/results');
    }
  };

  const isHome = location.pathname === '/home';

  return (
    // Strictly hidden on tablet & desktop (md:hidden), active only on mobile viewports (<768px)
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-4 inset-x-0 max-w-md mx-auto px-4 z-40 pointer-events-none"
    >
      <div className="h-16 rounded-full bg-[#19202E]/95 backdrop-blur-2xl border border-white/15 px-6 flex items-center justify-between shadow-[0_12px_32px_rgba(0,0,0,0.6)] pointer-events-auto">
        <button
          type="button"
          onClick={() => navigate('/home')}
          className={`flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${
            isHome ? 'text-[#2DD4BF]' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">explore</span>
          <span>Explore</span>
        </button>

        {/* Center Floating 'Go' Button */}
        <button
          type="button"
          onClick={handleGo}
          aria-label="Find Buses"
          className="w-14 h-14 -mt-6 rounded-full bg-gradient-to-tr from-[#FF7A59] to-[#FFB4A2] text-white flex items-center justify-center font-sora font-bold text-base shadow-[0_6px_20px_rgba(255,122,89,0.5)] hover:scale-105 active:scale-95 transition-transform"
        >
          Go
        </button>

        <button
          type="button"
          onClick={() => navigate('/results')}
          className="flex flex-col items-center gap-0.5 text-xs font-medium text-gray-400 hover:text-gray-200 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">bookmark</span>
          <span>Saved</span>
        </button>
      </div>
    </nav>
  );
};
