import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import type { ToastItem, ToastType } from '../../context/ToastContext';

interface ToastContainerProps {
  toasts: ToastItem[];
  onClose: (id: string) => void;
}

interface ToastStyleConfig {
  cardGradient: string;
  borderColor: string;
  glowShadow: string;
  iconContainerBg: string;
  iconColor: string;
  titleColor: string;
  progressBarGradient: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultTitle: string;
}

const toastTypeConfigs: Record<ToastType, ToastStyleConfig> = {
  success: {
    // Green with subtle teal highlights
    cardGradient: 'bg-gradient-to-r from-[#0B1020]/96 via-[#0B1A1E]/96 to-[#0B1020]/96',
    borderColor: 'border-[#059669]/40 hover:border-[#19C6B5]/60',
    glowShadow: 'shadow-[0_12px_36px_-6px_rgba(5,150,105,0.22),0_4px_18px_rgba(11,16,32,0.7)]',
    iconContainerBg: 'bg-[#059669]/15 border border-[#19C6B5]/35 shadow-[0_0_14px_rgba(25,198,181,0.28)]',
    iconColor: 'text-[#19C6B5]',
    titleColor: 'text-[#19C6B5]',
    progressBarGradient: 'bg-gradient-to-r from-[#059669] via-[#10B981] to-[#19C6B5]',
    icon: CheckCircle2,
    defaultTitle: 'Success',
  },
  warning: {
    // Orange with soft amber glow
    cardGradient: 'bg-gradient-to-r from-[#0B1020]/96 via-[#1C150F]/96 to-[#0B1020]/96',
    borderColor: 'border-[#EA580C]/40 hover:border-[#F59E0B]/60',
    glowShadow: 'shadow-[0_12px_36px_-6px_rgba(234,88,12,0.22),0_4px_18px_rgba(11,16,32,0.7)]',
    iconContainerBg: 'bg-[#EA580C]/15 border border-[#F59E0B]/35 shadow-[0_0_14px_rgba(234,88,12,0.28)]',
    iconColor: 'text-[#F59E0B]',
    titleColor: 'text-[#F59E0B]',
    progressBarGradient: 'bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#F59E0B]',
    icon: AlertTriangle,
    defaultTitle: 'Attention',
  },
  error: {
    // Red with subtle coral-red glow
    cardGradient: 'bg-gradient-to-r from-[#0B1020]/96 via-[#221016]/96 to-[#0B1020]/96',
    borderColor: 'border-[#DC2626]/40 hover:border-[#FF8066]/60',
    glowShadow: 'shadow-[0_12px_36px_-6px_rgba(220,38,38,0.22),0_4px_18px_rgba(11,16,32,0.7)]',
    iconContainerBg: 'bg-[#DC2626]/15 border border-[#FF8066]/35 shadow-[0_0_14px_rgba(220,38,38,0.28)]',
    iconColor: 'text-[#FF8066]',
    titleColor: 'text-[#FF8066]',
    progressBarGradient: 'bg-gradient-to-r from-[#DC2626] via-[#F43F5E] to-[#FF8066]',
    icon: AlertCircle,
    defaultTitle: 'Error',
  },
  info: {
    // Roamly Teal accent
    cardGradient: 'bg-gradient-to-r from-[#0B1020]/96 via-[#0C1A24]/96 to-[#0B1020]/96',
    borderColor: 'border-[#19C6B5]/40 hover:border-[#19C6B5]/70',
    glowShadow: 'shadow-[0_12px_36px_-6px_rgba(25,198,181,0.22),0_4px_18px_rgba(11,16,32,0.7)]',
    iconContainerBg: 'bg-[#19C6B5]/15 border border-[#19C6B5]/35 shadow-[0_0_14px_rgba(25,198,181,0.28)]',
    iconColor: 'text-[#19C6B5]',
    titleColor: 'text-[#19C6B5]',
    progressBarGradient: 'bg-gradient-to-r from-[#0D9488] via-[#14B8A6] to-[#19C6B5]',
    icon: Info,
    defaultTitle: 'Notice',
  },
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <aside
      className="fixed top-5 sm:top-6 inset-x-0 mx-auto z-[9999] pointer-events-none flex flex-col items-center gap-2.5 px-4 w-full max-w-[420px]"
      role="region"
      aria-label="Notification alerts"
    >
      {toasts.map((item) => {
        const config = toastTypeConfigs[item.type] || toastTypeConfigs.info;
        const Icon = config.icon;

        return (
          <div
            key={item.id}
            role="alert"
            className={`pointer-events-auto w-full relative overflow-hidden rounded-2xl p-3.5 sm:px-4 sm:py-3.5 backdrop-blur-xl border flex items-center justify-between gap-3 select-none transition-all duration-200 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[0.06] before:to-transparent before:pointer-events-none ${
              config.cardGradient
            } ${config.borderColor} ${config.glowShadow} ${
              item.isExiting ? 'animate-toast-out' : 'animate-toast-in'
            }`}
          >
            {/* LEFT: Circular icon with tinted background and soft ambient glow */}
            <div className="shrink-0">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center animate-toast-icon ${config.iconContainerBg}`}
              >
                <Icon className={`w-5 h-5 ${config.iconColor}`} />
              </div>
            </div>

            {/* CENTER: Clear title and description hierarchy with modern typography */}
            <div className="min-w-0 flex-1 flex flex-col gap-0.5">
              <span
                className={`text-[10px] sm:text-[11px] font-bold tracking-wider uppercase font-sora ${config.titleColor}`}
              >
                {config.defaultTitle}
              </span>
              <p className="text-xs sm:text-[13px] font-medium text-slate-100 leading-snug break-words font-inter">
                {item.message}
              </p>
            </div>

            {/* RIGHT: Minimal subtle close button */}
            <div className="shrink-0 self-start sm:self-center -mr-1">
              <button
                type="button"
                onClick={() => onClose(item.id)}
                className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/20"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* BOTTOM: Thin animated progress bar matching the notification's accent color */}
            <div
              className={`absolute bottom-0 left-0 h-[2.5px] rounded-full ${config.progressBarGradient}`}
              style={{
                animation: `toastProgress ${item.duration}ms linear forwards`,
              }}
            />
          </div>
        );
      })}
    </aside>
  );
};
