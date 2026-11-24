import { useEffect, useRef, type FC } from 'react';
import { LogOut, X } from 'lucide-react';
import kolkataBannerImg from '../../assets/kolkata-profile-banner.webp';

export interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}

export const SignOutModal: FC<SignOutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const staySignedInBtnRef = useRef<HTMLButtonElement | null>(null);

  // Zero-shift background scroll lock
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  // Focus management: store opener, give initial focus to 'Stay signed in', restore opener focus on close
  useEffect(() => {
    if (isOpen) {
      openerRef.current = document.activeElement as HTMLElement | null;

      // Initial keyboard focus to 'Stay signed in'
      const focusTimer = requestAnimationFrame(() => {
        staySignedInBtnRef.current?.focus();
      });

      return () => {
        cancelAnimationFrame(focusTimer);
        // Return focus to the opener element
        if (openerRef.current && typeof openerRef.current.focus === 'function') {
          openerRef.current.focus();
        }
      };
    }
  }, [isOpen]);

  // Escape key listener to dismiss dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isLoading]);

  // Keyboard focus trap within dialog
  const handleDialogKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab') {
      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [tabindex="0"]'
      );
      if (!focusableElements || focusableElements.length === 0) return;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sign-out-modal-title"
      aria-describedby="sign-out-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onKeyDown={handleDialogKeyDown}
    >
      {/* Dimmed backdrop with ease-out fade animation */}
      <div
        onClick={() => {
          if (!isLoading) onClose();
        }}
        className="fixed inset-0 bg-[#000D21]/60 backdrop-blur-xs transition-opacity duration-200 ease-out animate-in fade-in cursor-pointer"
        aria-hidden="true"
      />

      {/* Modal Dialog Card with max-width 480px, 16px mobile margins, and smooth pop-in animation */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-[480px] bg-white rounded-[28px] sm:rounded-[32px] border border-[#EAE8E4] shadow-[0_25px_60px_-15px_rgba(11,35,65,0.35)] overflow-hidden z-10 transition-all duration-200 ease-out animate-in fade-in zoom-in-95"
      >
        {/* Scenic Header with Kolkata Heritage Artwork (Howrah Bridge, Ganges, Vintage Bus) */}
        <div className="relative h-[170px] sm:h-[185px] w-full bg-[#FCEBD7] overflow-hidden select-none">
          <img
            src={kolkataBannerImg}
            alt="Kolkata heritage illustration with Howrah Bridge and vintage bus"
            className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none"
          />

          {/* Left Brand Identifier: [→ | One Go Bus */}
          <div className="absolute top-6 left-6 sm:top-7 sm:left-7 flex items-center gap-2.5 z-10 pointer-events-none">
            <LogOut className="w-5 h-5 text-[#0B2341] stroke-[2.4]" />
            <span className="w-0.5 h-4.5 bg-[#FC7728] rounded-full opacity-90" aria-hidden="true" />
            <span className="text-[17px] sm:text-lg font-bold text-[#0B2341] tracking-tight">
              One Go Bus
            </span>
          </div>

          {/* Circular Close Button in top right */}
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close dialog"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer border border-slate-100 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#0B2341]/25"
          >
            <X className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.3]" />
          </button>
        </div>

        {/* Card Body & Interactive Controls */}
        <div className="p-6 sm:p-8 pt-5 sm:pt-6">
          {/* Main Title */}
          <h2
            id="sign-out-modal-title"
            className="text-2xl sm:text-[27px] font-extrabold text-[#0B2341] tracking-tight leading-snug"
          >
            Sign out of One Go Bus?
          </h2>

          {/* Subtitle / Descriptive Copy */}
          <p
            id="sign-out-modal-desc"
            className="text-[15px] sm:text-base text-slate-600 mt-2 leading-relaxed"
          >
            You’ll sign out on this device. Your bookings stay saved.
          </p>

          {/* Action Buttons: 2 columns, side-by-side */}
          <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3.5 sm:gap-4">
            {/* Stay signed in button (initial keyboard focus) */}
            <button
              ref={staySignedInBtnRef}
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full h-13 sm:h-14 px-4 rounded-2xl bg-white hover:bg-slate-50 active:bg-slate-100 text-[#0B2341] font-bold text-[15px] sm:text-base transition-all border border-slate-300 hover:border-slate-400 shadow-2xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#0B2341]/25 flex items-center justify-center text-center"
            >
              Stay signed in
            </button>

            {/* Sign out button (Primary Deep Navy #0B2341) */}
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full h-13 sm:h-14 px-4 rounded-2xl bg-[#0B2341] hover:bg-[#07172C] active:scale-[0.99] text-white font-bold text-[15px] sm:text-base transition-all shadow-md shadow-[#0B2341]/25 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 text-center focus:outline-none focus:ring-2 focus:ring-[#0B2341]/30"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing out...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-5 h-5 stroke-[2.2]" />
                  <span>Sign out</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignOutModal;
