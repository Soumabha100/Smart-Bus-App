import { useState, type FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../schemas/authSchema';
import { registerUser } from '../api/authApi';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';
import { AuthLayout } from '../features/auth/AuthLayout';
import { AuthField } from '../features/auth/AuthField';
import { PasswordField } from '../features/auth/PasswordField';
import { AuthButton } from '../features/auth/AuthButton';
import { AuthSocialButtons } from '../features/auth/AuthSocialButtons';

export const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState('');
  const [isStudent, setIsStudent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

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

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    // Split Full Name into First Name & Last Name for backend API
    const trimmedName = data.name.trim();
    const spaceIndex = trimmedName.indexOf(' ');
    const firstName = spaceIndex !== -1 ? trimmedName.substring(0, spaceIndex) : trimmedName;
    const lastName = spaceIndex !== -1 ? trimmedName.substring(spaceIndex + 1).trim() : 'User';

    // Normalize phone number (backend expects 10-15 digits)
    const cleanedDigits = phone.replace(/\D/g, '');
    if (cleanedDigits.length < 10) {
      const errorMsg = 'Please enter a valid 10-digit mobile number.';
      setServerError(errorMsg);
      toast.warning(errorMsg);
      setIsSubmitting(false);
      return;
    }
    const normalizedPhone = cleanedDigits;

    try {
      const authResponse = await registerUser({
        firstName,
        lastName,
        email: data.email.trim(),
        phone: normalizedPhone,
        password: data.password,
      });

      const user = authResponse.user;
      const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';
      const fullName = `${user.firstName} ${user.lastName}`.trim();

      const userData = {
        id: user.id,
        name: fullName || data.name,
        email: user.email,
        phone: user.phone || normalizedPhone,
        avatar: defaultAvatar,
        role: isStudent ? 'Student Explorer' : 'Verified Traveler',
        memberSince: 'November 2026',
        isStudent: isStudent,
        emergencyContactName: 'Family Contact',
        emergencyContactPhone: '',
        gender: 'Not Specified',
        seatPreference: 'lower_window' as const,
        whatsappNotifications: true,
        smsNotifications: true,
      };

      // Call login from useAuth to update both React state and localStorage
      login(userData, authResponse.accessToken);
      toast.success('User registered successfully');

      navigate('/', { replace: true });
    } catch (err: unknown) {
      const errWithDetails = err as Error & { details?: { validationErrors?: Record<string, string> } };
      let errorMsg = 'Registration failed. Please try again.';
      if (errWithDetails.details?.validationErrors) {
        const firstField = Object.keys(errWithDetails.details.validationErrors)[0];
        errorMsg = `${firstField}: ${errWithDetails.details.validationErrors[firstField]}`;
      } else if (errWithDetails.message) {
        errorMsg = errWithDetails.message;
      }
      setServerError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      activeMode="register"
      title="Create account"
      subtitle="Join thousands of smart commuters in Bengal."
    >
      {/* Server Error Alert */}
      {serverError && (
        <div className="w-full bg-danger-tint/90 border border-danger/40 text-on-danger-tint rounded-xl p-3 mb-3 flex items-start gap-2.5" role="alert">
          <span className="material-symbols-outlined text-[18px] text-danger shrink-0 mt-0.5">error</span>
          <div className="flex-1 text-xs">
            <span className="font-bold">Registration failed:</span>
            <p className="mt-0.5 opacity-90">{serverError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {/* Compact 2-Column Name & Phone for Balanced Height */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <AuthField
            id="reg-name"
            type="text"
            label="Full Name"
            autoComplete="name"
            required
            error={errors.name?.message}
            leadingIcon={<span className="material-symbols-outlined text-[18px]">badge</span>}
            {...register('name')}
          />

          <AuthField
            id="reg-phone"
            type="tel"
            label="Mobile Phone"
            autoComplete="tel"
            maxLength={10}
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            leadingIcon={<span className="material-symbols-outlined text-[18px]">phone_iphone</span>}
          />
        </div>

        {/* Email Address */}
        <AuthField
          id="reg-email"
          type="email"
          label="Email Address"
          autoComplete="email"
          required
          error={errors.email?.message}
          leadingIcon={<span className="material-symbols-outlined text-[18px]">mail</span>}
          {...register('email')}
        />

        {/* Password with Strength Meter */}
        <PasswordField
          id="reg-password"
          label="Password"
          autoComplete="new-password"
          required
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
          <span className="text-[11px]">I agree to Terms of Service &bull; Privacy Policy</span>
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
