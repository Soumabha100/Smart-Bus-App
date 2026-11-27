const BOOKING_HORIZON_DAYS = 90;

const MONTHS_SHORT: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

/** Returns current calendar YYYY-MM-DD in Asia/Kolkata dynamically on each call. */
export function getTodayKolkataIso(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/** Dynamic default journey date (today in Asia/Kolkata). */
export function getDefaultJourneyDate(): string {
  return getTodayKolkataIso();
}

/** Dynamic inclusive start of booking window (today in Asia/Kolkata). */
export function getBookingWindowStart(): string {
  return getTodayKolkataIso();
}

/** Dynamic inclusive end of booking window (today + 90 days in Asia/Kolkata). */
export function getBookingWindowEnd(): string {
  return addDaysIso(getTodayKolkataIso(), BOOKING_HORIZON_DAYS);
}

/** Validates strict YYYY-MM-DD calendar dates without timezone drift. */
export function isValidIsoDate(value: string | null | undefined): boolean {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const utc = new Date(Date.UTC(y, m - 1, d));
  return (
    utc.getUTCFullYear() === y &&
    utc.getUTCMonth() === m - 1 &&
    utc.getUTCDate() === d
  );
}

/** Parses ISO, DD-MM-YYYY, or legacy display strings like "27 Nov, Fri" into YYYY-MM-DD. */
export function parseJourneyDateInput(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (isValidIsoDate(trimmed)) return trimmed;

  // Support DD-MM-YYYY
  const ddmmyyyy = trimmed.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (ddmmyyyy) {
    const candidate = `${ddmmyyyy[3]}-${ddmmyyyy[2]}-${ddmmyyyy[1]}`;
    return isValidIsoDate(candidate) ? candidate : null;
  }

  // Support legacy display format "27 Nov, Fri" or "1 Dec" dynamically against today
  const shortMatch = trimmed.match(/^(\d{1,2})\s+([A-Za-z]{3})/);
  if (shortMatch) {
    const day = Number(shortMatch[1]);
    const month = MONTHS_SHORT[shortMatch[2].toLowerCase()];
    if (month) {
      const todayIso = getTodayKolkataIso();
      const currentYear = Number(todayIso.slice(0, 4));
      const currentMonth = Number(todayIso.slice(5, 7));
      const year = month < currentMonth ? currentYear + 1 : currentYear;
      const candidate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return isValidIsoDate(candidate) ? candidate : null;
    }
  }

  return null;
}

/** Calendar-safe day arithmetic for YYYY-MM-DD strings. */
export function addDaysIso(isoDate: string, deltaDays: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d + deltaDays));
  const yy = utc.getUTCFullYear();
  const mm = String(utc.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(utc.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

export function compareIsoDates(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function isWithinBookingWindow(isoDate: string): boolean {
  const start = getBookingWindowStart();
  const end = getBookingWindowEnd();
  return isValidIsoDate(isoDate) && isoDate >= start && isoDate <= end;
}

export function clampToBookingWindow(isoDate: string): string {
  const start = getBookingWindowStart();
  const end = getBookingWindowEnd();
  if (!isValidIsoDate(isoDate)) return start;
  if (isoDate < start) return start;
  if (isoDate > end) return end;
  return isoDate;
}

/** Converts YYYY-MM-DD to a UTC-noon Date safe for Asia/Kolkata Intl formatting. */
function isoToKolkataSafeDate(isoDate: string): Date {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 6, 30, 0));
}

/** Formats e.g. "Friday, 27 November 2026" in Asia/Kolkata. */
export function formatDateHeader(isoDate: string): string {
  const safe = isValidIsoDate(isoDate) ? isoDate : getDefaultJourneyDate();
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(isoToKolkataSafeDate(safe));
}

/** Formats e.g. "Fri, 27 Nov, 2026" for compact summaries and modal headers. */
export function formatDateCompact(isoDate: string): string {
  const safe = isValidIsoDate(isoDate) ? isoDate : getDefaultJourneyDate();
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(isoToKolkataSafeDate(safe));
}

/** Formats e.g. "Fri, 27 Nov" for the date strip tiles. */
export function formatDateStripTile(isoDate: string): string {
  const safe = isValidIsoDate(isoDate) ? isoDate : getDefaultJourneyDate();
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(isoToKolkataSafeDate(safe));
}

/** Builds a 6-day window anchored cleanly within the dynamic booking bounds. */
export function getVisibleDateWindow(windowStartIso: string, count = 6): string[] {
  const minStart = getBookingWindowStart();
  const maxEnd = getBookingWindowEnd();
  const maxStart = addDaysIso(maxEnd, -(count - 1));

  let start = clampToBookingWindow(windowStartIso);
  if (start > maxStart) start = maxStart;
  if (start < minStart) start = minStart;

  const dates: string[] = [];
  for (let i = 0; i < count; i++) {
    const candidate = addDaysIso(start, i);
    if (candidate >= minStart && candidate <= maxEnd) {
      dates.push(candidate);
    }
  }
  return dates;
}

/** Returns starting ISO date for the 6-day strip so today starts cleanly and future selections stay centered. */
export function getDefaultWindowStartForDate(selectedDateIso: string): string {
  const todayIso = getBookingWindowStart();
  if (selectedDateIso <= addDaysIso(todayIso, 2)) {
    return todayIso;
  }
  return clampToBookingWindow(addDaysIso(selectedDateIso, -2));
}

/** Returns a calendar month matrix for UI pickers. */
export function getCalendarMonthDays(year: number, monthIndex0: number): (string | null)[] {
  const firstDayWeekday = new Date(Date.UTC(year, monthIndex0, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, monthIndex0 + 1, 0)).getUTCDate();
  const cells: (string | null)[] = Array.from({ length: firstDayWeekday }, () => null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(
      `${year}-${String(monthIndex0 + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    );
  }
  return cells;
}

export function getMonthLabel(year: number, monthIndex0: number): string {
  return new Intl.DateTimeFormat('en-IN', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, monthIndex0, 1)));
}

/** Parses duration strings such as "11h 30m", "9h 45m", "4h" into total minutes. */
export function parseDurationMinutes(duration: string): number {
  const hMatch = duration.match(/(\d+)\s*h/i);
  const mMatch = duration.match(/(\d+)\s*m/i);
  const hours = hMatch ? Number(hMatch[1]) : 0;
  const mins = mMatch ? Number(mMatch[1]) : 0;
  return hours * 60 + mins;
}

/** Parses "HH:mm" into minutes since 00:00. */
export function parseTimeMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
}

/** Calculates day offset (+1 day for overnight services) from schedule times. */
export function computeArrivalDayOffset(departureTime: string, duration: string): number {
  const depMins = parseTimeMinutes(departureTime);
  const durMins = parseDurationMinutes(duration);
  return Math.floor((depMins + durMins) / (24 * 60));
}

/** Maps HH:mm to standard 6-hour departure slots. */
export function deriveDepartureSlot(hhmm: string): 'morning' | 'afternoon' | 'evening' | 'night' {
  const mins = parseTimeMinutes(hhmm);
  if (mins >= 6 * 60 && mins < 12 * 60) return 'morning';
  if (mins >= 12 * 60 && mins < 18 * 60) return 'afternoon';
  if (mins >= 18 * 60 && mins < 24 * 60) return 'evening';
  return 'night';
}

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
