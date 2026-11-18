import { type FC } from 'react';
import type { FilterState } from './types';

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (updater: (prev: FilterState) => FilterState) => void;
  onReset: () => void;
}

export const FilterSidebar: FC<FilterSidebarProps> = ({ filters, onChange, onReset }) => {
  const toggleArrayItem = (key: keyof FilterState, item: string) => {
    onChange((prev) => {
      const arr = (prev[key] as string[]) || [];
      const updated = arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
      return { ...prev, [key]: updated };
    });
  };

  return (
    <aside className="lg:col-span-4 xl:col-span-3.5 space-y-5 sticky top-28">
      <div className="bg-white rounded-2xl border border-[#E5E1D8] p-5 shadow-xs space-y-5">
        {/* Filter Header */}
        <div className="flex items-center justify-between border-b border-[#E5E1D8] pb-3.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#FC7728] text-[22px]">tune</span>
            <h2 className="font-sans font-bold text-lg text-[#0B2341]">Journey Filters</h2>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">refresh</span>
            <span>Reset</span>
          </button>
        </div>

        {/* Travel Mood Chips */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-teal-700">psychology</span>
              <span>Travel Mood</span>
            </label>
            <span className="text-[10px] text-teal-800 font-bold bg-teal-50 border border-teal-200/80 px-1.5 py-0.5 rounded">
              AI Recommended
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'Sleep well', label: '😴 Sleep Well' },
              { id: 'Fastest', label: '⚡ Fastest' },
              { id: 'Budget friendly', label: '💰 Budget Friendly' },
              { id: 'Scenic route', label: '🌄 Scenic Route' },
              { id: 'All', label: 'All' },
            ].map((mood) => {
              const active = filters.mood === mood.id;
              return (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => onChange((prev) => ({ ...prev, mood: mood.id }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-[#FBF9F5] text-[#0B2341] border border-[#E5E1D8] hover:border-teal-500/40'
                  }`}
                >
                  {mood.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range Slider */}
        <div className="space-y-2 border-t border-[#E5E1D8] pt-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#0B2341]">Max Price Budget</span>
            <span className="font-extrabold text-[#A04100] bg-[#FFDBCB]/60 px-2 py-0.5 rounded border border-[#FC7728]/30">
              Max ₹{filters.maxPrice}
            </span>
          </div>
          <input
            type="range"
            min="400"
            max="1500"
            step="50"
            value={filters.maxPrice}
            onChange={(e) => {
              const val = Number(e.target.value);
              onChange((prev) => ({ ...prev, maxPrice: val }));
            }}
            className="w-full accent-[#FC7728] h-1.5 bg-[#EFEEEA] rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-[#64748B] font-medium">
            <span>Min ₹400</span>
            <span>₹950</span>
            <span>Max ₹1,500</span>
          </div>
          <div className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-teal-600">savings</span>
            <span>
              Cap at ₹{filters.maxPrice} saves ~28% compared to weekend spot booking!
            </span>
          </div>
        </div>

        {/* Departure Time 4 Tiles */}
        <div className="space-y-2.5 border-t border-[#E5E1D8] pt-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] block">
            Departure Time (Kolkata)
          </span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { slot: 'early', title: 'Early Morning', time: '00:00 - 06:00', icon: 'wb_twilight' },
              { slot: 'morning', title: 'Morning', time: '06:00 - 12:00', icon: 'wb_sunny' },
              { slot: 'afternoon', title: 'Afternoon', time: '12:00 - 18:00', icon: 'wb_cloudy' },
              { slot: 'night', title: 'Night (18-24)', time: 'Best Sleep Pick', icon: 'bedtime' },
            ].map((t) => {
              const isSelected = filters.departureSlots.includes(t.slot);
              return (
                <button
                  key={t.slot}
                  type="button"
                  onClick={() => toggleArrayItem('departureSlots', t.slot)}
                  className={`p-2 rounded-xl text-left transition-all cursor-pointer flex flex-col ${
                    isSelected
                      ? 'border-2 border-teal-600 bg-teal-50 shadow-xs'
                      : 'border border-[#E5E1D8] bg-[#FBF9F5] hover:bg-[#F6F4EE]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        isSelected ? 'text-teal-700' : 'text-[#64748B]'
                      }`}
                    >
                      {t.icon}
                    </span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />}
                  </div>
                  <span className="text-xs font-bold text-[#0B2341] mt-1">{t.title}</span>
                  <span
                    className={`text-[10px] ${
                      isSelected ? 'font-bold text-teal-700' : 'text-[#64748B]'
                    }`}
                  >
                    {t.time}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bus Types Checkboxes */}
        <div className="space-y-2 border-t border-[#E5E1D8] pt-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] block">
            Bus Type &amp; Comfort
          </span>
          <div className="space-y-1.5">
            {[
              { label: 'AC Sleeper (2+1)', count: 11 },
              { label: 'AC Semi-Sleeper / Recliner', count: 5 },
              { label: 'Volvo Multi-Axle Luxury', count: 7 },
              { label: 'Non-AC Seater / Sleeper', count: 2 },
            ].map((type) => {
              const checked = filters.busTypes.includes(type.label);
              return (
                <label
                  key={type.label}
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#F6F4EE] cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArrayItem('busTypes', type.label)}
                      className="rounded border-[#E5E1D8] text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer"
                    />
                    <span className={`font-medium ${checked ? 'text-[#0B2341] font-bold' : 'text-[#44474E]'}`}>
                      {type.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#64748B] font-medium px-1.5 py-0.5 rounded bg-[#F6F4EE]">
                    {type.count}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Boarding Points */}
        <div className="space-y-2 border-t border-[#E5E1D8] pt-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] block">
            Boarding Points (Kolkata)
          </span>
          <div className="space-y-1.5">
            {[
              { label: 'Esplanade / Dharmatala', count: 12 },
              { label: 'Babughat Bus Stand', count: 8 },
              { label: 'Airport Gate No. 1', count: 6 },
              { label: 'Dankuni Toll Plaza', count: 5 },
            ].map((point) => {
              const checked = filters.boardingPoints.includes(point.label);
              return (
                <label
                  key={point.label}
                  className="flex items-center justify-between p-1 rounded-lg hover:bg-[#F6F4EE] cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArrayItem('boardingPoints', point.label)}
                      className="rounded border-[#E5E1D8] text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer"
                    />
                    <span className={`font-medium ${checked ? 'text-[#0B2341] font-bold' : 'text-[#44474E]'}`}>
                      {point.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#64748B]">{point.count}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Dropping Points */}
        <div className="space-y-2 border-t border-[#E5E1D8] pt-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] block">
            Dropping Points (Siliguri)
          </span>
          <div className="space-y-1.5">
            {[
              { label: 'Tenzing Norgay Bus Terminus', count: 15 },
              { label: 'Siliguri Junction Stand', count: 9 },
              { label: 'ISBT Bypass Corridor', count: 4 },
            ].map((point) => {
              const checked = filters.droppingPoints.includes(point.label);
              return (
                <label
                  key={point.label}
                  className="flex items-center justify-between p-1 rounded-lg hover:bg-[#F6F4EE] cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArrayItem('droppingPoints', point.label)}
                      className="rounded border-[#E5E1D8] text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer"
                    />
                    <span className={`font-medium ${checked ? 'text-[#0B2341] font-bold' : 'text-[#44474E]'}`}>
                      {point.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#64748B]">{point.count}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Amenities Multi-Select */}
        <div className="space-y-2 border-t border-[#E5E1D8] pt-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] block">
            Amenities
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Free WiFi', icon: 'wifi' },
              { label: 'Charging', icon: 'power' },
              { label: 'Water', icon: 'local_drink' },
              { label: 'Blanket', icon: 'bed' },
              { label: 'Live GPS', icon: 'near_me' },
            ].map((amenity) => {
              const active = filters.amenities.includes(amenity.label);
              return (
                <button
                  key={amenity.label}
                  type="button"
                  onClick={() => toggleArrayItem('amenities', amenity.label)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                    active
                      ? 'bg-teal-700 text-white font-bold'
                      : 'bg-[#FBF9F5] border border-[#E5E1D8] hover:border-teal-500/40 text-[#0B2341]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[15px] ${
                      active ? 'text-white' : 'text-teal-700'
                    }`}
                  >
                    {amenity.icon}
                  </span>
                  <span>{amenity.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bengal Operators */}
        <div className="space-y-2 border-t border-[#E5E1D8] pt-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#64748B] block">
            Bengal Operators
          </span>
          <div className="space-y-1.5">
            {[
              { name: 'NBSTC (Govt of WB)', badge: 'State', isState: true },
              { name: 'SBSTC & WBTC', count: 3 },
              { name: 'Shyamoli Paribahan', count: 5 },
              { name: 'Royal Cruiser', count: 4 },
              { name: 'Greenline Travels', count: 3 },
            ].map((op) => {
              const checked = filters.operators.includes(op.name);
              return (
                <label
                  key={op.name}
                  className="flex items-center justify-between p-1 rounded-lg hover:bg-[#F6F4EE] cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleArrayItem('operators', op.name)}
                      className="rounded border-[#E5E1D8] text-teal-600 focus:ring-teal-600 w-4 h-4 cursor-pointer"
                    />
                    <span className={`font-medium ${checked ? 'text-[#0B2341] font-bold' : 'text-[#44474E]'}`}>
                      {op.name}
                    </span>
                  </div>
                  {op.isState ? (
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                      {op.badge}
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#64748B]">{op.count}</span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Conductor Route Advice Card */}
        <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200/80 text-[#0B2341] space-y-2">
          <div className="flex items-center gap-2 text-[#A04100] font-bold text-xs">
            <span className="material-symbols-outlined text-[18px]">wb_twilight</span>
            <span>Conductor Route Advice</span>
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed">
            &quot;Right-side window berths on NH-12 offer serene sunrise views across Malda mango orchards and misty Teesta river channels before entering Siliguri.&quot;
          </p>
        </div>
      </div>
    </aside>
  );
};
