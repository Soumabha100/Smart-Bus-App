import type { BusTicket, CoachTypeId, DateFareSummary, FilterState } from './types';

export function countActiveFilters(filters: FilterState, maxBound: number): number {
  let count = 0;
  if (filters.maxPrice < maxBound) count += 1;
  count += filters.coachTypeIds.length;
  count += filters.departureSlots.length;
  count += filters.boardingPoints.length;
  count += filters.droppingPoints.length;
  count += filters.amenities.length;
  count += filters.operatorIds.length;
  if (filters.mood !== 'All') count += 1;
  return count;
}
import {
  addDaysIso,
  formatDateStripTile,
  getTodayKolkataIso,
  isWithinBookingWindow,
  deriveDepartureSlot,
} from './journeyDate';

export function normalizeCityKey(city: string): string {
  const base = city.trim().toLowerCase().split('(')[0].split('/')[0].trim();
  if (base.startsWith('kolkata')) return 'kolkata';
  if (base.startsWith('siliguri')) return 'siliguri';
  if (base.startsWith('digha')) return 'digha';
  if (base.startsWith('howrah')) return 'howrah';
  if (base.startsWith('durgapur')) return 'durgapur';
  if (base.startsWith('bolpur') || base.includes('santiniketan')) return 'bolpur';
  if (base.startsWith('malda')) return 'malda';
  if (base.startsWith('haldia')) return 'haldia';
  if (base.startsWith('asansol')) return 'asansol';
  return base;
}

export function makeRouteKey(origin: string, destination: string): string {
  return `${normalizeCityKey(origin)}->${normalizeCityKey(destination)}`;
}

// Explicit confirmed empty maintenance day (dynamic +30 days ahead so current dates remain full)
function isConfirmedEmptyDate(dateIso: string): boolean {
  return dateIso === addDaysIso(getTodayKolkataIso(), 30);
}

type BaseFixtureDeparture = Omit<BusTicket, 'departureSlot'>;

const ROUTE_FIXTURES: Record<string, BaseFixtureDeparture[]> = {
  'kolkata->siliguri': [
    {
      id: 'shyamoli-ks-1',
      routeKey: 'kolkata->siliguri',
      operatorId: 'shyamoli',
      operator: 'Shyamoli Paribahan',
      operatorGroupId: 'shyamoli',
      busType: 'Volvo Multi-Axle AC Sleeper (2+1) • Air Suspension',
      coachTypeId: 'ac-sleeper',
      coachTypeLabel: 'AC Sleeper',
      rating: 4.6,
      reviewsCount: 1240,
      departureTime: '20:30',
      originStation: 'Esplanade Stand D',
      originDetails: 'Near Eden Gardens Metro Gate 2 — Report 15 mins early',
      arrivalTime: '08:00',
      destinationStation: 'Siliguri Junction',
      destinationDetails: 'Main Bus Stand Terminal Bay 4',
      duration: '11h 30m',
      onTimeRate: '98% on-time record',
      originalPrice: 950,
      price: 749,
      seatsLeft: 12,
      recommendedRank: 1,
      operatorType: 'private',
      moodMatch: 'Sleep well',
      boardingPoint: 'Esplanade / Dharmatala',
      droppingPoint: 'Siliguri Junction',
      amenities: ['Sleeper', 'AC', 'Wi-Fi', 'Charging', 'Water', 'Blanket', 'GPS'],
      boardingInstructions: 'Show e-ticket SMS at Counter 4, Esplanade Stand D.',
    },
    {
      id: 'greenline-ks-1',
      routeKey: 'kolkata->siliguri',
      operatorId: 'greenline',
      operator: 'Greenline Travels',
      operatorGroupId: 'greenline',
      busType: 'Scania Multi-Axle AC Sleeper (2+1)',
      coachTypeId: 'ac-sleeper',
      coachTypeLabel: 'AC Sleeper',
      rating: 4.8,
      reviewsCount: 2410,
      departureTime: '22:00',
      originStation: 'Airport Gate 1',
      originDetails: 'VIP Flyover Departure Bay',
      arrivalTime: '09:00',
      destinationStation: 'Siliguri ISBT',
      destinationDetails: 'Bypass Hub Gate 4',
      duration: '11h 00m',
      onTimeRate: '96% on-time record',
      originalPrice: 880,
      price: 799,
      seatsLeft: 19,
      recommendedRank: 2,
      operatorType: 'private',
      moodMatch: 'Sleep well',
      boardingPoint: 'Airport Gate No. 1',
      droppingPoint: 'Siliguri ISBT',
      amenities: ['Sleeper', 'AC', 'Wi-Fi', 'Charging', 'Water', 'Blanket', 'GPS'],
      boardingInstructions: 'Coach parks at VIP Road Gate 1 pickup bay 20 mins prior.',
    },
    {
      id: 'royal-ks-1',
      routeKey: 'kolkata->siliguri',
      operatorId: 'royal-cruiser',
      operator: 'Royal Cruiser Express',
      operatorGroupId: 'royal-cruiser',
      busType: 'BharatBenz AC Executive Seater (2+2)',
      coachTypeId: 'ac-seater',
      coachTypeLabel: 'AC Seater',
      rating: 4.4,
      reviewsCount: 850,
      departureTime: '21:15',
      originStation: 'Babughat Stand',
      originDetails: 'Gate 2 Near Strand Road',
      arrivalTime: '07:00',
      destinationStation: 'Tenzing Norgay Terminus',
      destinationDetails: 'Platform 12 Main Bay',
      duration: '9h 45m',
      onTimeRate: 'Express highway transit',
      originalPrice: 720,
      price: 620,
      seatsLeft: 4,
      recommendedRank: 3,
      operatorType: 'private',
      moodMatch: 'Fastest',
      boardingPoint: 'Babughat Bus Stand',
      droppingPoint: 'Tenzing Norgay Terminus',
      amenities: ['Seater', 'AC', 'Charging', 'Water', 'GPS'],
      boardingInstructions: 'Limited luggage locker space; report 15 mins prior.',
    },
    {
      id: 'nbstc-ks-1',
      routeKey: 'kolkata->siliguri',
      operatorId: 'nbstc',
      operator: 'NBSTC Royal Heritage',
      operatorGroupId: 'govt-wb',
      busType: 'Volvo AC Semi-Sleeper • State Express',
      coachTypeId: 'ac-seater',
      coachTypeLabel: 'AC Seater',
      rating: 4.2,
      reviewsCount: 3120,
      departureTime: '20:00',
      originStation: 'Esplanade NBSTC Terminus',
      originDetails: 'Platform 4 (Dharmatala)',
      arrivalTime: '07:30',
      destinationStation: 'Tenzing Norgay Terminus',
      destinationDetails: 'NBSTC Bay A',
      duration: '11h 30m',
      onTimeRate: 'Govt of West Bengal',
      price: 520,
      seatsLeft: 16,
      recommendedRank: 4,
      operatorType: 'government',
      moodMatch: 'Budget friendly',
      boardingPoint: 'Esplanade / Dharmatala',
      droppingPoint: 'Tenzing Norgay Terminus',
      amenities: ['Seater', 'AC', 'Water', 'GPS'],
      boardingInstructions: 'Official NBSTC Bay 4 departure; carry valid photo ID.',
    },
    {
      id: 'sbstc-ks-1',
      routeKey: 'kolkata->siliguri',
      operatorId: 'sbstc',
      operator: 'SBSTC North Bengal Express',
      operatorGroupId: 'govt-wb',
      busType: 'Non-AC Deluxe 2+2 Pushback • State Fleet',
      coachTypeId: 'non-ac-seater',
      coachTypeLabel: 'Non-AC Seater',
      rating: 4.1,
      reviewsCount: 980,
      departureTime: '14:30',
      originStation: 'Karunamoyee Hub',
      originDetails: 'Salt Lake Sector II Bay 3',
      arrivalTime: '02:00',
      destinationStation: 'Siliguri Junction',
      destinationDetails: 'Platform 3',
      duration: '11h 30m',
      onTimeRate: 'Govt of West Bengal',
      price: 450,
      seatsLeft: 11,
      recommendedRank: 5,
      operatorType: 'government',
      moodMatch: 'Budget friendly',
      boardingPoint: 'Karunamoyee',
      droppingPoint: 'Siliguri Junction',
      amenities: ['Seater', 'Charging', 'GPS'],
      boardingInstructions: 'Boards from Karunamoyee International Bus Terminus Bay 3.',
    },
    {
      id: 'wbtc-ks-1',
      routeKey: 'kolkata->siliguri',
      operatorId: 'wbtc',
      operator: 'WBTC Himalayan Queen',
      operatorGroupId: 'govt-wb',
      busType: 'Volvo Luxury AC Seater • Vista Windows',
      coachTypeId: 'ac-seater',
      coachTypeLabel: 'AC Seater',
      rating: 4.5,
      reviewsCount: 1450,
      departureTime: '06:15',
      originStation: 'Esplanade Terminal',
      originDetails: 'Kolkata Central Hub Bay 1',
      arrivalTime: '17:30',
      destinationStation: 'Siliguri Junction',
      destinationDetails: 'Junction Bus Terminal',
      duration: '11h 15m',
      onTimeRate: 'Daytime NH-12 service',
      originalPrice: 850,
      price: 760,
      seatsLeft: 0, // Sold out example for unavailable booking state verification
      recommendedRank: 6,
      operatorType: 'government',
      moodMatch: 'Scenic route',
      boardingPoint: 'Esplanade / Dharmatala',
      droppingPoint: 'Siliguri Junction',
      amenities: ['Seater', 'AC', 'Wi-Fi', 'Charging', 'Water', 'GPS'],
      boardingInstructions: 'Daytime scenic coach via Krishnanagar and Malda bypass.',
    },
  ],
  'kolkata->digha': [
    {
      id: 'sbstc-kd-1',
      routeKey: 'kolkata->digha',
      operatorId: 'sbstc',
      operator: 'SBSTC Coastal Express',
      operatorGroupId: 'govt-wb',
      busType: 'Volvo AC Seater (2+2)',
      coachTypeId: 'ac-seater',
      coachTypeLabel: 'AC Seater',
      rating: 4.4,
      reviewsCount: 1820,
      departureTime: '06:30',
      originStation: 'Esplanade Stand',
      originDetails: 'SBSTC Bay 2',
      arrivalTime: '10:45',
      destinationStation: 'Digha Old Bus Stand',
      destinationDetails: 'Main Terminus',
      duration: '4h 15m',
      onTimeRate: '95% on-time record',
      price: 290,
      seatsLeft: 18,
      recommendedRank: 1,
      operatorType: 'government',
      moodMatch: 'Scenic route',
      boardingPoint: 'Esplanade / Dharmatala',
      droppingPoint: 'Old Digha',
      amenities: ['Seater', 'AC', 'Charging', 'Water', 'GPS'],
    },
    {
      id: 'shyamoli-kd-1',
      routeKey: 'kolkata->digha',
      operatorId: 'shyamoli',
      operator: 'Shyamoli Coastal Cruiser',
      operatorGroupId: 'shyamoli',
      busType: 'AC Multi-Axle Pushback Seater',
      coachTypeId: 'ac-seater',
      coachTypeLabel: 'AC Seater',
      rating: 4.5,
      reviewsCount: 910,
      departureTime: '14:15',
      originStation: 'Karunamoyee',
      originDetails: 'Salt Lake Bay 1',
      arrivalTime: '18:15',
      destinationStation: 'New Digha Stand',
      destinationDetails: 'Gate 2',
      duration: '4h 00m',
      onTimeRate: 'Fast coastal run',
      price: 340,
      seatsLeft: 9,
      recommendedRank: 2,
      operatorType: 'private',
      moodMatch: 'Fastest',
      boardingPoint: 'Karunamoyee',
      droppingPoint: 'New Digha',
      amenities: ['Seater', 'AC', 'Wi-Fi', 'Charging', 'Water'],
    },
  ],
  'howrah->digha': [
    {
      id: 'sbstc-hd-1',
      routeKey: 'howrah->digha',
      operatorId: 'sbstc',
      operator: 'SBSTC Howrah Express',
      operatorGroupId: 'govt-wb',
      busType: 'Non-AC Express Seater',
      coachTypeId: 'non-ac-seater',
      coachTypeLabel: 'Non-AC Seater',
      rating: 4.1,
      reviewsCount: 1120,
      departureTime: '07:00',
      originStation: 'Howrah Station Bay',
      originDetails: 'Platform 6 Bus Stand',
      arrivalTime: '11:15',
      destinationStation: 'Digha Old Bus Stand',
      destinationDetails: 'Main Terminus',
      duration: '4h 15m',
      onTimeRate: 'Govt of West Bengal',
      price: 220,
      seatsLeft: 21,
      recommendedRank: 1,
      operatorType: 'government',
      moodMatch: 'Budget friendly',
      boardingPoint: 'Howrah Station',
      droppingPoint: 'Old Digha',
      amenities: ['Seater', 'GPS'],
    },
  ],
  'kolkata->bolpur': [
    {
      id: 'wbtc-kb-1',
      routeKey: 'kolkata->bolpur',
      operatorId: 'wbtc',
      operator: 'WBTC Santiniketan Express',
      operatorGroupId: 'govt-wb',
      busType: 'Deluxe AC Seater (2+2)',
      coachTypeId: 'ac-seater',
      coachTypeLabel: 'AC Seater',
      rating: 4.5,
      reviewsCount: 640,
      departureTime: '07:15',
      originStation: 'Karunamoyee Hub',
      originDetails: 'Salt Lake Bay 4',
      arrivalTime: '11:00',
      destinationStation: 'Prantik Bus Stop',
      destinationDetails: 'Santiniketan Chowk',
      duration: '3h 45m',
      onTimeRate: '94% on-time record',
      price: 260,
      seatsLeft: 14,
      recommendedRank: 1,
      operatorType: 'government',
      moodMatch: 'Scenic route',
      boardingPoint: 'Karunamoyee',
      droppingPoint: 'Prantik / Jamboni',
      amenities: ['Seater', 'AC', 'Water', 'GPS'],
    },
  ],
  'durgapur->kolkata': [
    {
      id: 'sbstc-dk-1',
      routeKey: 'durgapur->kolkata',
      operatorId: 'sbstc',
      operator: 'SBSTC Durgapur Express',
      operatorGroupId: 'govt-wb',
      busType: 'Volvo AC Seater (2+2)',
      coachTypeId: 'ac-seater',
      coachTypeLabel: 'AC Seater',
      rating: 4.4,
      reviewsCount: 1580,
      departureTime: '06:45',
      originStation: 'City Centre Terminus',
      originDetails: 'SBSTC Platform 1',
      arrivalTime: '10:15',
      destinationStation: 'Esplanade Stand',
      destinationDetails: 'Kolkata Terminus',
      duration: '3h 30m',
      onTimeRate: 'NH-19 Direct',
      price: 240,
      seatsLeft: 15,
      recommendedRank: 1,
      operatorType: 'government',
      moodMatch: 'Fastest',
      boardingPoint: 'City Centre',
      droppingPoint: 'Esplanade / Dharmatala',
      amenities: ['Seater', 'AC', 'Charging', 'GPS'],
    },
  ],
  'malda->siliguri': [
    {
      id: 'nbstc-ms-1',
      routeKey: 'malda->siliguri',
      operatorId: 'nbstc',
      operator: 'NBSTC Gaur Express',
      operatorGroupId: 'govt-wb',
      busType: 'AC Semi-Sleeper (2+2)',
      coachTypeId: 'ac-seater',
      coachTypeLabel: 'AC Seater',
      rating: 4.3,
      reviewsCount: 730,
      departureTime: '08:00',
      originStation: 'Rathbari Terminus',
      originDetails: 'Platform 2',
      arrivalTime: '13:10',
      destinationStation: 'Siliguri Junction',
      destinationDetails: 'Main Bay',
      duration: '5h 10m',
      onTimeRate: 'Govt of West Bengal',
      price: 290,
      seatsLeft: 10,
      recommendedRank: 1,
      operatorType: 'government',
      moodMatch: 'Budget friendly',
      boardingPoint: 'Rathbari Terminus',
      droppingPoint: 'Siliguri Junction',
      amenities: ['Seater', 'AC', 'Water'],
    },
  ],
};

/** Small deterministic day-of-week fare variation so date strip reflects day-specific fares cleanly. */
function getDayAdjustment(dateIso: string): number {
  const [y, m, d] = dateIso.split('-').map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  // Peak Fri/Sun/Sat fares higher; mid-week Wed lower; Tue baseline matches canonical ₹749 fixture
  if (dow === 5 || dow === 0) return 40;
  if (dow === 6) return 20;
  if (dow === 3) return -30;
  return 0;
}

/** Synchronous deterministic departure lookup keyed by route and Asia/Kolkata service date. */
export function getDeparturesForRouteAndDate(
  origin: string,
  destination: string,
  dateIso: string
): BusTicket[] {
  if (!isWithinBookingWindow(dateIso) || isConfirmedEmptyDate(dateIso)) {
    return [];
  }
  const routeKey = makeRouteKey(origin, destination);
  const baseList = ROUTE_FIXTURES[routeKey];
  if (!baseList || baseList.length === 0) {
    return [];
  }

  const adj = getDayAdjustment(dateIso);
  return baseList.map((item) => {
    const adjustedPrice = Math.max(120, item.price + adj);
    return {
      ...item,
      id: `${item.id}::${dateIso}`,
      price: adjustedPrice,
      originalPrice: item.originalPrice ? item.originalPrice + adj : undefined,
      departureSlot: deriveDepartureSlot(item.departureTime),
    };
  });
}

/** Async-capable lookup preserving cancellation/stale-request protection hook for future backend API integration. */
export async function fetchDeparturesForSearch(
  params: { origin: string; destination: string; dateIso: string },
  signal?: AbortSignal
): Promise<BusTicket[]> {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }
  return Promise.resolve(
    getDeparturesForRouteAndDate(params.origin, params.destination, params.dateIso)
  );
}

/** Computes date strip summaries strictly from each day's matching departures. */
export function buildDateFareSummaries(
  origin: string,
  destination: string,
  dates: string[]
): DateFareSummary[] {
  return dates.map((dateIso) => {
    const departures = getDeparturesForRouteAndDate(origin, destination, dateIso);
    const bookable = departures.filter((d) => d.seatsLeft > 0);
    const lowestFare =
      bookable.length > 0 ? Math.min(...bookable.map((d) => d.price)) : null;

    const status: DateFareSummary['status'] =
      departures.length === 0 ? 'empty' : lowestFare === null ? 'unknown' : 'available';

    return {
      dateIso,
      topLabel: formatDateStripTile(dateIso),
      ariaLabel:
        status === 'empty'
          ? `${formatDateStripTile(dateIso)}, No buses`
          : lowestFare === null
          ? `${formatDateStripTile(dateIso)}, Fare unavailable`
          : `${formatDateStripTile(dateIso)}, starting from ₹${lowestFare.toLocaleString('en-IN')}`,
      lowestFare,
      status,
      departureCount: departures.length,
    };
  });
}

export const COACH_FILTER_OPTIONS: { id: CoachTypeId; label: string }[] = [
  { id: 'ac-sleeper', label: 'AC Sleeper' },
  { id: 'ac-seater', label: 'AC Seater' },
  { id: 'non-ac-sleeper', label: 'Non-AC Sleeper' },
  { id: 'non-ac-seater', label: 'Non-AC Seater' },
];

export const OPERATOR_GROUPS: {
  id: string;
  label: string;
  matchOperatorIds: string[];
  badge?: string;
}[] = [
  { id: 'shyamoli', label: 'Shyamoli Paribahan', matchOperatorIds: ['shyamoli'] },
  { id: 'greenline', label: 'Greenline Travels', matchOperatorIds: ['greenline'] },
  { id: 'royal-cruiser', label: 'Royal Cruiser Express', matchOperatorIds: ['royal-cruiser'] },
  { id: 'nbstc', label: 'NBSTC (Govt of WB)', matchOperatorIds: ['nbstc'], badge: 'State' },
  { id: 'sbstc-wbtc', label: 'SBSTC & WBTC', matchOperatorIds: ['sbstc', 'wbtc'], badge: 'State' },
];
