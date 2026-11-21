import { useState, type FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../schemas/authSchema';
import { useAuth } from '../context/useAuth';
import { AuthLayout } from '../features/auth/AuthLayout';
import { AuthField } from '../features/auth/AuthField';
import { PasswordField } from '../features/auth/PasswordField';
import { AuthButton } from '../features/auth/AuthButton';
import { AuthSocialButtons } from '../features/auth/AuthSocialButtons';

export const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState('');
  const [isStudent, setIsStudent] = useState(false);

  const {
    register,
    handleSubmit,
    control,
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

  const passwordValue = useWatch({ control, name: 'password' }) || '';

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    const labels = [
      '',
      'Weak (needs 8+ chars & numbers)',
      'Fair (add uppercase or symbol)',
      'Good (strong password)',
      'Excellent (maximum security)',
    ];
    return { score, label: labels[score] };
  };

  const strength = getPasswordStrength(passwordValue);

  const onSubmit = (data: RegisterFormData) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';
      login({
        name: data.name,
        email: data.email,
        phone: phone ? (phone.startsWith('+91') ? phone : `+91 ${phone}`) : '+91 98301 24567',
        avatar: defaultAvatar,
        role: isStudent ? 'Student Explorer' : 'Verified Traveler',
        memberSince: 'November 2026',
        isStudent: isStudent,
        emergencyContactName: 'Family Contact',
        emergencyContactPhone: '+91 98300 11223',
        gender: 'Not Specified',
        seatPreference: 'lower_window',
        whatsappNotifications: true,
        smsNotifications: true,
      });
      navigate('/', { replace: true });
    }, 450);
  };

  return (
    <AuthLayout
      activeMode="register"
      title="Create account"
      subtitle="Join thousands of smart commuters in Bengal."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {/* Compact 2-Column Name & Phone for Balanced Height */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <AuthField
            id="reg-name"
            type="text"
            label="Full Name"
            placeholder="e.g. Rohan Sen"
            error={errors.name?.message}
            leadingIcon={<span className="material-symbols-outlined text-[18px]">badge</span>}
            {...register('name')}
          />

          <AuthField
            id="reg-phone"
            type="tel"
            label="Mobile Phone"
            placeholder="98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leadingIcon={<span className="material-symbols-outlined text-[18px]">phone_iphone</span>}
          />
        </div>

        {/* Email Address */}
        <AuthField
          id="reg-email"
          type="email"
          label="Email Address"
          placeholder="e.g. rohan.wanderer@gmail.com"
          error={errors.email?.message}
          leadingIcon={<span className="material-symbols-outlined text-[18px]">mail</span>}
          {...register('email')}
        />

        {/* Password with Strength Meter */}
        <PasswordField
          id="reg-password"
          label="Password"
          placeholder="At least 8 chars with letter & number"
          error={errors.password?.message}
          strength={strength}
          leadingIcon={<span className="material-symbols-outlined text-[18px]">lock</span>}
          {...register('password')}
        />

        {/* Student Privilege Concession Toggle */}
        <div className="bg-surface-2/70 px-3 py-2 rounded-xl border border-line/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-accent text-[18px]">school</span>
            <div>
              <div className="text-[11px] font-bold text-ink-strong">Student Privilege Pass</div>
              <p className="text-[10px] text-ink-muted">Unlock up to 25% student concession.</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isStudent}
              onChange={(e) => setIsStudent(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-8 h-4 bg-line peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-accent" />
          </label>
        </div>

        {/* Terms Checkbox */}
        <label className="flex items-start gap-2 text-xs text-ink-muted cursor-pointer select-none pt-0.5">
          <input
            type="checkbox"
            required
            defaultChecked
            className="mt-0.5 rounded border-line text-brand focus:ring-brand w-4 h-4 cursor-pointer"
          />
          <span className="text-[11px]">I agree to Terms &bull; DPDP 2025 compliant privacy</span>
        </label>

        {/* Submit Button */}
        <AuthButton type="submit" isLoading={isSubmitting} className="mt-1 shadow-md">
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </AuthButton>
      </form>

      {/* Social Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="w-full h-px bg-line/50" />
        <span className="absolute px-3 bg-surface/90 text-[10px] font-bold text-ink-muted uppercase tracking-wider rounded-md">
          Or register with
        </span>
      </div>

      <AuthSocialButtons />

      {/* Switcher Footer */}
      <div className="flex items-center justify-center gap-1.5 mt-5 pt-3 border-t border-line/40 text-xs">
        <span className="text-ink-muted">Already registered?</span>
        <Link
          to="/login"
          className="font-bold text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-0.5"
        >
          <span>Sign in here</span>
          <span className="material-symbols-outlined text-[14px]">east</span>
        </Link>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
