import { type FC } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const AppLayout: FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isAuthPage ? 'bg-transparent' : 'bg-canvas'
      } text-ink antialiased selection:bg-accent-tint selection:text-on-accent-tint`}
    >
      {/* Floating Glassmorphic Top Navbar */}
      <Navbar />

      {/* Main Content Area: pt-20 reserves navbar height to ensure zero cumulative layout shift (CLS) */}
      <main className={`flex-1 w-full ${isAuthPage ? 'pt-16 sm:pt-20' : 'pt-20'}`}>
        <Outlet />
      </main>

      {/* Marketing 5-Column Footer: Displayed on marketing & discovery pages.
          Auth pages (/login, /register) use the focused micro-footer in AuthLayout to preserve the backdrop artwork */}
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default AppLayout;
