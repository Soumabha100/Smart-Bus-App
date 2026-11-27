import { useCallback, useEffect, useMemo, useRef, useState, type FC } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Bus,
  CalendarDays,
  Pencil,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { DateStrip } from '../features/results/DateStrip';
import {
  FilterPanelContent,
  FilterSidebar,
} from '../features/results/FilterSidebar';
import { RouteIllustration } from '../features/results/RouteIllustration';
import { SeatHoldModal } from '../features/results/SeatHoldModal';
import {
  SeatSelectionModal,
  type SelectedSeatInfo,
} from '../features/results/SeatSelectionModal';
import { TicketCard } from '../features/results/TicketCard';
import {
  OPERATOR_GROUPS,
  buildDateFareSummaries,
  countActiveFilters,
  fetchDeparturesForSearch,
} from '../features/results/inventory';
import {
  addDaysIso,
  clampToBookingWindow,
  formatDateCompact,
  formatDateHeader,
  formatInr,
  getBookingWindowEnd,
  getBookingWindowStart,
  getDefaultJourneyDate,
  getDefaultWindowStartForDate,
  getTodayKolkataIso,
  getVisibleDateWindow,
  parseDurationMinutes,
  parseJourneyDateInput,
  parseTimeMinutes,
} from '../features/results/journeyDate';
import type {
  BusTicket,
  DepartureSlotId,
  FilterState,
  PriceBounds,
  SortOption,
} from '../features/results/types';

interface SearchLocationState {
  from?: string;
  to?: string;
  date?: string;
  passengers?: number | string;
  coach?: string;
  budget?: number;
  time?: string;
  mood?: string;
}

function mapHomeTimeToSlots(timeStr?: string | null): DepartureSlotId[] {
  if (!timeStr) return [];
  const lower = timeStr.toLowerCase();
  if (lower.includes('morning')) return ['morning'];
  if (lower.includes('afternoon')) return ['afternoon'];
  if (lower.includes('evening')) return ['evening'];
  if (lower.includes('night')) return ['night'];
  return [];
}

function parseOptionalPassengerCount(raw?: string | number | null): number | null {
  if (raw === undefined || raw === null || raw === '') return null;
  const num = Number(raw);
  if (Number.isInteger(num) && num >= 1 && num <= 9) return num;
  return null;
}

export const ResultsPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const locState = (location.state as SearchLocationState | null) || {};

  // Track live Asia/Kolkata date so open tabs roll forward seamlessly at midnight or tab focus
  const [todayKolkataIso, setTodayKolkataIso] = useState<string>(() => getTodayKolkataIso());

  useEffect(() => {
    const syncToday = () => {
      const latest = getTodayKolkataIso();
      setTodayKolkataIso((prev) => (prev === latest ? prev : latest));
    };
    window.addEventListener('focus', syncToday);
    document.addEventListener('visibilitychange', syncToday);
    const intervalId = window.setInterval(syncToday, 60_000);
    return () => {
      window.removeEventListener('focus', syncToday);
      document.removeEventListener('visibilitychange', syncToday);
      window.clearInterval(intervalId);
    };
  }, []);

  // Single authoritative search resolution: URL params > location.state > live today defaults
  const origin = (searchParams.get('from') || locState.from || 'Kolkata').trim();
  const destination = (searchParams.get('to') || locState.to || 'Siliguri').trim();

  const rawDateInput = searchParams.get('date') || locState.date;
  const parsedDateIso = parseJourneyDateInput(rawDateInput);
  const selectedDateIso = parsedDateIso
    ? clampToBookingWindow(parsedDateIso)
    : getDefaultJourneyDate();

  const knownPassengers = parseOptionalPassengerCount(
    searchParams.get('passengers') ?? locState.passengers
  );
  const knownCoachPref = (searchParams.get('coach') || locState.coach || '').trim() || null;

  const submittedBudgetRaw = searchParams.get('maxPrice') ?? locState.budget;
  const submittedBudget =
    submittedBudgetRaw !== null &&
    submittedBudgetRaw !== undefined &&
    !Number.isNaN(Number(submittedBudgetRaw)) &&
    Number(submittedBudgetRaw) > 0
      ? Number(submittedBudgetRaw)
      : null;

  const submittedSlots = mapHomeTimeToSlots(searchParams.get('time') || locState.time);

  // Ensure URL query parameters reflect the active route and validated YYYY-MM-DD day
  useEffect(() => {
    const urlFrom = searchParams.get('from');
    const urlTo = searchParams.get('to');
    const urlDate = searchParams.get('date');

    if (urlFrom !== origin || urlTo !== destination || urlDate !== selectedDateIso) {
      const next = new URLSearchParams(searchParams);
      next.set('from', origin);
      next.set('to', destination);
      next.set('date', selectedDateIso);
      if (knownPassengers !== null) next.set('passengers', String(knownPassengers));
      if (knownCoachPref) next.set('coach', knownCoachPref);
      setSearchParams(next, { replace: true });
    }
  }, [
    origin,
    destination,
    selectedDateIso,
    knownPassengers,
    knownCoachPref,
    searchParams,
    setSearchParams,
  ]);

  // Visible 6-day window anchored cleanly without effect-induced cascading renders
  const [manualWindow, setManualWindow] = useState<{
    startIso: string;
    forSelectedDateIso: string;
  } | null>(null);
  const windowStartIso =
    manualWindow && manualWindow.forSelectedDateIso === selectedDateIso
      ? manualWindow.startIso
      : getDefaultWindowStartForDate(selectedDateIso);

  // Departures fetch state with stale-request protection and zero synchronous effect setState
  const currentQueryKey = `${origin}::${destination}::${selectedDateIso}`;
  const [retryTick, setRetryTick] = useState(0);
  const [searchResultState, setSearchResultState] = useState<{
    queryKey: string;
    retryTick: number;
    departures: BusTicket[];
    error: string | null;
  } | null>(null);
  const latestRequestSeqRef = useRef(0);

  // Booking & modal states (reset on journey change)
  const [selectedBusForModal, setSelectedBusForModal] = useState<BusTicket | null>(null);
  const [editingSeatIds, setEditingSeatIds] = useState<string[]>([]);
  const [bookingConfirmedInfo, setBookingConfirmedInfo] = useState<{
    ticket: BusTicket;
    seats: SelectedSeatInfo[];
    dateIso: string;
  } | null>(null);
  const [activeHoldDemoData, setActiveHoldDemoData] = useState<{
    ticket: BusTicket;
    seatId: string;
  } | null>(null);
  const [activeDemoHoldStatus, setActiveDemoHoldStatus] = useState<{
    operator: string;
    seatId: string;
    dateIso: string;
  } | null>(null);

  // Mobile filters drawer + focus return
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const mobileFilterTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    const requestSeq = ++latestRequestSeqRef.current;

    fetchDeparturesForSearch(
      { origin, destination, dateIso: selectedDateIso },
      controller.signal
    )
      .then((departures) => {
        if (requestSeq !== latestRequestSeqRef.current) return;
        setSearchResultState({
          queryKey: currentQueryKey,
          retryTick,
          departures,
          error: null,
        });
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        if (requestSeq !== latestRequestSeqRef.current) return;
        setSearchResultState({
          queryKey: currentQueryKey,
          retryTick,
          departures: [],
          error: 'Unable to load departures for this date. Please retry.',
        });
      });

    return () => {
      controller.abort();
    };
  }, [origin, destination, selectedDateIso, currentQueryKey, retryTick]);

  const isLoading =
    !searchResultState ||
    searchResultState.queryKey !== currentQueryKey ||
    searchResultState.retryTick !== retryTick;
  const fetchError = !isLoading ? searchResultState.error : null;
  const routeDepartures = useMemo(
    () => (!isLoading && searchResultState ? searchResultState.departures : []),
    [isLoading, searchResultState]
  );

  // Dynamic price bounds from available route departures
  const priceBounds: PriceBounds = useMemo(() => {
    if (routeDepartures.length === 0) {
      return { min: 200, max: 1500 };
    }
    const prices = routeDepartures.map((b) => b.price);
    const min = Math.floor(Math.min(...prices) / 10) * 10;
    const max = Math.ceil(Math.max(...prices) / 10) * 10;
    return { min, max: Math.max(min, max) };
  }, [routeDepartures]);

  const [explicitMaxPrice, setExplicitMaxPrice] = useState<number | null>(submittedBudget);
  const [rawFilters, setRawFilters] = useState<Omit<FilterState, 'maxPrice'>>(() => ({
    mood: 'All',
    departureSlots: submittedSlots,
    coachTypeIds: [],
    boardingPoints: [],
    droppingPoints: [],
    amenities: [],
    operatorIds: [],
    sortBy: 'best',
  }));

  const filters: FilterState = useMemo(
    () => ({
      ...rawFilters,
      maxPrice: explicitMaxPrice !== null ? Math.min(explicitMaxPrice, priceBounds.max) : priceBounds.max,
    }),
    [rawFilters, explicitMaxPrice, priceBounds.max]
  );

  const handleFiltersChange = useCallback(
    (updater: (prev: FilterState) => FilterState) => {
      const next = updater(filters);
      if (next.maxPrice !== filters.maxPrice) {
        setExplicitMaxPrice(next.maxPrice < priceBounds.max ? next.maxPrice : null);
      }
      setRawFilters({
        mood: next.mood,
        departureSlots: next.departureSlots,
        coachTypeIds: next.coachTypeIds,
        boardingPoints: next.boardingPoints,
        droppingPoints: next.droppingPoints,
        amenities: next.amenities,
        operatorIds: next.operatorIds,
        sortBy: next.sortBy,
      });
    },
    [filters, priceBounds.max]
  );

  const handleResetFilters = useCallback(() => {
    setExplicitMaxPrice(null);
    setRawFilters((prev) => ({
      mood: 'All',
      departureSlots: [],
      coachTypeIds: [],
      boardingPoints: [],
      droppingPoints: [],
      amenities: [],
      operatorIds: [],
      sortBy: prev.sortBy,
    }));
  }, []);

  // Clear stale seat selections when route or journey date changes
  const clearStaleSeatState = useCallback(() => {
    setSelectedBusForModal(null);
    setEditingSeatIds([]);
    setBookingConfirmedInfo(null);
    setActiveHoldDemoData(null);
    setActiveDemoHoldStatus(null);
  }, []);

  const handleSelectDate = useCallback(
    (nextDateIso: string) => {
      if (nextDateIso === selectedDateIso) return;
      clearStaleSeatState();
      const endIso = addDaysIso(windowStartIso, 5);
      if (nextDateIso >= windowStartIso && nextDateIso <= endIso) {
        setManualWindow({ startIso: windowStartIso, forSelectedDateIso: nextDateIso });
      } else {
        setManualWindow(null);
      }
      const next = new URLSearchParams(searchParams);
      next.set('from', origin);
      next.set('to', destination);
      next.set('date', nextDateIso);
      setSearchParams(next);
    },
    [
      selectedDateIso,
      clearStaleSeatState,
      windowStartIso,
      searchParams,
      origin,
      destination,
      setSearchParams,
    ]
  );

  const handleShiftWindow = useCallback(
    (deltaDays: number) => {
      const minStart = getBookingWindowStart();
      const maxStart = addDaysIso(getBookingWindowEnd(), -5);
      const candidate = addDaysIso(windowStartIso, deltaDays);
      const clamped =
        candidate < minStart
          ? minStart
          : candidate > maxStart
          ? maxStart
          : candidate;
      setManualWindow({ startIso: clamped, forSelectedDateIso: selectedDateIso });
    },
    [windowStartIso, selectedDateIso]
  );

  const handleEditSearch = () => {
    const params = new URLSearchParams({
      from: origin,
      to: destination,
      date: selectedDateIso,
    });
    navigate(`/?${params.toString()}`, {
      state: {
        from: origin,
        to: destination,
        date: selectedDateIso,
      },
    });
  };

  // Filtered and numerically sorted bus list
  const filteredBuses = useMemo(() => {
    const effectiveMaxPrice = Math.min(filters.maxPrice, priceBounds.max);

    return routeDepartures
      .filter((bus) => {
        if (filters.mood !== 'All' && bus.moodMatch !== filters.mood) {
          return false;
        }
        if (bus.price > effectiveMaxPrice) {
          return false;
        }
        if (
          filters.departureSlots.length > 0 &&
          !filters.departureSlots.includes(bus.departureSlot)
        ) {
          return false;
        }
        if (
          filters.coachTypeIds.length > 0 &&
          !filters.coachTypeIds.includes(bus.coachTypeId)
        ) {
          return false;
        }
        if (
          filters.boardingPoints.length > 0 &&
          !filters.boardingPoints.includes(bus.boardingPoint)
        ) {
          return false;
        }
        if (
          filters.droppingPoints.length > 0 &&
          !filters.droppingPoints.includes(bus.droppingPoint)
        ) {
          return false;
        }
        if (
          filters.amenities.length > 0 &&
          !filters.amenities.every((a) => bus.amenities.includes(a))
        ) {
          return false;
        }
        if (filters.operatorIds.length > 0) {
          const allowedOperatorIds = OPERATOR_GROUPS.filter((g) =>
            filters.operatorIds.includes(g.id)
          ).flatMap((g) => g.matchOperatorIds);
          if (!allowedOperatorIds.includes(bus.operatorId)) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'cheapest') return a.price - b.price;
        if (filters.sortBy === 'earliest') {
          return parseTimeMinutes(a.departureTime) - parseTimeMinutes(b.departureTime);
        }
        if (filters.sortBy === 'fastest') {
          return parseDurationMinutes(a.duration) - parseDurationMinutes(b.duration);
        }
        if (filters.sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
        return a.recommendedRank - b.recommendedRank;
      });
  }, [routeDepartures, filters, priceBounds.max]);

  // Nearby date strip fare summaries (recomputed dynamically whenever todayKolkataIso advances)
  const visibleDates = useMemo(() => {
    void todayKolkataIso;
    return getVisibleDateWindow(windowStartIso, 6);
  }, [windowStartIso, todayKolkataIso]);
  const dateSummaries = useMemo(
    () => buildDateFareSummaries(origin, destination, visibleDates),
    [origin, destination, visibleDates]
  );

  // Mobile sheet Escape key & focus restoration
  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMobileFiltersOpen(false);
        mobileFilterTriggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mobileFiltersOpen]);

  // Seat confirmation dialog Escape key
  useEffect(() => {
    if (!bookingConfirmedInfo) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setBookingConfirmedInfo(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [bookingConfirmedInfo]);

  const activeFilterCount = countActiveFilters(filters, priceBounds.max);

  const handleOpenSeatModal = useCallback((ticket: BusTicket) => {
    setEditingSeatIds([]);
    setSelectedBusForModal(ticket);
  }, []);

  const handleConfirmSeatBooking = useCallback(
    (ticket: BusTicket, selectedSeats: SelectedSeatInfo[]) => {
      setSelectedBusForModal(null);
      setBookingConfirmedInfo({
        ticket,
        seats: selectedSeats,
        dateIso: selectedDateIso,
      });
    },
    [selectedDateIso]
  );

  const handleContinueBooking = useCallback((ticket: BusTicket, seatId: string) => {
    setActiveHoldDemoData({ ticket, seatId });
  }, []);

  const handleConfirmDemoHold = () => {
    if (!activeHoldDemoData) return;
    setActiveDemoHoldStatus({
      operator: activeHoldDemoData.ticket.operator,
      seatId: activeHoldDemoData.seatId,
      dateIso: selectedDateIso,
    });
    setActiveHoldDemoData(null);
  };

  const nextAvailableDateSummary = dateSummaries.find(
    (d) => d.dateIso !== selectedDateIso && d.status === 'available'
  );

  const routeAdvisory = routeDepartures.find((b) => b.advisory)?.advisory;

  return (
    <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-12 space-y-4 sm:space-y-5 selection:bg-accent-tint selection:text-on-accent-tint">
      {/* 1. COMPACT ROUTE HEADER WITH FULL-BLEED RIGHT-ANCHORED BANNER */}
      <header className="relative rounded-2xl overflow-hidden border border-[#EAE8E4] bg-[#FEFDF7] shadow-xs sm:min-h-[120px] lg:min-h-[128px] flex flex-col sm:flex-row sm:items-center justify-between transition-all">
        {/* Desktop Right-Anchored Edge-to-Edge Banner Artwork (Permanent across all routes) */}
        <RouteIllustration variant="desktop" />

        {/* Mobile Top Panoramic Artwork Window with pinned Edit button */}
        <div className="sm:hidden relative">
          <RouteIllustration variant="mobile" />
          <button
            type="button"
            onClick={handleEditSearch}
            className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-xl border border-[#EAE8E4] bg-white/95 backdrop-blur-md hover:bg-surface-2 text-brand text-xs font-bold shadow-xs transition-colors cursor-pointer pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Pencil className="w-3.5 h-3.5 text-[#FC7728]" aria-hidden="true" />
            <span>Edit search</span>
          </button>
        </div>

        {/* Left Route Identity over clean #FEFDF7 cream-white canvas */}
        <div className="relative z-10 px-4 py-3.5 sm:px-6 sm:py-5 flex items-center justify-between gap-4 w-full pointer-events-none">
          <div className="min-w-0 sm:max-w-[44%] lg:max-w-[40%] pointer-events-auto">
            <h1 className="font-sans text-2xl sm:text-[32px] font-extrabold text-brand tracking-tight leading-tight flex items-center gap-2 sm:gap-2.5 flex-wrap">
              <span>{origin}</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#FC7728] shrink-0" aria-hidden="true" />
              <span>{destination}</span>
            </h1>
            <div className="text-[13px] sm:text-sm text-ink-muted font-medium flex items-center gap-2 flex-wrap mt-1">
              <CalendarDays className="w-4 h-4 text-ink-muted shrink-0" aria-hidden="true" />
              <span>{formatDateHeader(selectedDateIso)}</span>
              {knownPassengers !== null && (
                <>
                  <span aria-hidden="true">•</span>
                  <span>
                    {knownPassengers} {knownPassengers === 1 ? 'passenger' : 'passengers'}
                  </span>
                </>
              )}
              {knownCoachPref && (
                <>
                  <span aria-hidden="true">•</span>
                  <span>{knownCoachPref}</span>
                </>
              )}
            </div>
          </div>

          {/* Edit Search Action (Desktop / Tablet, crisp frosted surface over sky) */}
          <button
            type="button"
            onClick={handleEditSearch}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl border border-[#EAE8E4] bg-white/95 backdrop-blur-md hover:bg-surface-2 text-brand text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer shrink-0 pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Pencil className="w-3.5 h-3.5 text-[#FC7728]" aria-hidden="true" />
            <span>Edit search</span>
          </button>
        </div>
      </header>

      {/* 2. DATE AND STARTING FARE STRIP (68-80px desktop) */}
      <DateStrip
        selectedDateIso={selectedDateIso}
        dateSummaries={dateSummaries}
        windowStartIso={windowStartIso}
        onShiftWindow={handleShiftWindow}
        onSelectDate={handleSelectDate}
      />

      {/* Active Demo Hold Status Strip (Only rendered after an explicit demo hold action) */}
      {activeDemoHoldStatus && (
        <div
          role="status"
          className="px-4 py-2.5 rounded-xl bg-success-tint border border-emerald-200 text-success text-xs font-semibold flex items-center justify-between gap-3"
        >
          <span>
            Demo hold preview active for <strong>{activeDemoHoldStatus.seatId}</strong> on{' '}
            <strong>{activeDemoHoldStatus.operator}</strong> ({formatDateCompact(activeDemoHoldStatus.dateIso)}).
          </span>
          <button
            type="button"
            onClick={() => setActiveDemoHoldStatus(null)}
            className="text-xs font-bold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* MOBILE CONTROLS BAR (< lg) */}
      <div className="lg:hidden flex items-center justify-between gap-3">
        <button
          ref={mobileFilterTriggerRef}
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-surface border border-[#EAE8E4] text-brand text-sm font-bold inline-flex items-center gap-2 shadow-2xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#FC7728]" aria-hidden="true" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-brand text-on-brand text-[11px] font-bold tabular-nums">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          <label htmlFor="mobile-sort-select" className="text-xs font-semibold text-ink-muted">
            Sort:
          </label>
          <select
            id="mobile-sort-select"
            value={filters.sortBy}
            onChange={(e) =>
              setRawFilters((prev) => ({ ...prev, sortBy: e.target.value as SortOption }))
            }
            className="min-h-[44px] px-3 py-2 rounded-xl bg-surface border border-[#EAE8E4] text-brand text-xs sm:text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
          >
            <option value="best">Recommended</option>
            <option value="cheapest">Cheapest</option>
            <option value="earliest">Earliest</option>
            <option value="fastest">Fastest</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
      </div>

      {/* 3. FILTERS & RESULTS TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-[264px_minmax(0,1fr)] gap-5 lg:gap-6 items-start">
        {/* Desktop Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          allDepartures={routeDepartures}
          priceBounds={priceBounds}
          onChange={handleFiltersChange}
          onReset={handleResetFilters}
        />

        {/* Flexible Results Column */}
        <section aria-label="Available buses" className="min-w-0 space-y-3.5">
          {/* Compact Results Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-1">
            <h2 className="font-sans text-xl sm:text-2xl font-extrabold text-brand tracking-tight tabular-nums">
              {isLoading
                ? 'Searching buses...'
                : `${filteredBuses.length} ${
                    filteredBuses.length === 1 ? 'bus' : 'buses'
                  } available`}
            </h2>

            <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
              <Link
                to="/ask-ai"
                className="min-h-[38px] px-3 py-1.5 rounded-xl bg-surface border border-[#EAE8E4] hover:bg-accent-tint/40 text-brand text-xs font-bold inline-flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FC7728]" aria-hidden="true" />
                <span>Ask OneGo AI</span>
              </Link>

              <div className="hidden lg:flex items-center gap-2">
                <label
                  htmlFor="desktop-sort-select"
                  className="text-xs font-semibold text-ink-muted whitespace-nowrap"
                >
                  Sort by:
                </label>
                <select
                  id="desktop-sort-select"
                  value={filters.sortBy}
                  onChange={(e) =>
                    setRawFilters((prev) => ({ ...prev, sortBy: e.target.value as SortOption }))
                  }
                  className="min-h-[38px] px-3 py-1.5 rounded-xl bg-surface border border-[#EAE8E4] text-brand text-xs font-bold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <option value="best">Recommended</option>
                  <option value="cheapest">Cheapest</option>
                  <option value="earliest">Earliest</option>
                  <option value="fastest">Fastest</option>
                  <option value="rating">Top rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Genuine Route Advisory (rendered only if supported by departure data) */}
          {routeAdvisory && (
            <div className="px-4 py-2.5 rounded-xl bg-surface-2 border border-[#EAE8E4] text-xs text-ink-muted">
              {routeAdvisory}
            </div>
          )}

          {/* Ticket List / Loading / Error / Empty States */}
          {fetchError ? (
            <div className="bg-surface rounded-2xl border border-[#EAE8E4] p-10 text-center space-y-3">
              <p className="text-sm font-bold text-brand">{fetchError}</p>
              <button
                type="button"
                onClick={() => setRetryTick((t) => t + 1)}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-accent text-on-accent hover:bg-accent-hover text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry search</span>
              </button>
            </div>
          ) : isLoading ? (
            <div className="space-y-3.5" aria-busy="true" aria-label="Loading bus departures">
              {[0, 1].map((idx) => (
                <div
                  key={idx}
                  className="bg-surface rounded-[14px] border border-[#EAE8E4] p-5 h-[178px] animate-pulse"
                />
              ))}
            </div>
          ) : routeDepartures.length === 0 ? (
            <div className="bg-surface rounded-2xl border border-[#EAE8E4] p-10 text-center flex flex-col items-center">
              <Bus className="w-9 h-9 text-ink-muted mb-2.5" aria-hidden="true" />
              <h3 className="font-sans text-lg font-bold text-brand">
                No buses scheduled for {origin} → {destination} on {formatDateCompact(selectedDateIso)}
              </h3>
              <p className="text-xs sm:text-sm text-ink-muted max-w-md mt-1 mb-5">
                {nextAvailableDateSummary
                  ? `No departures are listed for this day. Next available departures start at ${formatInr(
                      nextAvailableDateSummary.lowestFare ?? 0
                    )} on ${nextAvailableDateSummary.topLabel}.`
                  : 'This corridor has no listed departures in the fixture schedule. Edit your search to pick an active Bengal corridor.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {nextAvailableDateSummary ? (
                  <button
                    type="button"
                    onClick={() => handleSelectDate(nextAvailableDateSummary.dateIso)}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-accent text-on-accent hover:bg-accent-hover text-sm font-bold cursor-pointer"
                  >
                    Choose another date ({nextAvailableDateSummary.topLabel})
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleEditSearch}
                    className="min-h-[44px] px-5 py-2.5 rounded-xl bg-accent text-on-accent hover:bg-accent-hover text-sm font-bold cursor-pointer"
                  >
                    Edit search
                  </button>
                )}
              </div>
            </div>
          ) : filteredBuses.length === 0 ? (
            <div className="bg-surface rounded-2xl border border-[#EAE8E4] p-10 text-center flex flex-col items-center">
              <SlidersHorizontal className="w-8 h-8 text-ink-muted mb-2.5" aria-hidden="true" />
              <h3 className="font-sans text-lg font-bold text-brand">
                No buses match your active filters
              </h3>
              <p className="text-xs sm:text-sm text-ink-muted max-w-md mt-1 mb-5">
                {routeDepartures.length} {routeDepartures.length === 1 ? 'bus is' : 'buses are'} available on{' '}
                {formatDateCompact(selectedDateIso)} before filtering. Clear filters to compare all departures.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-accent text-on-accent hover:bg-accent-hover text-sm font-bold cursor-pointer"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredBuses.map((ticket, index) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  variant={index % 2 === 0 ? 'peach' : 'blue'}
                  onViewSeats={handleOpenSeatModal}
                  onContinueBooking={handleContinueBooking}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* MOBILE FILTERS SHEET (< lg) */}
      {mobileFiltersOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter buses"
          className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-[#000D21]/50 backdrop-blur-xs animate-modal-backdrop-in"
        >
          <div
            className="fixed inset-0 -z-10"
            onClick={() => {
              setMobileFiltersOpen(false);
              mobileFilterTriggerRef.current?.focus();
            }}
            aria-hidden="true"
          />
          <div className="w-full max-h-[86vh] bg-surface rounded-t-3xl border-t border-[#EAE8E4] shadow-2xl flex flex-col animate-sheet-up">
            <div className="px-5 py-4 border-b border-[#EAE8E4] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand" aria-hidden="true" />
                <span className="font-sans font-bold text-base text-brand">Filters</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  disabled={activeFilterCount === 0}
                  className="text-xs font-bold text-accent disabled:opacity-40 cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileFiltersOpen(false);
                    mobileFilterTriggerRef.current?.focus();
                  }}
                  aria-label="Close filters"
                  className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center text-brand cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <FilterPanelContent
                filters={filters}
                allDepartures={routeDepartures}
                priceBounds={priceBounds}
                onChange={handleFiltersChange}
                onReset={handleResetFilters}
                hideHeader
              />
            </div>

            <div className="p-4 border-t border-[#EAE8E4] bg-surface">
              <button
                type="button"
                onClick={() => {
                  setMobileFiltersOpen(false);
                  mobileFilterTriggerRef.current?.focus();
                }}
                className="w-full min-h-[46px] rounded-xl bg-accent text-on-accent hover:bg-accent-hover text-sm font-bold cursor-pointer"
              >
                Show {filteredBuses.length} {filteredBuses.length === 1 ? 'bus' : 'buses'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEAT SELECTION MODAL */}
      {selectedBusForModal && (
        <SeatSelectionModal
          isOpen={!!selectedBusForModal}
          ticket={selectedBusForModal}
          origin={origin}
          destination={destination}
          journeyDateDisplay={formatDateCompact(selectedDateIso)}
          initialSelectedSeatIds={editingSeatIds}
          onClose={() => setSelectedBusForModal(null)}
          onConfirmBooking={handleConfirmSeatBooking}
        />
      )}

      {/* DEMO SEAT HOLD PREVIEW MODAL (via onContinueBooking in expanded details) */}
      {activeHoldDemoData && (
        <SeatHoldModal
          ticket={activeHoldDemoData.ticket}
          seatId={activeHoldDemoData.seatId}
          origin={origin}
          destination={destination}
          journeyDateDisplay={formatDateCompact(selectedDateIso)}
          onClose={() => setActiveHoldDemoData(null)}
          onConfirmed={handleConfirmDemoHold}
        />
      )}

      {/* SEATS SELECTED SUMMARY DIALOG */}
      {bookingConfirmedInfo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="seats-selected-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000D21]/55 backdrop-blur-xs animate-modal-backdrop-in"
        >
          <div className="w-full max-w-lg bg-surface rounded-2xl p-6 sm:p-7 border border-[#EAE8E4] shadow-2xl animate-modal-scale-in relative text-brand">
            <button
              type="button"
              onClick={() => setBookingConfirmedInfo(null)}
              aria-label="Close seat selection summary"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-2 hover:bg-surface-3 text-ink-muted hover:text-brand flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-accent bg-accent-tint/60 px-2.5 py-0.5 rounded-full">
              Seats selected
            </span>

            <h3 id="seats-selected-title" className="font-sans text-2xl font-extrabold text-brand mt-2">
              {bookingConfirmedInfo.ticket.operator}
            </h3>
            <p className="text-xs text-ink-muted mt-0.5 mb-5">
              {bookingConfirmedInfo.ticket.coachTypeLabel} • {formatDateCompact(bookingConfirmedInfo.dateIso)}
            </p>

            <div className="p-4 rounded-xl bg-surface-2/70 border border-[#EAE8E4] space-y-2.5 text-xs mb-5">
              <div className="flex justify-between items-center gap-2">
                <span className="text-ink-muted">Route:</span>
                <span className="font-bold text-brand">
                  {origin} → {destination}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-ink-muted">Seats selected:</span>
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {bookingConfirmedInfo.seats.map((s) => (
                    <span
                      key={s.id}
                      className="px-2 py-0.5 rounded-md bg-surface border border-[#EAE8E4] text-brand font-bold text-[11px]"
                    >
                      {s.id} ({s.deck === 'upper' ? 'Upper deck' : 'Lower deck'})
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-ink-muted">Boarding point:</span>
                <span className="font-semibold text-brand">
                  {bookingConfirmedInfo.ticket.originStation} ({bookingConfirmedInfo.ticket.departureTime})
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#EAE8E4]">
                <span className="text-ink-muted font-medium">Total fare:</span>
                <span className="font-sans font-extrabold text-lg text-brand tabular-nums">
                  {formatInr(bookingConfirmedInfo.seats.reduce((sum, s) => sum + s.price, 0))}
                </span>
              </div>
            </div>

            <p className="text-xs text-ink-muted mb-5 leading-relaxed">
              Seat selection is complete for this stage. Passenger details and payment checkout are next-stage prototype workflows not yet wired to a live booking service.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditingSeatIds(bookingConfirmedInfo.seats.map((s) => s.id));
                  setSelectedBusForModal(bookingConfirmedInfo.ticket);
                  setBookingConfirmedInfo(null);
                }}
                className="w-full sm:w-1/2 min-h-[44px] py-2.5 rounded-xl border border-[#EAE8E4] hover:bg-surface-2 text-brand font-bold text-xs transition-colors cursor-pointer"
              >
                Change seats
              </button>
              <button
                type="button"
                onClick={() => setBookingConfirmedInfo(null)}
                className="w-full sm:w-1/2 min-h-[44px] py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-on-accent font-bold text-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
