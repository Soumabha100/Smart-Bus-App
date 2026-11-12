import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PerforatedTicket, type BusTicketData } from '../components/ui';

const MOCK_RESULTS: BusTicketData[] = [
  {
    id: 'bus-1',
    operator: 'NBSTC Twilight Classic',
    busType: 'AC Sleeper (2+1)',
    rating: 4.8,
    departureTime: '20:30',
    arrivalTime: '07:45',
    duration: '11h 15m',
    originStation: 'Esplanade, KOL',
    destinationStation: 'Mall Road, DAR',
    price: 1150,
    seatsLeft: 6,
    comfortTags: ['Charging', 'Blanket', 'Water'],
    isBestForYou: true,
    bestForReason: 'Sleep well pick',
  },
  {
    id: 'bus-2',
    operator: 'Greenline Royal Volvo',
    busType: 'Multi-Axle Semi-Sleeper',
    rating: 4.6,
    departureTime: '21:15',
    arrivalTime: '08:30',
    duration: '11h 15m',
    originStation: 'Karunamoyee, KOL',
    destinationStation: 'Siliguri Junction',
    price: 1350,
    seatsLeft: 12,
    comfortTags: ['WiFi', 'Live Track', 'Snacks'],
  },
];

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#FFF7ED] p-4 pb-12">
      <div className="max-w-md mx-auto w-full pt-2">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="w-10 h-10 rounded-full bg-[#19202E] border border-white/10 flex items-center justify-center text-white hover:bg-[#232A39] transition-colors"
            >
              ←
            </button>
            <div>
              <h1 className="font-sora text-base font-bold text-white">
                Kolkata → Darjeeling
              </h1>
              <p className="text-xs text-gray-400">14 Nov • 2 rides found</p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF] text-[#2DD4BF] text-xs font-medium">
            Sleep well
          </div>
        </header>

        <div className="flex flex-col gap-4">
          {MOCK_RESULTS.map((ticket) => (
            <PerforatedTicket
              key={ticket.id}
              ticket={ticket}
              onSelect={(t) => alert(`Selected seat on ${t.operator} (₹${t.price})`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
