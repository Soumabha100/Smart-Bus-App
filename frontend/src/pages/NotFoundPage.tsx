import React from 'react';
import { Link } from 'react-router-dom';
import { PillButton } from '../components/ui/PillButton';
import { GlassCard } from '../components/ui/GlassCard';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B1220] text-[#FFF7ED] flex items-center justify-center p-4">
      <GlassCard className="max-w-md w-full text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#FF7A59]/20 border border-[#FF7A59] flex items-center justify-center text-[#FF7A59] text-2xl font-bold font-sora">
          404
        </div>
        <h1 className="font-sora text-2xl font-bold text-white">Off the Map</h1>
        <p className="text-sm text-gray-400">
          This stop doesn't exist on our journey line. Let's head back to the main route.
        </p>
        <Link to="/" className="w-full mt-2">
          <PillButton variant="primary" fullWidth>
            Return to Onboarding
          </PillButton>
        </Link>
      </GlassCard>
    </div>
  );
};
