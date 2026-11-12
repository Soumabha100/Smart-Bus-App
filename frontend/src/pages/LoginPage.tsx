import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassCard, Input, PillButton, JourneyLine } from '../components/ui';
import { tokenStorage } from '../utils/tokenStorage';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleDemoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    tokenStorage.setToken('demo_token');
    tokenStorage.setUser({ name: 'Rohan Sen', email: 'rohan.wanderer@gmail.com' });
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] text-[#0B1220] flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full flex flex-col items-center">
        <JourneyLine variant="login" className="mb-4" />

        <h1 className="font-sora text-2xl font-bold mb-1">Good to see you again</h1>
        <p className="text-sm text-gray-600 mb-6">Pick up right where your travel diary left off</p>

        <GlassCard variant="light" className="w-full">
          <form onSubmit={handleDemoLogin} className="flex flex-col gap-4">
            <Input
              variant="light"
              label="Email"
              placeholder="wanderer@roamly.journal"
              defaultValue="rohan.wanderer@gmail.com"
            />
            <Input
              variant="light"
              label="Password"
              type="password"
              placeholder="••••••••"
              defaultValue="wanderer123"
            />
            <PillButton type="submit" variant="dark" fullWidth size="lg" className="mt-2">
              Continue →
            </PillButton>
          </form>
        </GlassCard>

        <p className="mt-6 text-sm text-gray-600">
          New here?{' '}
          <Link to="/register" className="text-[#FF7A59] font-medium hover:underline">
            Join us
          </Link>
        </p>
      </div>
    </div>
  );
};
