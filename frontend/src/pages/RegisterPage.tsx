import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navbar } from '../components/layout/Navbar';
import { registerSchema, type RegisterFormData } from '../schemas/authSchema';
import { PillButton } from '../components/ui/PillButton';
import { GlassCard } from '../components/ui/GlassCard';
import { tokenStorage } from '../utils/tokenStorage';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const passwordValue = watch('password') || '';

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-white/10' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak (needs 8+ chars, letter & number)', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: 'Fair (add uppercase or symbol)', color: 'bg-amber-400' };
    if (score === 3) return { score: 3, label: 'Good (strong passcode)', color: 'bg-[#44E2CD]' };
    return { score: 4, label: 'Excellent travel vault security', color: 'bg-[#2DD4BF]' };
  };

  const strength = getPasswordStrength(passwordValue);

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await trigger('name');
      if (isValid) setCurrentStep(2);
    } else if (currentStep === 2) {
      const isValid = await trigger('email');
      if (isValid) setCurrentStep(3);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const onSubmit = (data: RegisterFormData) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      tokenStorage.setToken('roamly_jwt_token_sample');
      tokenStorage.setUser({
        name: data.name,
        email: data.email,
      });
      navigate('/home');
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#0C1321] text-[#DCE2F6] flex flex-col selection:bg-[#44E2CD]/30 selection:text-[#44E2CD]">
      {/* Desktop Navigation */}
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 flex items-center justify-center">
        {/* Desktop 2-Column Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Progressive Milestones & Story (5-6 Cols on Desktop) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex items-center gap-2 mb-3 px-3.5 py-1.5 rounded-full bg-[#19202E]/80 border border-white/10 text-xs text-[#FFB4A2]">
              <span className="w-2 h-2 rounded-full bg-[#FF7A59]" />
              <span className="font-inter uppercase tracking-widest font-semibold text-[10px]">
                Traveler Registration
              </span>
            </div>

            <h1 className="font-sora text-3xl sm:text-4xl font-bold text-[#DCE2F6] tracking-tight mb-3">
              Begin your travel chronicle
            </h1>
            <p className="font-inter text-sm sm:text-base text-[#DFC0B8] mb-8 max-w-md">
              Create your Roamly passport in 3 quick steps to save your preferred window berths, access offline conductor passes, and stage seat holds.
            </p>

            {/* Stepper milestones list on desktop */}
            <div className="w-full max-w-md flex flex-col gap-4 mb-8">
              {[
                {
                  step: 1,
                  title: 'Traveler Identity',
                  desc: 'Your real name for conductor check-ins and state transit manifests.',
                  icon: 'badge',
                },
                {
                  step: 2,
                  title: 'Electronic Route Pass',
                  desc: 'Where live booking confirmations & SMS alerts are dispatched.',
                  icon: 'mail',
                },
                {
                  step: 3,
                  title: 'Traveler Vault Passcode',
                  desc: 'Cryptographic passcode to seal and protect your diary entries.',
                  icon: 'lock',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 text-left ${
                    currentStep === item.step
                      ? 'bg-[#19202E] border-[#FF7A59]/50 shadow-[0_0_20px_rgba(255,122,89,0.15)]'
                      : currentStep > item.step
                      ? 'bg-[#151B2A]/60 border-[#2DD4BF]/30'
                      : 'bg-[#151B2A]/30 border-white/5 opacity-60'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold ${
                      currentStep === item.step
                        ? 'bg-[#FF7A59] text-white shadow-md'
                        : currentStep > item.step
                        ? 'bg-[#2DD4BF] text-[#0B1220]'
                        : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {currentStep > item.step ? '✓' : item.step}
                  </div>
                  <div>
                    <h2 className="font-sora text-sm font-semibold text-white">
                      {item.title}
                    </h2>
                    <p className="text-xs text-[#DFC0B8] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footnote */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="material-symbols-outlined text-[#2DD4BF] text-[18px]">verified</span>
              <span>Fully compliant with DPDP 2025 passenger privacy guidelines</span>
            </div>
          </div>

          {/* Right Column: Progressive Form Card (6-7 Cols on Desktop) */}
          <div className="lg:col-span-7 flex justify-center">
            <GlassCard className="w-full max-w-lg p-6 sm:p-8 lg:p-10 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              {/* Step indicator dots */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentStep === 1
                        ? 'w-8 bg-[#FF7A59] shadow-[0_0_8px_#FF7A59]'
                        : 'w-2 bg-[#44E2CD]'
                    }`}
                  />
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentStep === 2
                        ? 'w-8 bg-[#FF7A59] shadow-[0_0_8px_#FF7A59]'
                        : currentStep > 2
                        ? 'w-2 bg-[#44E2CD]'
                        : 'w-2 bg-white/20'
                    }`}
                  />
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentStep === 3
                        ? 'w-8 bg-[#FF7A59] shadow-[0_0_8px_#FF7A59]'
                        : 'w-2 bg-white/20'
                    }`}
                  />
                </div>

                <span className="font-inter text-xs text-gray-400">
                  Step {currentStep} of 3
                </span>
              </div>

              {/* Form Component */}
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                {/* Step 1: Name Field */}
                {currentStep === 1 && (
                  <div className="flex flex-col gap-2 transition-opacity duration-300">
                    <label htmlFor="reg-name" className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Full Legal Name
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-[20px] text-[#FF7A59] pointer-events-none">
                        badge
                      </span>
                      <input
                        id="reg-name"
                        type="text"
                        {...register('name')}
                        autoFocus
                        placeholder="e.g. Rohan Sen"
                        className="w-full min-h-[50px] py-3 pl-12 pr-4 bg-[#151B2A] text-white rounded-2xl border border-white/10 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A59] focus:border-transparent transition-all placeholder:text-gray-500"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        <span>{errors.name.message}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Minimum 2 characters. Real names ensure seamless conductor check-ins.
                    </p>
                  </div>
                )}

                {/* Step 2: Email Field */}
                {currentStep === 2 && (
                  <div className="flex flex-col gap-2 transition-opacity duration-300">
                    <label htmlFor="reg-email" className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-[20px] text-[#44E2CD] pointer-events-none">
                        mail
                      </span>
                      <input
                        id="reg-email"
                        type="email"
                        {...register('email')}
                        autoFocus
                        placeholder="rohan.wanderer@gmail.com"
                        className="w-full min-h-[50px] py-3 pl-12 pr-4 bg-[#151B2A] text-white rounded-2xl border border-white/10 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[#44E2CD] focus:border-transparent transition-all placeholder:text-gray-500"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        <span>{errors.email.message}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      We will dispatch booking confirmations and offline route passcodes here.
                    </p>
                  </div>
                )}

                {/* Step 3: Password Field */}
                {currentStep === 3 && (
                  <div className="flex flex-col gap-2 transition-opacity duration-300">
                    <label htmlFor="reg-password" className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                      Vault Passcode
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-[20px] text-gray-400 pointer-events-none">
                        lock
                      </span>
                      <input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        autoFocus
                        placeholder="At least 8 chars with letter & number"
                        className="w-full min-h-[50px] py-3 pl-12 pr-12 bg-[#151B2A] text-white rounded-2xl border border-white/10 font-inter text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-[#FF7A59] focus:border-transparent transition-all placeholder:text-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                        className="absolute right-3.5 p-1 text-gray-400 hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>

                    {errors.password && (
                      <p className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        <span>{errors.password.message}</span>
                      </p>
                    )}

                    {/* Password Strength Meter */}
                    <div className="flex flex-col gap-1.5 mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Passcode Strength</span>
                        <span className="text-gray-300 font-medium">{strength.label}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 h-1.5 w-full">
                        <div className={`rounded-full h-full ${strength.score >= 1 ? strength.color : 'bg-white/10'}`} />
                        <div className={`rounded-full h-full ${strength.score >= 2 ? strength.color : 'bg-white/10'}`} />
                        <div className={`rounded-full h-full ${strength.score >= 3 ? strength.color : 'bg-white/10'}`} />
                        <div className={`rounded-full h-full ${strength.score >= 4 ? strength.color : 'bg-white/10'}`} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Action Controls */}
                <div className="flex items-center gap-3 mt-6">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="w-12 h-12 rounded-full bg-[#151B2A] border border-white/15 flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#232A39] transition-all"
                      aria-label="Previous step"
                    >
                      <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </button>
                  )}

                  {currentStep < 3 ? (
                    <PillButton
                      type="button"
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={handleNext}
                      className="h-[52px]"
                      icon={<span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
                    >
                      Continue to Next Step
                    </PillButton>
                  ) : (
                    <PillButton
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={isSubmitting}
                      className="h-[52px] shadow-[0_8px_24px_rgba(255,122,89,0.45)]"
                      icon={<span className="material-symbols-outlined text-[20px]">check_circle</span>}
                    >
                      {isSubmitting ? 'Securing Diary...' : 'Create my account'}
                    </PillButton>
                  )}
                </div>
              </form>

              {/* Already have an account link */}
              <div className="flex items-center justify-center gap-1.5 mt-8 pt-4 border-t border-white/10">
                <span className="font-inter text-xs text-gray-400">Already registered?</span>
                <Link
                  to="/login"
                  className="font-sora text-xs font-semibold text-[#44E2CD] hover:text-[#2DD4BF] transition-colors"
                >
                  Sign in here
                </Link>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
};
