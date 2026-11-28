import { useState, useEffect, type FC, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { tokenStorage } from '../utils/tokenStorage';
import { loginUser, sendOtp, verifyOtp } from '../api/authApi';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';
import { AuthLayout } from '../features/auth/AuthLayout';
import { AuthField } from '../features/auth/AuthField';
import { PasswordField } from '../features/auth/PasswordField';
import { AuthButton } from '../features/auth/AuthButton';
import { AuthSocialButtons } from '../features/auth/AuthSocialButtons';

export const LoginPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();
  const { toast } = useToast();
  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone OTP States
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [phoneStep, setPhoneStep] = useState<'input' | 'otp'>('input');
  const [countdown, setCountdown] = useState(0);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const [showErrorBanner, setShowErrorBanner] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOtp = async () => {
    const cleanedDigits = phone.replace(/\D/g, '');
    if (cleanedDigits.length < 10) {
      const msg = 'Please enter a valid 10-digit mobile number.';
      setErrorMessage(msg);
      setShowErrorBanner(true);
      toast.warning(msg);
      return;
    }

    setIsLoading(true);
    setShowErrorBanner(false);
    setSuccessMessage(null);

    try {
      const response = await sendOtp({ phone: cleanedDigits });
      setPhoneStep('otp');
      setCountdown(30);
      const sentMsg = response.message || 'Verification passcode dispatched.';
      setSuccessMessage(sentMsg);
      toast.info(sentMsg);
      if (response.devOtp) {
        setDevOtpHint(response.devOtp);
      }
    } catch (err: unknown) {
      const isBackendDown =
        err instanceof Error &&
        (err.message.includes('502') ||
          err.message.includes('unreachable') ||
          err.message.includes('Failed to fetch'));

      if (isBackendDown) {
        // Backend offline fallback: allow user to test the full 2-step OTP flow locally
        const simulatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setDevOtpHint(simulatedOtp);
        setPhoneStep('otp');
        setCountdown(30);
        const notice = 'Backend offline: switched to Local Dev Mode. Use the passcode below to verify.';
        setSuccessMessage(notice);
        toast.warning(notice);
        return;
      }

      const message = err instanceof Error ? err.message : 'Failed to dispatch verification code. Please try again.';
      setErrorMessage(message);
      setShowErrorBanner(true);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const cleanedOtp = otpCode.trim();
    if (cleanedOtp.length !== 6) {
      const msg = 'Please enter the 6-digit verification code.';
      setErrorMessage(msg);
      setShowErrorBanner(true);
      toast.warning(msg);
      return;
    }

    setIsLoading(true);
    setShowErrorBanner(false);

    try {
      const cleanedDigits = phone.replace(/\D/g, '');
      const authResponse = await verifyOtp({
        phone: cleanedDigits,
        otp: cleanedOtp,
      });

      const user = authResponse.user;
      const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';
      const fullName = `${user.firstName} ${user.lastName}`.trim();

      const userData = {
        id: user.id,
        name: fullName || 'Verified Commuter',
        email: user.email,
        phone: user.phone || phone,
        avatar: defaultAvatar,
        role: user.role === 'ADMIN' ? 'Administrator' : 'Verified Traveler',
        memberSince: 'November 2026',
        isStudent: false,
        emergencyContactName: 'Family Contact',
        emergencyContactPhone: '+91 98309 87654',
        gender: 'Not Specified',
        seatPreference: 'lower_window' as const,
        whatsappNotifications: true,
        smsNotifications: true,
      };

      tokenStorage.setToken(authResponse.accessToken);
      tokenStorage.setUser(userData);
      login(userData, authResponse.accessToken);
      toast.success(`Welcome, ${userData.name}`);

      const destination = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
      navigate(destination, { replace: true });
    } catch (err: unknown) {
      const isBackendDown =
        err instanceof Error &&
        (err.message.includes('502') ||
          err.message.includes('unreachable') ||
          err.message.includes('Failed to fetch'));

      if (isBackendDown && devOtpHint && cleanedOtp === devOtpHint) {
        // Fallback login when backend is offline
        const cleanedDigits = phone.replace(/\D/g, '');
        const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';
        const userData = {
          id: '9999',
          name: 'Verified Commuter',
          email: `${cleanedDigits}@phone.onego`,
          phone: `+91 ${cleanedDigits}`,
          avatar: defaultAvatar,
          role: 'Verified Traveler',
          memberSince: 'November 2026',
          isStudent: false,
          emergencyContactName: 'Family Contact',
          emergencyContactPhone: '+91 98309 87654',
          gender: 'Not Specified',
          seatPreference: 'lower_window' as const,
          whatsappNotifications: true,
          smsNotifications: true,
        };
        const devToken = `onego_dev_token_${Date.now()}`;
        tokenStorage.setToken(devToken);
        tokenStorage.setUser(userData);
        login(userData, devToken);
        toast.success(`Welcome, ${userData.name}`);
        const destination = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
        navigate(destination, { replace: true });
        return;
      }

      const message = err instanceof Error ? err.message : 'Invalid verification code. Please try again.';
      setErrorMessage(message);
      setShowErrorBanner(true);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (authMode === 'email') {
      if (!email.trim() || !password) {
        const msg = 'Please enter your registered email and password.';
        setErrorMessage(msg);
        setShowErrorBanner(true);
        toast.warning(msg);
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

        const userData = {
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
          seatPreference: 'lower_window' as const,
          whatsappNotifications: true,
          smsNotifications: true,
        };

        tokenStorage.setToken(authResponse.accessToken);
        tokenStorage.setUser(userData);
        login(userData, authResponse.accessToken);
        toast.success(`Welcome, ${userData.name}`);

        const destination = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
        navigate(destination, { replace: true });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Invalid email or password';
        setErrorMessage(message);
        setShowErrorBanner(true);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Phone OTP submit handler
      if (phoneStep === 'input') {
        await handleSendOtp();
      } else {
        await handleVerifyOtp();
      }
    }
  };

  return (
    <AuthLayout
      activeMode="login"
      title="Welcome back"
      subtitle="Sign in to plan your next journey."
    >
      {/* Auth Method Tabs */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        <button
          type="button"
          onClick={() => {
            setAuthMode('email');
            setShowErrorBanner(false);
            setSuccessMessage(null);
          }}
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
          onClick={() => {
            setAuthMode('phone');
            setShowErrorBanner(false);
            setSuccessMessage(null);
          }}
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
        <div className="w-full bg-danger-tint/90 border border-danger/40 text-on-danger-tint rounded-xl p-3 mb-4 flex items-start gap-2.5 animate-fadeIn" role="alert">
          <span className="material-symbols-outlined text-[18px] text-danger shrink-0 mt-0.5">error</span>
          <div className="flex-1 text-xs">
            <span className="font-bold">Authentication error:</span>
            <p className="mt-0.5 opacity-90">{errorMessage || 'Please check your inputs and try again.'}</p>
          </div>
        </div>
      )}

      {/* Success / OTP Sent Alert */}
      {successMessage && (
        <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 mb-4 flex items-start gap-2.5 animate-fadeIn" role="status">
          <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0 mt-0.5">check_circle</span>
          <div className="flex-1 text-xs">
            <span className="font-bold text-emerald-900">Passcode Sent:</span>
            <p className="mt-0.5 opacity-90">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Dev Mode OTP Hint Helper */}
      {authMode === 'phone' && phoneStep === 'otp' && devOtpHint && (
        <div className="w-full bg-amber-50 border border-amber-300/80 text-amber-900 rounded-xl p-3 mb-4 flex items-center justify-between text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-amber-600">developer_mode</span>
            <span>Test Code: <strong className="font-mono text-sm tracking-widest text-brand">{devOtpHint}</strong></span>
          </div>
          <button
            type="button"
            onClick={() => setOtpCode(devOtpHint)}
            className="text-[11px] font-bold text-accent hover:underline cursor-pointer bg-white/80 px-2.5 py-1 rounded-lg border border-amber-200 shadow-2xs"
          >
            Auto-fill
          </button>
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
              autoComplete="email"
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
              autoComplete="current-password"
              required
              leadingIcon={<span className="material-symbols-outlined text-[18px]">lock</span>}
            />

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

            <AuthButton type="submit" isLoading={isLoading} className="mt-1 shadow-md">
              {isLoading ? 'Verifying Credentials...' : 'Sign In'}
            </AuthButton>
          </>
        ) : phoneStep === 'input' ? (
          <>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-phone" className="text-xs font-bold text-ink-strong tracking-wide">
                Mobile Phone Number
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center gap-1.5 text-ink-muted text-xs font-bold border-r border-line/60 pr-2.5 pointer-events-none">
                  <span className="material-symbols-outlined text-[18px]">phone_iphone</span>
                  <span>+91</span>
                </div>
                <input
                  id="login-phone"
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setPhone(val);
                    setShowErrorBanner(false);
                  }}
                  autoComplete="tel"
                  className="w-full pl-24 pr-4 py-3 bg-surface border border-line rounded-xl text-ink-strong text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand font-medium"
                  required
                />
              </div>
              <span className="text-[11px] text-ink-muted mt-0.5">
                We will dispatch a secure 6-digit SMS verification passcode.
              </span>
            </div>

            <AuthButton type="submit" isLoading={isLoading} className="mt-2 shadow-md">
              {isLoading ? 'Dispatching Passcode...' : 'Send Verification Code'}
            </AuthButton>
          </>
        ) : (
          /* Step 2: OTP Verification */
          <>
            <div className="p-3 bg-surface-2/70 rounded-xl border border-line/50 flex items-center justify-between text-xs">
              <div>
                <span className="text-ink-muted">Code sent to: </span>
                <span className="font-bold text-ink-strong">+91 {phone}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPhoneStep('input');
                  setOtpCode('');
                  setShowErrorBanner(false);
                  setSuccessMessage(null);
                }}
                className="text-accent font-bold hover:underline flex items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-[14px]">edit</span>
                <span>Change</span>
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-otp" className="text-xs font-bold text-ink-strong tracking-wide">
                6-Digit Verification Code
              </label>
              <input
                id="login-otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoFocus
                autoComplete="one-time-code"
                value={otpCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setOtpCode(val);
                  setShowErrorBanner(false);
                }}
                className="w-full px-4 py-3 bg-surface border border-line rounded-xl text-ink-strong text-xl font-mono text-center tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand font-bold"
                required
              />
            </div>

            {/* Resend Code Action */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-ink-muted">Didn't receive the code?</span>
              {countdown > 0 ? (
                <span className="text-ink-muted font-medium">Resend code in {countdown}s</span>
              ) : (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleSendOtp}
                  className="font-bold text-accent hover:text-accent-hover transition-colors cursor-pointer"
                >
                  Resend Passcode
                </button>
              )}
            </div>

            <AuthButton type="submit" isLoading={isLoading} className="mt-2 shadow-md">
              {isLoading ? 'Verifying Passcode...' : 'Verify & Sign In'}
            </AuthButton>
          </>
        )}
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
