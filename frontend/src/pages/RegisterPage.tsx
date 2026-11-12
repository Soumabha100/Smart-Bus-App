import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../schemas/authSchema';
import { PillButton } from '../components/ui/PillButton';
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
    // Standalone mock registration before Phase 5 backend wiring
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
    <div className="min-h-screen bg-[#0C1321] text-[#DCE2F6] flex flex-col items-center justify-start relative selection:bg-[#44E2CD]/30 selection:text-[#44E2CD]">
      {/* Centered responsive shell */}
      <div className="w-full max-w-[480px] min-h-screen flex flex-col justify-between pb-8 relative z-10 bg-[#0C1321] shadow-2xl">
        {/* Header Bar */}
        <header className="w-full h-16 px-4 flex items-center justify-between border-b border-white/5 bg-[#0C1321]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={currentStep > 1 ? handlePrev : () => navigate('/')}
              aria-label="Go back"
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A59] shadow-[0_0_8px_#FF7A59]" />
              <span className="font-sora text-base font-semibold text-white tracking-tight">
                Roamly
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#19202E] border border-white/10 text-xs text-[#DFC0B8]">
            <span>Step {currentStep} of 3</span>
          </div>
        </header>

        <main className="flex-1 flex flex-col px-5 sm:px-6 pt-6 relative overflow-hidden">
          {/* Ambient Lighting */}
          <div className="absolute -top-12 -right-16 w-72 h-72 rounded-full bg-[#FF7A59]/10 blur-3xl pointer-events-none" />
          <div className="absolute top-44 -left-16 w-60 h-60 rounded-full bg-[#44E2CD]/10 blur-3xl pointer-events-none" />

          {/* 3-Step Indicator Dots */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
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

          {/* Step Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <span className="font-inter text-[11px] font-semibold tracking-widest text-[#FFB4A2] uppercase mb-1">
              Begin Your Travel Chronicle
            </span>
            <h1 className="font-sora text-2xl font-bold text-[#DCE2F6] tracking-tight">
              {currentStep === 1 && 'What should we call you?'}
              {currentStep === 2 && 'Where shall we send passes?'}
              {currentStep === 3 && 'Seal your travel diary'}
            </h1>
            <p className="font-inter text-xs text-[#DFC0B8] mt-1 max-w-[280px]">
              {currentStep === 1 && 'Your name will accompany every ticket, boarding pass, and journal note.'}
              {currentStep === 2 && 'Your email serves as your secure passport across all routes.'}
              {currentStep === 3 && 'Choose a strong passcode with letters and numbers.'}
            </p>
          </div>

          {/* Form Card */}
          <div className="w-full bg-[#19202E]/90 rounded-24 p-5 sm:p-6 shadow-2xl border border-white/10 flex flex-col gap-4 relative backdrop-blur-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {/* Step 1: Name Field */}
              {currentStep === 1 && (
                <div className="flex flex-col gap-2 transition-opacity duration-300">
                  <label htmlFor="reg-name" className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-[20px] text-[#FF7A59] pointer-events-none">
                      badge
                    </span>
                    <input
                      id="reg-name"
                      type="text"
                      {...register('name')}
                      autoFocus
                      placeholder="e.g. Rohan Sen"
                      className="w-full min-h-[50px] py-3 pl-11 pr-4 bg-[#151B2A] text-white rounded-2xl border border-white/10 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A59] focus:border-transparent transition-all placeholder:text-gray-500"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      <span>{errors.name.message}</span>
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1">
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
                    <span className="material-symbols-outlined absolute left-3.5 text-[20px] text-[#44E2CD] pointer-events-none">
                      mail
                    </span>
                    <input
                      id="reg-email"
                      type="email"
                      {...register('email')}
                      autoFocus
                      placeholder="rohan.wanderer@gmail.com"
                      className="w-full min-h-[50px] py-3 pl-11 pr-4 bg-[#151B2A] text-white rounded-2xl border border-white/10 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[#44E2CD] focus:border-transparent transition-all placeholder:text-gray-500"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-rose-400 font-medium flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      <span>{errors.email.message}</span>
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1">
                    We will send booking confirmations and offline route passcodes here.
                  </p>
                </div>
              )}

              {/* Step 3: Password Field */}
              {currentStep === 3 && (
                <div className="flex flex-col gap-2 transition-opacity duration-300">
                  <label htmlFor="reg-password" className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Passcode
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-[20px] text-gray-400 pointer-events-none">
                      lock
                    </span>
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      autoFocus
                      placeholder="At least 8 chars with letter & number"
                      className="w-full min-h-[50px] py-3 pl-11 pr-11 bg-[#151B2A] text-white rounded-2xl border border-white/10 font-inter text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-[#FF7A59] focus:border-transparent transition-all placeholder:text-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                      className="absolute right-3.5 p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
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
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-400">Passcode Strength</span>
                      <span className="text-gray-300 font-medium">{strength.label}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
                      <div className={`rounded-full h-full ${strength.score >= 1 ? strength.color : 'bg-white/10'}`} />
                      <div className={`rounded-full h-full ${strength.score >= 2 ? strength.color : 'bg-white/10'}`} />
                      <div className={`rounded-full h-full ${strength.score >= 3 ? strength.color : 'bg-white/10'}`} />
                      <div className={`rounded-full h-full ${strength.score >= 4 ? strength.color : 'bg-white/10'}`} />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Action Buttons */}
              <div className="flex items-center gap-3 mt-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="w-12 h-12 rounded-full bg-[#151B2A] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#232A39] transition-all"
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
                    icon={<span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
                  >
                    Continue
                  </PillButton>
                ) : (
                  <PillButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={isSubmitting}
                    icon={<span className="material-symbols-outlined text-[20px]">check_circle</span>}
                  >
                    {isSubmitting ? 'Securing Diary...' : 'Create my account'}
                  </PillButton>
                )}
              </div>
            </form>
          </div>

          {/* Already have an account link */}
          <div className="flex items-center justify-center gap-1.5 mt-6">
            <span className="font-inter text-xs text-gray-400">Already have a chronicle?</span>
            <Link
              to="/login"
              className="font-sora text-xs font-semibold text-[#44E2CD] hover:text-[#2DD4BF] transition-colors"
            >
              Sign in
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};
