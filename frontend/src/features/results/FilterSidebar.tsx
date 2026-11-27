import { useState, type FC } from 'react';
import { ChevronDown, ChevronUp, RotateCcw, SlidersHorizontal } from 'lucide-react';
import type { BusTicket, CoachTypeId, DepartureSlotId, FilterState, PriceBounds } from './types';
import { COACH_FILTER_OPTIONS, OPERATOR_GROUPS, countActiveFilters } from './inventory';
import { formatInr } from './journeyDate';

interface FilterPanelProps {
  filters: FilterState;
  allDepartures: BusTicket[];
  priceBounds: PriceBounds;
  onChange: (updater: (prev: FilterState) => FilterState) => void;
  onReset: () => void;
  hideHeader?: boolean;
}

const DEPARTURE_SLOTS: { id: DepartureSlotId; label: string }[] = [
  { id: 'morning', label: 'Morning (06:00 – 12:00)' },
  { id: 'afternoon', label: 'Afternoon (12:00 – 18:00)' },
  { id: 'evening', label: 'Evening (18:00 – 24:00)' },
  { id: 'night', label: 'Night (00:00 – 06:00)' },
];

const MOOD_OPTIONS = ['All', 'Sleep well', 'Fastest', 'Budget friendly', 'Scenic route'];

export const FilterPanelContent: FC<FilterPanelProps> = ({
  filters,
  allDepartures,
  priceBounds,
  onChange,
  onReset,
  hideHeader = false,
}) => {
  const [openSections, setOpenSections] = useState({
    boarding: false,
    dropping: false,
    amenities: false,
    operators: false,
    mood: false,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleArrayValue = <K extends 'coachTypeIds' | 'departureSlots' | 'boardingPoints' | 'droppingPoints' | 'amenities' | 'operatorIds'>(
    key: K,
    value: FilterState[K][number]
  ) => {
    onChange((prev) => {
      const current = prev[key] as string[];
      const next = current.includes(value)
        ? current.filter((x) => x !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const activeCount = countActiveFilters(filters, priceBounds.max);

  // Derive distinct boarding, dropping, amenity, and operator options from route inventory
  const boardingPoints = Array.from(new Set(allDepartures.map((b) => b.boardingPoint))).map((point) => ({
    label: point,
    count: allDepartures.filter((b) => b.boardingPoint === point).length,
  }));

  const droppingPoints = Array.from(new Set(allDepartures.map((b) => b.droppingPoint))).map((point) => ({
    label: point,
    count: allDepartures.filter((b) => b.droppingPoint === point).length,
  }));

  const availableAmenities = Array.from(
    new Set(allDepartures.flatMap((b) => b.amenities))
  ).filter((a) => a !== 'Sleeper' && a !== 'Seater');

  const availableOperators = OPERATOR_GROUPS.map((group) => ({
    ...group,
    count: allDepartures.filter((b) => group.matchOperatorIds.includes(b.operatorId)).length,
  })).filter((g) => g.count > 0);

  return (
    <div className="space-y-4">
      {!hideHeader && (
        <div className="flex items-center justify-between border-b border-[#EAE8E4] pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand" aria-hidden="true" />
            <h2 className="font-sans font-bold text-base text-brand">Filters</h2>
          </div>
          <button
            type="button"
            onClick={onReset}
            disabled={activeCount === 0}
            className="text-xs font-bold text-accent hover:text-accent-hover disabled:text-ink-muted disabled:opacity-50 inline-flex items-center gap-1 cursor-pointer disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-1 py-0.5"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* 1. Price Range */}
      <div className="space-y-2 pb-4 border-b border-[#EAE8E4]">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="price-range-slider" className="font-bold text-brand">
            Price range
          </label>
          <span className="font-semibold text-ink-muted tabular-nums">
            {formatInr(priceBounds.min)} – {formatInr(Math.min(filters.maxPrice, priceBounds.max))}
          </span>
        </div>
        <input
          id="price-range-slider"
          type="range"
          min={priceBounds.min}
          max={priceBounds.max}
          step={10}
          disabled={priceBounds.min >= priceBounds.max}
          value={Math.min(Math.max(filters.maxPrice, priceBounds.min), priceBounds.max)}
          onChange={(e) => {
            const val = Number(e.target.value);
            onChange((prev) => ({ ...prev, maxPrice: val }));
          }}
          className="w-full accent-[#FC7728] h-1.5 bg-surface-3 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-ink-muted tabular-nums">
          <span>{formatInr(priceBounds.min)}</span>
          <span>{formatInr(priceBounds.max)}</span>
        </div>
      </div>

      {/* 2. Bus Type (Canonical normalized IDs) */}
      <div className="space-y-2 pb-4 border-b border-[#EAE8E4]">
        <h3 className="text-xs font-bold text-brand">Bus type</h3>
        <div className="space-y-1">
          {COACH_FILTER_OPTIONS.map((opt) => {
            const count = allDepartures.filter((b) => b.coachTypeId === opt.id).length;
            const checked = filters.coachTypeIds.includes(opt.id as CoachTypeId);
            return (
              <label
                key={opt.id}
                className="flex items-center justify-between min-h-[34px] px-1.5 rounded-lg hover:bg-surface-2 cursor-pointer text-[13px]"
              >
                <span className="flex items-center gap-2.5 text-ink">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleArrayValue('coachTypeIds', opt.id)}
                    className="w-4 h-4 rounded border-line accent-[#0B2341] cursor-pointer"
                  />
                  <span className={checked ? 'font-bold text-brand' : 'font-medium text-ink-muted'}>
                    {opt.label}
                  </span>
                </span>
                <span className="text-xs text-ink-muted tabular-nums">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Departure Time */}
      <div className="space-y-2 pb-4 border-b border-[#EAE8E4]">
        <h3 className="text-xs font-bold text-brand">Departure time</h3>
        <div className="space-y-1">
          {DEPARTURE_SLOTS.map((slot) => {
            const count = allDepartures.filter((b) => b.departureSlot === slot.id).length;
            const checked = filters.departureSlots.includes(slot.id);
            return (
              <label
                key={slot.id}
                className="flex items-center justify-between min-h-[34px] px-1.5 rounded-lg hover:bg-surface-2 cursor-pointer text-[13px]"
              >
                <span className="flex items-center gap-2.5 text-ink">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleArrayValue('departureSlots', slot.id)}
                    className="w-4 h-4 rounded border-line accent-[#0B2341] cursor-pointer"
                  />
                  <span className={checked ? 'font-bold text-brand' : 'font-medium text-ink-muted'}>
                    {slot.label}
                  </span>
                </span>
                <span className="text-xs text-ink-muted tabular-nums">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Collapsible Boarding Point */}
      {boardingPoints.length > 0 && (
        <div className="pb-3 border-b border-[#EAE8E4]">
          <button
            type="button"
            onClick={() => toggleSection('boarding')}
            aria-expanded={openSections.boarding}
            className="w-full min-h-[36px] flex items-center justify-between text-xs font-bold text-brand cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
          >
            <span className="flex items-center gap-2">
              <span>Boarding point</span>
              {filters.boardingPoints.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-accent-tint text-accent text-[10px] font-bold">
                  {filters.boardingPoints.length}
                </span>
              )}
            </span>
            {openSections.boarding ? (
              <ChevronUp className="w-4 h-4 text-ink-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-ink-muted" />
            )}
          </button>
          {openSections.boarding && (
            <div className="mt-2 space-y-1">
              {boardingPoints.map((pt) => {
                const checked = filters.boardingPoints.includes(pt.label);
                return (
                  <label
                    key={pt.label}
                    className="flex items-center justify-between min-h-[32px] px-1.5 rounded-lg hover:bg-surface-2 cursor-pointer text-[13px]"
                  >
                    <span className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleArrayValue('boardingPoints', pt.label)}
                        className="w-4 h-4 rounded border-line accent-[#0B2341] cursor-pointer"
                      />
                      <span className={checked ? 'font-bold text-brand' : 'text-ink-muted'}>
                        {pt.label}
                      </span>
                    </span>
                    <span className="text-xs text-ink-muted tabular-nums">({pt.count})</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. Collapsible Dropping Point */}
      {droppingPoints.length > 0 && (
        <div className="pb-3 border-b border-[#EAE8E4]">
          <button
            type="button"
            onClick={() => toggleSection('dropping')}
            aria-expanded={openSections.dropping}
            className="w-full min-h-[36px] flex items-center justify-between text-xs font-bold text-brand cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
          >
            <span className="flex items-center gap-2">
              <span>Dropping point</span>
              {filters.droppingPoints.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-accent-tint text-accent text-[10px] font-bold">
                  {filters.droppingPoints.length}
                </span>
              )}
            </span>
            {openSections.dropping ? (
              <ChevronUp className="w-4 h-4 text-ink-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-ink-muted" />
            )}
          </button>
          {openSections.dropping && (
            <div className="mt-2 space-y-1">
              {droppingPoints.map((pt) => {
                const checked = filters.droppingPoints.includes(pt.label);
                return (
                  <label
                    key={pt.label}
                    className="flex items-center justify-between min-h-[32px] px-1.5 rounded-lg hover:bg-surface-2 cursor-pointer text-[13px]"
                  >
                    <span className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleArrayValue('droppingPoints', pt.label)}
                        className="w-4 h-4 rounded border-line accent-[#0B2341] cursor-pointer"
                      />
                      <span className={checked ? 'font-bold text-brand' : 'text-ink-muted'}>
                        {pt.label}
                      </span>
                    </span>
                    <span className="text-xs text-ink-muted tabular-nums">({pt.count})</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. Collapsible Amenities */}
      {availableAmenities.length > 0 && (
        <div className="pb-3 border-b border-[#EAE8E4]">
          <button
            type="button"
            onClick={() => toggleSection('amenities')}
            aria-expanded={openSections.amenities}
            className="w-full min-h-[36px] flex items-center justify-between text-xs font-bold text-brand cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
          >
            <span className="flex items-center gap-2">
              <span>Amenities</span>
              {filters.amenities.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-accent-tint text-accent text-[10px] font-bold">
                  {filters.amenities.length}
                </span>
              )}
            </span>
            {openSections.amenities ? (
              <ChevronUp className="w-4 h-4 text-ink-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-ink-muted" />
            )}
          </button>
          {openSections.amenities && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {availableAmenities.map((amenity) => {
                const active = filters.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleArrayValue('amenities', amenity)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      active
                        ? 'bg-brand text-on-brand'
                        : 'bg-surface-2 text-brand hover:bg-surface-3 border border-[#EAE8E4]'
                    }`}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 7. Collapsible Operators */}
      {availableOperators.length > 0 && (
        <div className="pb-3 border-b border-[#EAE8E4]">
          <button
            type="button"
            onClick={() => toggleSection('operators')}
            aria-expanded={openSections.operators}
            className="w-full min-h-[36px] flex items-center justify-between text-xs font-bold text-brand cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
          >
            <span className="flex items-center gap-2">
              <span>Operators</span>
              {filters.operatorIds.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-accent-tint text-accent text-[10px] font-bold">
                  {filters.operatorIds.length}
                </span>
              )}
            </span>
            {openSections.operators ? (
              <ChevronUp className="w-4 h-4 text-ink-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-ink-muted" />
            )}
          </button>
          {openSections.operators && (
            <div className="mt-2 space-y-1">
              {availableOperators.map((op) => {
                const checked = filters.operatorIds.includes(op.id);
                return (
                  <label
                    key={op.id}
                    className="flex items-center justify-between min-h-[32px] px-1.5 rounded-lg hover:bg-surface-2 cursor-pointer text-[13px]"
                  >
                    <span className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleArrayValue('operatorIds', op.id)}
                        className="w-4 h-4 rounded border-line accent-[#0B2341] cursor-pointer"
                      />
                      <span className={checked ? 'font-bold text-brand' : 'text-ink-muted'}>
                        {op.label}
                      </span>
                    </span>
                    <span className="text-xs text-ink-muted tabular-nums">({op.count})</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 8. Compact Optional Travel Mood */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection('mood')}
          aria-expanded={openSections.mood}
          className="w-full min-h-[36px] flex items-center justify-between text-xs font-bold text-brand cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        >
          <span className="flex items-center gap-2">
            <span>Travel mood</span>
            {filters.mood !== 'All' && (
              <span className="px-1.5 py-0.5 rounded-full bg-accent-tint text-accent text-[10px] font-bold">
                {filters.mood}
              </span>
            )}
          </span>
          {openSections.mood ? (
            <ChevronUp className="w-4 h-4 text-ink-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-ink-muted" />
          )}
        </button>
        {openSections.mood && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {MOOD_OPTIONS.map((mood) => {
              const active = filters.mood === mood;
              return (
                <button
                  key={mood}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange((prev) => ({ ...prev, mood }))}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    active
                      ? 'bg-brand text-on-brand'
                      : 'bg-surface-2 text-brand hover:bg-surface-3 border border-[#EAE8E4]'
                  }`}
                >
                  {mood}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export const FilterSidebar: FC<FilterPanelProps> = (props) => {
  return (
    <aside aria-label="Search filters" className="hidden lg:block w-full sticky top-24">
      <div className="bg-surface rounded-[14px] border border-[#EAE8E4] p-4 sm:p-5 shadow-xs">
        <FilterPanelContent {...props} />
      </div>
    </aside>
  );
};
