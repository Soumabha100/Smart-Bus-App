import { memo, useState, type FC } from 'react';
import {
  ArrowRight,
  BedDouble,
  ChevronRight,
  Droplets,
  Navigation,
  ShieldCheck,
  Snowflake,
  Star,
  Wifi,
  Zap,
} from 'lucide-react';
import type { BusTicket } from './types';
import { computeArrivalDayOffset, formatInr } from './journeyDate';

export type TicketCardVariant = 'peach' | 'blue';

interface TicketCardProps {
  ticket: BusTicket;
  variant?: TicketCardVariant;
  onViewSeats: (ticket: BusTicket) => void;
  onContinueBooking?: (ticket: BusTicket, seatId: string) => void;
}

function getOperatorInitials(operatorName: string): string {
  const words = operatorName
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return 'OB';
}

function getAmenityIcon(amenity: string) {
  const lower = amenity.toLowerCase();
  if (lower.includes('wi-fi') || lower.includes('wifi')) {
    return <Wifi className="w-3.5 h-3.5 text-ink-muted shrink-0" aria-hidden="true" />;
  }
  if (lower.includes('charging')) {
    return <Zap className="w-3.5 h-3.5 text-ink-muted shrink-0" aria-hidden="true" />;
  }
  if (lower.includes('water')) {
    return <Droplets className="w-3.5 h-3.5 text-ink-muted shrink-0" aria-hidden="true" />;
  }
  if (lower.includes('blanket')) {
    return <BedDouble className="w-3.5 h-3.5 text-ink-muted shrink-0" aria-hidden="true" />;
  }
  if (lower === 'ac') {
    return <Snowflake className="w-3.5 h-3.5 text-ink-muted shrink-0" aria-hidden="true" />;
  }
  if (lower.includes('gps')) {
    return <Navigation className="w-3.5 h-3.5 text-ink-muted shrink-0" aria-hidden="true" />;
  }
  return <ShieldCheck className="w-3.5 h-3.5 text-ink-muted shrink-0" aria-hidden="true" />;
}

/** Filters out terms already displayed in the concise coachTypeLabel (e.g. AC, Sleeper, Seater). */
function getDistinctFooterAmenities(amenities: string[] | undefined, coachTypeLabel: string): string[] {
  if (!amenities || amenities.length === 0) return [];
  const lowerLabel = coachTypeLabel.toLowerCase();
  const labelTokens = new Set<string>();
  if (lowerLabel.includes('ac')) labelTokens.add('ac');
  if (lowerLabel.includes('sleeper')) labelTokens.add('sleeper');
  if (lowerLabel.includes('seater')) labelTokens.add('seater');

  return amenities
    .filter((item) => !labelTokens.has(item.trim().toLowerCase()))
    .slice(0, 3);
}

const TicketCardComponent: FC<TicketCardProps> = ({
  ticket,
  variant = 'peach',
  onViewSeats,
  onContinueBooking,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const initials = getOperatorInitials(ticket.operator);
  const dayOffset = computeArrivalDayOffset(ticket.departureTime, ticket.duration);
  const isSoldOut = ticket.seatsLeft <= 0;
  const footerAmenities = getDistinctFooterAmenities(ticket.amenities, ticket.coachTypeLabel);
  const hasRating = typeof ticket.rating === 'number' && ticket.rating > 0;

  const isPeach = variant === 'peach';
  const stubBgClass = isPeach ? 'bg-[#FFF5EB]' : 'bg-[#EEF5FD]';
  const badgeBgClass = isPeach ? 'bg-[#FCE5D2] text-[#0B2341]' : 'bg-[#DCEBFB] text-[#0B2341]';

  return (
    <article className="ticket-perf-item relative bg-surface rounded-2xl border border-[#EAE8E4] shadow-xs hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,78fr)_minmax(192px,22fr)]">
        {/* LEFT MAIN SECTION (~78% Desktop): Always pure white surface */}
        <div className="bg-surface rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none flex flex-col justify-between min-w-0">
          {/* Upper Operator + Journey Schedule */}
          <div className="p-4 sm:px-5 sm:py-4">
            <div className="ticket-main-grid">
              {/* Operator Badge, Name, Bus Type & Rating */}
              <div className="ticket-operator-cell flex items-start gap-3 min-w-0">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-sm tracking-tight shrink-0 ${badgeBgClass}`}
                  aria-hidden="true"
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <h3 className="font-sans text-[17px] lg:text-[18px] font-bold text-brand leading-snug break-words">
                    {ticket.operator}
                  </h3>
                  <div className="text-[13px] font-medium text-ink-muted leading-snug mt-0.5">
                    {ticket.coachTypeLabel}
                  </div>
                  {hasRating && (
                    <div className="flex items-center gap-1 mt-1 text-xs font-bold text-brand tabular-nums">
                      <Star
                        className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B] shrink-0"
                        aria-hidden="true"
                      />
                      <span>{ticket.rating!.toFixed(1)}</span>
                      {typeof ticket.reviewsCount === 'number' && ticket.reviewsCount > 0 && (
                        <span className="font-medium text-ink-muted">
                          ({ticket.reviewsCount.toLocaleString('en-IN')})
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Timetable Row (3 aligned columns on md+ / mobile) */}
              <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:contents items-start gap-2.5">
                {/* Departure */}
                <div className="min-w-0">
                  <div className="font-sans text-xl sm:text-2xl lg:text-[25px] font-extrabold text-brand tabular-nums leading-none">
                    {ticket.departureTime}
                  </div>
                  <div className="text-[13px] font-medium text-ink-muted mt-1.5 leading-snug break-words">
                    {ticket.originStation}
                  </div>
                </div>

                {/* Duration Centered Inline on Thin Corridor Line */}
                <div className="flex items-center justify-center gap-1.5 pt-1.5 md:pt-0 md:px-0.5 min-w-[82px] sm:min-w-[100px]">
                  <span className="w-2 h-2 rounded-full border-[1.5px] border-[#94A3B8] bg-surface shrink-0" />
                  <span className="h-px flex-1 min-w-[10px] bg-[#D4D6DC]" />
                  <span className="text-xs font-medium text-ink-muted tabular-nums whitespace-nowrap px-0.5">
                    {ticket.duration}
                  </span>
                  <span className="h-px flex-1 min-w-[10px] bg-[#D4D6DC]" />
                  <span className="w-2 h-2 rounded-full border-[1.5px] border-[#94A3B8] bg-surface shrink-0" />
                </div>

                {/* Arrival */}
                <div className="min-w-0 text-right md:text-left">
                  <div className="inline-flex md:flex items-baseline justify-end md:justify-start gap-1.5 whitespace-nowrap">
                    <span className="font-sans text-xl sm:text-2xl lg:text-[25px] font-extrabold text-brand tabular-nums leading-none">
                      {ticket.arrivalTime}
                    </span>
                    {dayOffset > 0 && (
                      <span className="text-[11px] sm:text-xs font-medium text-ink-muted whitespace-nowrap">
                        +{dayOffset} day
                      </span>
                    )}
                  </div>
                  <div className="text-[13px] font-medium text-ink-muted mt-1.5 leading-snug break-words">
                    {ticket.destinationStation}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal Divider & Compact Amenities Footer Row (stops at dashed ticket seam) */}
          <div className="mx-4 sm:mx-5 py-2.5 border-t border-[#EAE8E4] flex items-center justify-between gap-3 flex-wrap">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-muted min-w-0">
              {footerAmenities.length > 0 ? (
                footerAmenities.map((amenity) => (
                  <span key={amenity} className="inline-flex items-center gap-1.5 font-medium">
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-ink-muted font-medium">Standard coach</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              className="ml-auto text-xs font-bold text-brand hover:text-accent inline-flex items-center gap-0.5 py-1 px-1.5 -mr-1.5 rounded-lg cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span>Bus details</span>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                  isExpanded ? 'rotate-90' : ''
                }`}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Expandable Bus Details Drawer (kept inside white main section) */}
          {isExpanded && (
            <div className="px-4 sm:px-5 py-3.5 border-t border-[#EAE8E4] bg-surface-2/50 space-y-2.5 text-[13px] text-ink rounded-bl-none md:rounded-bl-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-bold text-brand">Boarding &amp; pickup note</div>
                  <p className="text-ink-muted mt-0.5">
                    {ticket.originStation} — {ticket.originDetails}
                  </p>
                  {ticket.boardingInstructions && (
                    <p className="text-ink-muted text-xs mt-1">{ticket.boardingInstructions}</p>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-brand">Dropping point &amp; coach</div>
                  <p className="text-ink-muted mt-0.5">
                    {ticket.destinationStation} — {ticket.destinationDetails}
                  </p>
                  <p className="text-ink-muted text-xs mt-1">
                    {ticket.busType} •{' '}
                    {ticket.operatorType === 'government' ? 'Government fleet' : 'Private operator'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EAE8E4]">
                <div className="text-xs text-ink-muted">
                  <span className="font-semibold text-brand">Amenities: </span>
                  <span>
                    {ticket.amenities && ticket.amenities.length > 0
                      ? ticket.amenities.join(' • ')
                      : 'Standard seating'}
                  </span>
                </div>

                {onContinueBooking && !isSoldOut && (
                  <button
                    type="button"
                    onClick={() => onContinueBooking(ticket, 'Window / Berth (Demo)')}
                    className="text-xs font-semibold text-accent hover:text-accent-hover underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                  >
                    Preview 7-min hold modal
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT FARE STUB (~22% Desktop, Horizontal Bottom Stub on Mobile) */}
        <div
          className={`relative md:border-l border-t md:border-t-0 border-dashed border-[#D3D5DC] rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none px-4 py-3.5 sm:px-5 md:py-4 flex md:flex-col items-center md:items-stretch justify-between md:justify-center gap-3 ${stubBgClass}`}
        >
          {/* Desktop Vertical Seam Semicircular Cutouts */}
          <span className="hidden md:block ticket-notch-top" aria-hidden="true" />
          <span className="hidden md:block ticket-notch-bottom" aria-hidden="true" />

          {/* Mobile Horizontal Seam Semicircular Cutouts */}
          <span className="md:hidden ticket-notch-left" aria-hidden="true" />
          <span className="md:hidden ticket-notch-right" aria-hidden="true" />

          {/* Fare & Remaining Seats */}
          <div className="md:text-left">
            <div className="font-sans text-2xl lg:text-[26px] font-extrabold text-brand tabular-nums leading-none">
              {formatInr(ticket.price)}
            </div>
            <div
              className={`text-xs font-medium mt-1 tabular-nums ${
                isSoldOut ? 'text-danger font-bold' : 'text-ink-muted'
              }`}
            >
              {isSoldOut ? 'Sold out' : `${ticket.seatsLeft} seats left`}
            </div>
          </div>

          {/* Primary Action: Tangerine #FF883E with bold Navy #0B2341 */}
          <button
            type="button"
            disabled={isSoldOut}
            onClick={() => onViewSeats(ticket)}
            className={`min-h-[44px] h-[44px] sm:h-[46px] px-5 md:px-4 md:w-full rounded-xl text-sm font-extrabold inline-flex items-center justify-center gap-1.5 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2341] focus-visible:ring-offset-2 ${
              isSoldOut
                ? 'bg-surface-3 text-ink-muted cursor-not-allowed'
                : 'bg-[#FF883E] hover:bg-[#F57828] active:bg-[#EA6B1C] text-[#0B2341] cursor-pointer shadow-xs'
            }`}
          >
            <span>{isSoldOut ? 'Sold out' : 'View seats'}</span>
            {!isSoldOut && <ArrowRight className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </article>
  );
};

export const TicketCard = memo(TicketCardComponent);
