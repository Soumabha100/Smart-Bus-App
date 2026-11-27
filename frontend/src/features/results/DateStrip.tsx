import { useEffect, useRef, useState, type FC } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { DateFareSummary } from './types';
import {
  addDaysIso,
  formatInr,
  getBookingWindowEnd,
  getBookingWindowStart,
  getCalendarMonthDays,
  getMonthLabel,
  isWithinBookingWindow,
} from './journeyDate';

interface DateStripProps {
  selectedDateIso: string;
  dateSummaries: DateFareSummary[];
  windowStartIso: string;
  onShiftWindow: (deltaDays: number) => void;
  onSelectDate: (dateIso: string) => void;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const DateStrip: FC<DateStripProps> = ({
  selectedDateIso,
  dateSummaries,
  windowStartIso,
  onShiftWindow,
  onSelectDate,
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => Number(selectedDateIso.slice(0, 4)));
  const [viewMonth0, setViewMonth0] = useState(() => Number(selectedDateIso.slice(5, 7)) - 1);

  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const calendarBtnRef = useRef<HTMLButtonElement>(null);
  const selectedChipRef = useRef<HTMLButtonElement>(null);
  const openerWasCalendarRef = useRef(false);

  // Keep selected date tile horizontally scrolled into view on mobile
  useEffect(() => {
    selectedChipRef.current?.scrollIntoView({
      block: 'nearest',
      inline: 'center',
      behavior: 'smooth',
    });
  }, [selectedDateIso]);

  // Escape & outside-click dismissal with focus restoration
  useEffect(() => {
    if (!calendarOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setCalendarOpen(false);
        if (openerWasCalendarRef.current) {
          calendarBtnRef.current?.focus();
          openerWasCalendarRef.current = false;
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (
        calendarContainerRef.current &&
        !calendarContainerRef.current.contains(e.target as Node)
      ) {
        setCalendarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [calendarOpen]);

  const bookingStartIso = getBookingWindowStart();
  const bookingEndIso = getBookingWindowEnd();
  const canShiftPrev = windowStartIso > bookingStartIso;
  const lastVisibleIso = dateSummaries[dateSummaries.length - 1]?.dateIso ?? windowStartIso;
  const canShiftNext = lastVisibleIso < bookingEndIso;

  const minYear = Number(bookingStartIso.slice(0, 4));
  const minMonth0 = Number(bookingStartIso.slice(5, 7)) - 1;
  const maxYear = Number(bookingEndIso.slice(0, 4));
  const maxMonth0 = Number(bookingEndIso.slice(5, 7)) - 1;

  const canPrevMonth = viewYear > minYear || (viewYear === minYear && viewMonth0 > minMonth0);
  const canNextMonth = viewYear < maxYear || (viewYear === maxYear && viewMonth0 < maxMonth0);

  const handlePrevMonth = () => {
    if (!canPrevMonth) return;
    if (viewMonth0 === 0) {
      setViewYear((y) => y - 1);
      setViewMonth0(11);
    } else {
      setViewMonth0((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (!canNextMonth) return;
    if (viewMonth0 === 11) {
      setViewYear((y) => y + 1);
      setViewMonth0(0);
    } else {
      setViewMonth0((m) => m + 1);
    }
  };

  const monthCells = getCalendarMonthDays(viewYear, viewMonth0);

  return (
    <div
      ref={calendarContainerRef}
      className="relative bg-surface rounded-2xl border border-[#EAE8E4] shadow-xs px-2 sm:px-3 py-2 flex items-center gap-1.5 sm:gap-2 min-h-[70px] sm:h-[76px]"
    >
      {/* Previous Window Arrow */}
      <button
        type="button"
        onClick={() => onShiftWindow(-3)}
        disabled={!canShiftPrev}
        aria-label="Previous dates"
        className="w-11 h-11 rounded-full border border-[#EAE8E4] bg-surface hover:bg-surface-2 flex items-center justify-center text-brand shrink-0 transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Scrollable Date & Fare Row */}
      <div
        role="group"
        aria-label="Nearby departure dates and starting fares"
        className="flex-1 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5"
      >
        {dateSummaries.map((item) => {
          const isSelected = item.dateIso === selectedDateIso;
          return (
            <button
              key={item.dateIso}
              ref={isSelected ? selectedChipRef : undefined}
              type="button"
              onClick={() => onSelectDate(item.dateIso)}
              aria-pressed={isSelected}
              aria-label={item.ariaLabel}
              className={`min-w-[104px] sm:min-w-[116px] flex-1 h-[54px] px-2.5 rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isSelected
                  ? 'bg-brand text-on-brand shadow-xs'
                  : 'bg-transparent hover:bg-surface-2 text-brand'
              }`}
            >
              <span
                className={`text-[11px] sm:text-xs leading-tight whitespace-nowrap ${
                  isSelected ? 'text-white/85 font-medium' : 'text-ink-muted font-medium'
                }`}
              >
                {item.topLabel}
              </span>
              {item.status === 'available' && item.lowestFare !== null ? (
                <span
                  className={`text-sm sm:text-[15px] font-extrabold tabular-nums leading-tight mt-0.5 ${
                    isSelected ? 'text-white' : 'text-brand'
                  }`}
                >
                  {formatInr(item.lowestFare)}
                </span>
              ) : item.status === 'empty' ? (
                <span
                  className={`text-[11px] font-semibold leading-tight mt-1 ${
                    isSelected ? 'text-white/80' : 'text-ink-muted'
                  }`}
                >
                  No buses
                </span>
              ) : (
                <span
                  aria-label="Fare unavailable"
                  className={`text-sm font-bold leading-tight mt-0.5 ${
                    isSelected ? 'text-white/80' : 'text-ink-muted'
                  }`}
                >
                  —
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Calendar Picker Trigger */}
      <button
        ref={calendarBtnRef}
        type="button"
        onClick={() => {
          openerWasCalendarRef.current = true;
          if (!calendarOpen) {
            setViewYear(Number(selectedDateIso.slice(0, 4)));
            setViewMonth0(Number(selectedDateIso.slice(5, 7)) - 1);
          }
          setCalendarOpen((prev) => !prev);
        }}
        aria-label="Open calendar date picker"
        aria-expanded={calendarOpen}
        aria-haspopup="dialog"
        className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          calendarOpen
            ? 'bg-brand text-on-brand border-brand'
            : 'bg-surface border-[#EAE8E4] text-brand hover:bg-surface-2'
        }`}
      >
        <CalendarDays className="w-4.5 h-4.5" />
      </button>

      {/* Next Window Arrow */}
      <button
        type="button"
        onClick={() => onShiftWindow(3)}
        disabled={!canShiftNext}
        aria-label="Next dates"
        className="w-11 h-11 rounded-full border border-[#EAE8E4] bg-surface hover:bg-surface-2 flex items-center justify-center text-brand shrink-0 transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Accessible Calendar Picker Popover */}
      {calendarOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Choose journey date"
          className="absolute right-0 top-[calc(100%+8px)] z-40 w-[310px] sm:w-[332px] max-w-[calc(100vw-2rem)] bg-surface rounded-2xl border border-[#EAE8E4] shadow-xl p-4 animate-modal-scale-in"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={!canPrevMonth}
                aria-label="Previous month"
                className="w-9 h-9 rounded-lg hover:bg-surface-2 flex items-center justify-center text-brand disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-brand px-1.5">
                {getMonthLabel(viewYear, viewMonth0)}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                disabled={!canNextMonth}
                aria-label="Next month"
                className="w-9 h-9 rounded-lg hover:bg-surface-2 flex items-center justify-center text-brand disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setCalendarOpen(false);
                calendarBtnRef.current?.focus();
              }}
              aria-label="Close calendar"
              className="w-8 h-8 rounded-lg hover:bg-surface-2 flex items-center justify-center text-ink-muted hover:text-brand cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 mb-1.5 text-center">
            {WEEKDAYS.map((wd) => (
              <span key={wd} className="text-[11px] font-bold text-ink-muted py-1">
                {wd}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {monthCells.map((cellIso, idx) => {
              if (!cellIso) {
                return <div key={`blank-${idx}`} className="h-9" />;
              }
              const inWindow = isWithinBookingWindow(cellIso);
              const isSelected = cellIso === selectedDateIso;
              const dayNum = Number(cellIso.slice(8, 10));
              const isNextDay = cellIso === addDaysIso(selectedDateIso, 1);

              return (
                <button
                  key={cellIso}
                  type="button"
                  disabled={!inWindow}
                  onClick={() => {
                    onSelectDate(cellIso);
                    setCalendarOpen(false);
                    calendarBtnRef.current?.focus();
                  }}
                  aria-pressed={isSelected}
                  aria-label={cellIso}
                  className={`h-9 rounded-lg text-xs font-bold tabular-nums transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isSelected
                      ? 'bg-brand text-on-brand shadow-xs'
                      : isNextDay
                      ? 'bg-accent-tint/50 text-accent hover:bg-accent-tint'
                      : 'text-brand hover:bg-surface-2'
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
