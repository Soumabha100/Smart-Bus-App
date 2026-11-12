import React from 'react';
import { Link } from 'react-router-dom';
import { PillButton, JourneyLine } from '../components/ui';

export const OnboardingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B1220] text-[#FFF7ED] flex flex-col justify-between p-6">
      <header className="flex justify-between items-center pt-2">
        <span className="font-sora font-semibold text-lg text-white">Roamly</span>
        <span className="text-xs px-3 py-1 rounded-full bg-teal-500/10 text-[#2DD4BF] border border-[#2DD4BF]/20">
          The Journey Line
        </span>
      </header>

      <main className="flex flex-col items-center my-auto py-8">
        <JourneyLine variant="hero" />
        <h1 className="font-sora text-3xl font-bold text-center mt-6 mb-2">
          Every journey has a story.
        </h1>
        <p className="text-sm text-gray-400 text-center max-w-xs">
          Find your ride. Feel the road. Handcrafted routes across mist-covered hills and coastal highways.
        </p>
      </main>

      <footer className="flex flex-col gap-3 pb-4">
        <Link to="/register" className="w-full">
          <PillButton variant="primary" fullWidth size="lg">
            Start my journey →
          </PillButton>
        </Link>
        <div className="text-center">
          <Link to="/login" className="text-xs text-gray-400 hover:text-white transition-colors">
            I already have an account
          </Link>
        </div>
      </footer>
    </div>
  );
};
