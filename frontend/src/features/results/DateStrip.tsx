import { type FC } from 'react';

interface DateOption {
  id: string;
  dateLabel: string;
  price: string;
  busCount: string;
  badge?: string;
}

const DATE_OPTIONS: DateOption[] = [
  { id: '2026-11-12', dateLabel: '12 Nov, Thu', price: '₹620', busCount: '14 buses' },
  { id: '2026-11-13', dateLabel: '13 Nov, Fri', price: '₹710', busCount: '22 buses' },
  { id: '2026-11-14', dateLabel: '14 Nov, Sat', price: '₹520 onwards', busCount: '18 Buses' },
  { id: '2026-11-15', dateLabel: '15 Nov, Sun', price: '₹680', busCount: '16 buses' },
  { id: '2026-11-16', dateLabel: '16 Nov, Mon', price: '₹520', busCount: 'Lowest Fare ₹520', badge: 'LOWEST' },
];

interface DateStripProps {
  selectedDateId: string;
  onSelectDate: (id: string) => void;
}

export const DateStrip: FC<DateStripProps> = ({ selectedDateId, onSelectDate }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
      {DATE_OPTIONS.map((item) => {
        const isSelected = selectedDateId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectDate(item.id)}
            className={`p-3 rounded-xl transition-all text-center flex flex-col items-center justify-center relative cursor-pointer ${
              isSelected
                ? 'bg-gradient-to-b from-teal-50 to-white border-2 border-teal-600 shadow-xs'
                : 'bg-white border border-[#E5E1D8] hover:border-teal-500/50'
            }`}
          >
            {isSelected && (
              <span className="absolute -top-2.5 px-2 py-0.5 rounded-full bg-teal-600 text-white text-[10px] font-extrabold tracking-wider uppercase">
                SELECTED
              </span>
            )}
            {item.badge === 'LOWEST' && !isSelected && (
              <span className="text-[10px] font-extrabold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200 mt-0.5">
                Lowest Fare ₹520
              </span>
            )}

            <span
              className={`text-xs uppercase ${
                isSelected ? 'font-extrabold text-teal-700' : 'font-bold text-[#64748B]'
              }`}
            >
              {item.dateLabel}
            </span>

            <span className="font-sans text-base font-extrabold text-[#0B2341] mt-0.5">
              {item.price}
            </span>

            <span
              className={`text-[11px] font-semibold mt-0.5 ${
                isSelected ? 'text-[#FC7728] font-bold' : 'text-[#64748B]'
              }`}
            >
              {item.busCount}
            </span>
          </button>
        );
      })}

      {/* Calendar Button */}
      <button
        type="button"
        onClick={() => alert('Bengal Transit Calendar: Viewing November departures across all regional fleets.')}
        className="p-3 rounded-xl bg-[#F6F4EE] border border-[#E5E1D8] hover:bg-[#EFEEEA] transition-all text-center flex flex-col items-center justify-center gap-0.5 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[#64748B] text-[22px]">
          calendar_month
        </span>
        <span className="text-xs font-bold text-[#0B2341]">Calendar View</span>
      </button>
    </div>
  );
};
