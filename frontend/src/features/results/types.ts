export type CoachTypeId = 'ac-sleeper' | 'ac-seater' | 'non-ac-sleeper' | 'non-ac-seater';

export type DepartureSlotId = 'morning' | 'afternoon' | 'evening' | 'night';

export type SortOption = 'best' | 'cheapest' | 'earliest' | 'fastest' | 'rating';

export type OperatorId =
  | 'shyamoli'
  | 'greenline'
  | 'royal-cruiser'
  | 'nbstc'
  | 'sbstc'
  | 'wbtc'
  | 'express-line';

export interface BusTicket {
  id: string;
  routeKey: string;
  operatorId: OperatorId;
  operator: string;
  operatorGroupId: 'govt-wb' | 'shyamoli' | 'greenline' | 'royal-cruiser' | 'regional';
  busType: string;
  coachTypeId: CoachTypeId;
  coachTypeLabel: string;
  rating?: number;
  reviewsCount?: number;
  departureTime: string; // HH:mm (24h service day)
  originStation: string;
  originDetails: string;
  arrivalTime: string; // HH:mm
  destinationStation: string;
  destinationDetails: string;
  duration: string;
  onTimeRate: string;
  originalPrice?: number;
  price: number;
  seatsLeft: number; // 0 indicates sold out
  recommendedRank: number;
  tag?: string;
  subtag?: string;
  operatorType: 'government' | 'private';
  moodMatch: 'Sleep well' | 'Fastest' | 'Budget friendly' | 'Scenic route';
  departureSlot: DepartureSlotId;
  boardingPoint: string;
  droppingPoint: string;
  amenities: string[];
  boardingInstructions?: string;
  advisory?: string;
}

export interface FilterState {
  mood: string;
  maxPrice: number;
  departureSlots: DepartureSlotId[];
  coachTypeIds: CoachTypeId[];
  boardingPoints: string[];
  droppingPoints: string[];
  amenities: string[];
  operatorIds: string[];
  sortBy: SortOption;
}

export interface DateFareSummary {
  dateIso: string;
  topLabel: string;
  ariaLabel: string;
  lowestFare: number | null;
  status: 'available' | 'empty' | 'unknown';
  departureCount: number;
}

export interface PriceBounds {
  min: number;
  max: number;
}
