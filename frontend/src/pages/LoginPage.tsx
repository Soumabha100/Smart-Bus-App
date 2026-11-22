import { useState, type FC, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { tokenStorage } from '../utils/tokenStorage';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/useAuth';
import { AuthLayout } from '../features/auth/AuthLayout';
import { AuthField } from '../features/auth/AuthField';
import { PasswordField } from '../features/auth/PasswordField';
import { AuthButton } from '../features/auth/AuthButton';
import { AuthSocialButtons } from '../features/auth/AuthSocialButtons';

export const LoginPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();
  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('rohan.wanderer@gmail.com');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('journey2024');
  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (authMode === 'email') {
      if (!email.trim() || !password) {
        setErrorMessage('Please enter your registered email and password.');
        setShowErrorBanner(true);
        return;
      }

      setIsLoading(true);
      setShowErrorBanner(false);

      try {
        const authResponse = await loginUser({
          email: email.trim(),
          password,
        });

        const user = authResponse.user;
        const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';
        const fullName = `${user.firstName} ${user.lastName}`.trim();

        tokenStorage.setToken(authResponse.accessToken);
        tokenStorage.setUser({
          id: user.id,
          name: fullName || 'Verified Commuter',
          email: user.email,
          phone: user.phone || '+91 98301 24567',
          avatar: defaultAvatar,
          role: user.role === 'ADMIN' ? 'Administrator' : 'Verified Traveler',
          memberSince: 'November 2026',
          isStudent: false,
          emergencyContactName: 'Priya Sen (Sister)',
          emergencyContactPhone: '+91 98309 87654',
          gender: 'Male',
          seatPreference: 'lower_window',
          whatsappNotifications: true,
          smsNotifications: true,
        });

        const destination = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
        login({
          id: user.id,
          name: fullName || 'Verified Commuter',
          email: user.email,
          phone: user.phone || '+91 98301 24567',
          avatar: defaultAvatar,
          role: user.role === 'ADMIN' ? 'Administrator' : 'Verified Traveler',
          memberSince: 'November 2026',
          isStudent: false,
          emergencyContactName: 'Priya Sen (Sister)',
          emergencyContactPhone: '+91 98309 87654',
          gender: 'Male',
          seatPreference: 'lower_window',
          whatsappNotifications: true,
          smsNotifications: true,
        }, authResponse.accessToken);

        navigate(destination, { replace: true });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Invalid email or password';
        setErrorMessage(message);
        setShowErrorBanner(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Phone OTP mode fallback placeholder
      if (!phone.trim()) {
        setErrorMessage('Please enter your 10-digit mobile number.');
        setShowErrorBanner(true);
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';
        const destination = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
        login({
          name: 'Rohan Sen',
          email: `${phone.replace(/\s+/g, '')}@phone.onego`,
          phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
          avatar: defaultAvatar,
          role: 'Verified Traveler',
          memberSince: 'November 2026',
          isStudent: false,
          emergencyContactName: 'Priya Sen (Sister)',
          emergencyContactPhone: '+91 98309 87654',
          gender: 'Male',
          seatPreference: 'lower_window',
          whatsappNotifications: true,
          smsNotifications: true,
        }, 'onego_phone_demo_token');

        navigate(destination, { replace: true });
      }, 400);
    }
  };

  return (
    <AuthLayout
      activeMode="login"
      title="Welcome back"
      subtitle="Sign in to plan your next journey."
    >
      {/* Auth Method Tabs (Matching Sample Image) */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        <button
          type="button"
          onClick={() => setAuthMode('email')}
          className={`min-h-[42px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${authMode === 'email'
            ? 'bg-brand text-on-brand border-brand shadow-sm'
            : 'bg-surface-2/60 border-line/50 text-ink-muted hover:text-ink-strong'
            }`}
        >
          <span className="material-symbols-outlined text-[16px]">mail</span>
          <span>Email &amp; Password</span>
        </button>

        <button
          type="button"
          onClick={() => setAuthMode('phone')}
          className={`min-h-[42px] py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${authMode === 'phone'
            ? 'bg-brand text-on-brand border-brand shadow-sm'
            : 'bg-surface-2/60 border-line/50 text-ink-muted hover:text-ink-strong'
            }`}
        >
          <span className="material-symbols-outlined text-[16px]">smartphone</span>
          <span>Phone OTP</span>
        </button>
      </div>

      {/* Error Alert */}
      {showErrorBanner && (
        <div className="w-full bg-danger-tint/90 border border-danger/40 text-on-danger-tint rounded-xl p-3 mb-4 flex items-start gap-2.5" role="alert">
          <span className="material-symbols-outlined text-[18px] text-danger shrink-0 mt-0.5">error</span>
          <div className="flex-1 text-xs">
            <span className="font-bold">Authentication error:</span>
            <p className="mt-0.5 opacity-90">{errorMessage || 'Please enter your registered email and password.'}</p>
          </div>
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {authMode === 'email' ? (
          <>
            <AuthField
              id="login-email"
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setShowErrorBanner(false);
              }}
              placeholder="e.g. rohan.wanderer@gmail.com"
              required
              leadingIcon={<span className="material-symbols-outlined text-[18px]">mail</span>}
            />

            <PasswordField
              id="login-password"
              label="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setShowErrorBanner(false);
              }}
              placeholder="••••••••"
              required
              leadingIcon={<span className="material-symbols-outlined text-[18px]">lock</span>}
            />
          </>
        ) : (
          <AuthField
            id="login-phone"
            type="tel"
            label="Mobile Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="98765 43210"
            hint="We will dispatch a one-time SMS passcode to verify."
            leadingIcon={<span className="material-symbols-outlined text-[18px]">phone_iphone</span>}
          />
        )}

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-1 pb-0.5">
          <label className="flex items-center gap-2 cursor-pointer text-ink-strong select-none font-medium">
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-line text-brand focus:ring-brand w-4 h-4 cursor-pointer"
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            onClick={() => alert('Password recovery link has been sent to your registered email.')}
            className="font-bold text-accent hover:text-accent-hover transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Primary CTA */}
        <AuthButton type="submit" isLoading={isLoading} className="mt-1 shadow-md">
          {isLoading ? 'Verifying Passport...' : 'Sign In'}
        </AuthButton>
      </form>

      {/* Social Divider */}
      <div className="relative flex items-center justify-center my-5">
        <div className="w-full h-px bg-line/50" />
        <span className="absolute px-3 bg-surface/90 text-[10px] font-bold text-ink-muted uppercase tracking-wider rounded-md">
          Or continue with
        </span>
      </div>

      <AuthSocialButtons />

      {/* Card Switcher Footer */}
      <div className="flex items-center justify-center gap-1.5 mt-6 pt-3.5 border-t border-line/40 text-xs">
        <span className="text-ink-muted">New to One Go Bus?</span>
        <Link
          to="/register"
          className="font-bold text-accent hover:text-accent-hover transition-colors inline-flex items-center gap-0.5"
        >
          <span>Create an account</span>
          <span className="material-symbols-outlined text-[14px]">east</span>
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
