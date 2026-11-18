export interface BusTicket {
  id: string;
  operator: string;
  busType: string;
  rating: number;
  reviewsCount: number;
  departureTime: string;
  originStation: string;
  originDetails: string;
  arrivalTime: string;
  destinationStation: string;
  destinationDetails: string;
  duration: string;
  onTimeRate: string;
  originalPrice?: number;
  price: number;
  seatsLeft: number;
  tag?: string;
  subtag?: string;
  operatorType: 'government' | 'private';
  moodMatch: 'Sleep well' | 'Fastest' | 'Budget friendly' | 'Scenic route';
  departureSlot: 'early' | 'morning' | 'afternoon' | 'night';
  boardingPoint: string;
  droppingPoint: string;
  amenities: string[];
}

export interface FilterState {
  mood: string;
  maxPrice: number;
  departureSlots: string[];
  busTypes: string[];
  boardingPoints: string[];
  droppingPoints: string[];
  amenities: string[];
  operators: string[];
  sortBy: 'best' | 'cheapest' | 'earliest' | 'fastest' | 'rating';
}
