import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassCard, Input, PillButton } from '../components/ui';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#FFF7ED] flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Step indicator dots */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-2 rounded-full bg-[#FF7A59]" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>

        <h1 className="font-sora text-2xl font-bold mb-1">Create your diary</h1>
        <p className="text-sm text-gray-400 mb-6">Step 1: What should we call you?</p>

        <GlassCard variant="dark" className="w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate('/home');
            }}
            className="flex flex-col gap-4"
          >
            <Input label="Full Name" placeholder="e.g. Rohan Sen" />
            <PillButton type="submit" variant="primary" fullWidth size="lg" className="mt-2">
              Next Step →
            </PillButton>
          </form>
        </GlassCard>

        <p className="mt-6 text-sm text-gray-400">
          Already registered?{' '}
          <Link to="/login" className="text-[#2DD4BF] font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
