import { lazy, Suspense, useEffect, useState, type FC, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  CalendarDays,
  Armchair,
  Bell,
  Lock,
  AlertCircle,
  Save,
  CheckCircle2,
  LogOut,
  Camera,
  School,
  Smartphone,
  ChevronRight,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { kolkataBannerImg, preloadKolkataBanner } from '../utils/preloadKolkataBanner';

const SignOutModal = lazy(() => import('../components/auth/SignOutModal'));

export const ProfilePage: FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  // Active sub-tab state: 'personal' | 'preferences' | 'security'
  const [activeTab, setActiveTab] = useState<'personal' | 'preferences' | 'security'>('personal');

  // Form states for personal info
  const [name, setName] = useState(user?.name || 'Soumabha Majumder');
  const [email] = useState(user?.email || 'soumabhamajumder@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '08420360166');
  const [gender, setGender] = useState(user?.gender || 'Male');
  const [emergencyContactName, setEmergencyContactName] = useState(
    user?.emergencyContactName || 'Priya Sen (Sister)'
  );
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(
    user?.emergencyContactPhone || '+91 98309 87654'
  );

  // Preference states
  const [seatPreference, setSeatPreference] = useState<'lower_window' | 'upper_sleeper' | 'aisle' | 'any'>(
    user?.seatPreference || 'lower_window'
  );
  const [whatsappNotifications, setWhatsappNotifications] = useState(
    user?.whatsappNotifications ?? true
  );
  const [smsNotifications, setSmsNotifications] = useState(user?.smsNotifications ?? true);
  const [isStudent, setIsStudent] = useState(user?.isStudent ?? false);

  // Success banner toast
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Avatar presets
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatar ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
  );

  const handleSavePersonalInfo = (e: FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      phone,
      gender,
      emergencyContactName,
      emergencyContactPhone,
      avatar: avatarUrl,
    });
    setToastMessage('Personal profile updated successfully!');
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  const handleSavePreferences = () => {
    updateUser({
      seatPreference,
      whatsappNotifications,
      smsNotifications,
      isStudent,
    });
    setToastMessage('Travel preferences saved!');
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  // Sign Out Confirmation Modal State
  const [hasOpenedSignOutModal, setHasOpenedSignOutModal] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Pre-decode 8000x2664 banner WebP and warm SignOutModal chunk once mounted
  useEffect(() => {
    void preloadKolkataBanner();
    void import('../components/auth/SignOutModal');
  }, []);

  const handleOpenSignOutModal = () => {
    setHasOpenedSignOutModal(true);
    setIsSignOutModalOpen(true);
  };

  const handleCloseSignOutModal = () => {
    if (!isSigningOut) {
      setIsSignOutModalOpen(false);
    }
  };

  const handleConfirmSignOut = async () => {
    setIsSigningOut(true);
    try {
      await logout();
    } finally {
      setIsSigningOut(false);
      setIsSignOutModalOpen(false);
      navigate('/');
    }
  };

  const initials = name
    ? name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col space-y-6">
      {/* Toast Notification */}
      {showSaveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#0B2341] text-white shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* BREADCRUMBS NAVIGATION */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-[#0B2341] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-400">My Account</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0B2341] font-bold">Profile</span>
      </nav>

      {/* 1. HERO PROFILE CARD WITH 8000x2664 (3:1) KOLKATA HERITAGE BANNER */}
      <section className="relative rounded-3xl overflow-hidden border border-[#EAE8E4] shadow-[0_8px_30px_rgba(11,35,65,0.06)] bg-[#FEE6D3] sm:min-h-[208px] lg:min-h-[228px] flex flex-col justify-center transition-all">
        {/* Banner Artwork on Desktop / Tablet: Aspect-matched 3:1 right-anchored frame so foliage, bridge & bus tires remain 100% uncropped */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden hidden sm:flex justify-end bg-[#FEE6D3]">
          <div className="relative h-full aspect-[3/1] shrink-0">
            <img
              src={kolkataBannerImg}
              alt="Kolkata Heritage Panorama - Victoria Memorial, Howrah Bridge and Vintage Bus"
              width={8000}
              height={2664}
              className="w-full h-full object-cover object-right transform-gpu"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            {/* Seamless left-edge feather into the warm cream canvas */}
            <div
              className="absolute inset-y-0 left-0 w-1/2 lg:w-[42%] pointer-events-none"
              style={{
                background:
                  'linear-gradient(to right, #FEE6D3 0%, rgba(254, 230, 211, 0.9) 38%, rgba(254, 230, 211, 0) 100%)',
              }}
            />
          </div>
        </div>

        {/* Banner Artwork for Mobile (Aspect-matched scenic top window keeping full bus & bridge clear of text) */}
        <div className="sm:hidden relative w-full aspect-[12/5] min-h-[148px] max-h-[176px] overflow-hidden bg-[#FEE6D3]">
          <img
            src={kolkataBannerImg}
            alt="Kolkata Heritage Panorama"
            width={8000}
            height={2664}
            className="w-full h-full object-cover object-right pointer-events-none transform-gpu"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          {/* Subtle bottom gradient blending smoothly into mobile card surface */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#FEE6D3] via-[#FEE6D3]/60 to-transparent pointer-events-none" />

          {/* Mobile Sign Out Button pinned at top-right over the sky */}
          <button
            type="button"
            onClick={handleOpenSignOutModal}
            className="absolute top-3 right-3 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-rose-50 active:bg-rose-100 text-slate-700 hover:text-rose-600 border border-slate-200/90 hover:border-rose-200 text-[11px] font-bold shadow-xs transition-all cursor-pointer pointer-events-auto select-none"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Desktop Sign Out Button (Top Right over sky area - elevated with z-30 to guarantee hover & click hit-testing) */}
        <div className="hidden sm:block absolute top-5 right-5 sm:top-6 sm:right-6 z-30">
          <button
            type="button"
            onClick={handleOpenSignOutModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/95 hover:bg-rose-50 active:bg-rose-100 text-slate-700 hover:text-rose-600 border border-slate-200/90 hover:border-rose-200 text-xs font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer pointer-events-auto select-none"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Content Area: Left-aligned over the warm cream canvas with pointer-events-none on transparent gutter */}
        <div className="relative z-10 p-5 sm:p-7 lg:p-9 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-7 pointer-events-none">
          {/* Avatar with Camera badge */}
          <div className="relative group shrink-0 -mt-12 sm:mt-0 pointer-events-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-26 lg:h-26 rounded-full border-4 border-white shadow-md overflow-hidden bg-[#0B2341] flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-black text-white tracking-widest">
                  {initials}
                </span>
              )}
            </div>

            {/* Quick Avatar Change Toggle */}
            <button
              type="button"
              onClick={() => {
                const sampleAvatars = [
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
                ];
                const nextAvatar =
                  sampleAvatars[(sampleAvatars.indexOf(avatarUrl) + 1) % sampleAvatars.length];
                setAvatarUrl(nextAvatar);
                updateUser({ avatar: nextAvatar });
              }}
              title="Click to switch photo avatar"
              aria-label="Change Profile Photo"
              className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FC7728] text-white flex items-center justify-center shadow-md hover:bg-[#E6651D] transition-transform group-hover:scale-110 cursor-pointer border-2 border-white"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Details (Clean, Minimal & High-Contrast) */}
          <div className="flex-1 text-center sm:text-left space-y-2.5 max-w-full sm:max-w-md pointer-events-auto">
            {/* Top row: Name & Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B2341] tracking-tight">
                {name}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F7ED] text-[#0D6832] text-xs font-bold border border-emerald-200/80 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{user?.role || 'Verified Traveler'}</span>
              </span>
              {isStudent && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 text-[#A04100] text-xs font-bold border border-[#FC7728]/30 shadow-2xs">
                  <School className="w-3.5 h-3.5 text-[#FC7728]" />
                  <span>Student Pass Active</span>
                </span>
              )}
            </div>

            {/* High-Contrast Glassmorphic Contact Capsule */}
            <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3 px-3.5 py-1.5 rounded-xl bg-white/85 backdrop-blur-md border border-white/95 shadow-2xs text-xs font-bold text-[#0B2341]">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#FC7728] shrink-0" />
                <span>{email}</span>
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{phone}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRAVELER MILESTONES & QUICK PERKS STRIP */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Member Tenure */}
        <div className="p-4 rounded-2xl bg-white border border-[#EAE8E4] shadow-[0_2px_12px_rgba(11,35,65,0.03)] flex items-center gap-3.5 hover:border-[#0B2341]/20 transition-all">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0B2341] flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Member Since
            </div>
            <div className="text-xs sm:text-sm font-black text-[#0B2341]">
              {user?.memberSince || 'November 2026'}
            </div>
          </div>
        </div>

        {/* Card 2: Completed Journeys */}
        <div className="p-4 rounded-2xl bg-white border border-[#EAE8E4] shadow-[0_2px_12px_rgba(11,35,65,0.03)] flex items-center gap-3.5 hover:border-emerald-500/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Completed Trips
            </div>
            <div className="text-xs sm:text-sm font-black text-[#0B2341]">
              4 Journeys
            </div>
          </div>
        </div>

        {/* Card 3: AI Smart Savings */}
        <div className="p-4 rounded-2xl bg-white border border-[#EAE8E4] shadow-[0_2px_12px_rgba(11,35,65,0.03)] flex items-center gap-3.5 hover:border-[#FC7728]/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#A04100] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-[#FC7728]" />
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              OneGo AI Savings
            </div>
            <div className="text-xs sm:text-sm font-black text-[#0B2341]">
              ₹1,850 Saved
            </div>
          </div>
        </div>

        {/* Card 4: Frequent Corridor */}
        <div className="p-4 rounded-2xl bg-white border border-[#EAE8E4] shadow-[0_2px_12px_rgba(11,35,65,0.03)] flex items-center gap-3.5 hover:border-teal-500/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Favorite Corridor
            </div>
            <div className="text-xs sm:text-sm font-black text-[#0B2341] truncate max-w-[130px] sm:max-w-none">
              Kolkata ⇄ Siliguri
            </div>
          </div>
        </div>
      </section>

      {/* 3. SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80">
        {[
          { id: 'personal', label: 'Personal Information', icon: User },
          { id: 'preferences', label: 'Travel Preferences', icon: Armchair },
          { id: 'security', label: 'Security & Sessions', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#0B2341] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0B2341] hover:bg-white/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB 1: PERSONAL INFORMATION */}
      {activeTab === 'personal' && (
        <form onSubmit={handleSavePersonalInfo} className="space-y-6">
          <div className="rounded-3xl p-6 sm:p-8 lg:p-10 bg-white border border-[#EAE8E4] shadow-[0_4px_24px_rgba(11,35,65,0.04)] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B2341] tracking-tight">
                  Personal Information
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Update your contact and identification details for bus ticket generation.
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Official Travel ID
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="profile-name" className="text-xs font-bold text-slate-700">
                  Full Name (as per Govt ID)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-[#0B2341] focus:ring-2 focus:ring-[#FC7728] focus:border-transparent outline-none transition-all shadow-2xs"
                    placeholder="e.g. Soumabha Majumder"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label htmlFor="profile-email" className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Primary Email Address</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Verified
                  </span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    id="profile-email"
                    type="email"
                    value={email}
                    disabled
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F4F6F9] border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Mobile Phone Number */}
              <div className="space-y-1.5">
                <label htmlFor="profile-phone" className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Mobile Phone Number</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    SMS OTP Verified
                  </span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    id="profile-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-[#0B2341] focus:ring-2 focus:ring-[#FC7728] focus:border-transparent outline-none transition-all shadow-2xs"
                    placeholder="08420360166"
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label htmlFor="profile-gender" className="text-xs font-bold text-slate-700">
                  Gender
                </label>
                <select
                  id="profile-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-[#0B2341] focus:ring-2 focus:ring-[#FC7728] focus:border-transparent outline-none transition-all shadow-2xs cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female (Eligible for Women-Reserved Berths)</option>
                  <option value="Other">Other / Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Emergency Contact Name */}
              <div className="space-y-1.5">
                <label htmlFor="emergency-name" className="text-xs font-bold text-slate-700">
                  Emergency Contact Name &amp; Relation
                </label>
                <input
                  id="emergency-name"
                  type="text"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-[#0B2341] focus:ring-2 focus:ring-[#FC7728] focus:border-transparent outline-none transition-all shadow-2xs"
                  placeholder="e.g. Priya Sen (Sister)"
                />
              </div>

              {/* Emergency Contact Phone */}
              <div className="space-y-1.5">
                <label htmlFor="emergency-phone" className="text-xs font-bold text-slate-700">
                  Emergency Contact Phone
                </label>
                <input
                  id="emergency-phone"
                  type="tel"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-[#0B2341] focus:ring-2 focus:ring-[#FC7728] focus:border-transparent outline-none transition-all shadow-2xs"
                  placeholder="+91 98309 87654"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#FC7728] hover:bg-[#E6651D] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#FC7728]/25 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Save Personal Details</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 4. TAB 2: TRAVEL & SEAT PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <div className="rounded-3xl p-6 sm:p-8 lg:p-10 bg-white border border-[#EAE8E4] shadow-[0_4px_24px_rgba(11,35,65,0.04)] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B2341] tracking-tight">
                  Travel &amp; Bus Comfort
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Configure default preferences to automatically filter coaches on your routes.
                </p>
              </div>
            </div>

            {/* Seat Deck Preference */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">
                Preferred Seat Position &amp; Deck
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'lower_window',
                    title: 'Lower Deck Window',
                    desc: 'Executive armchair next to scenic vista windows.',
                  },
                  {
                    id: 'upper_sleeper',
                    title: 'Upper Deck Sleeper',
                    desc: 'Panoramic top-level berth for overnight rest.',
                  },
                  {
                    id: 'aisle',
                    title: 'Aisle Seater',
                    desc: 'Easy cabin walkway access with extra leg stretch.',
                  },
                ].map((item) => {
                  const selected = seatPreference === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setSeatPreference(item.id as typeof seatPreference)
                      }
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        selected
                          ? 'bg-[#FFF0E6] border-[#FC7728] shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-[#0B2341]">
                          {item.title}
                        </span>
                        {selected && (
                          <span className="w-2 h-2 rounded-full bg-[#FC7728]" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Student Privilege Pass Toggle */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FBF9F5] border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#A04100] flex items-center justify-center shrink-0">
                  <School className="w-5 h-5 text-[#FC7728]" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-[#0B2341]">
                    Student Privilege Concession Pass
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Unlocks 25% concession on West Bengal RTC (NBSTC, SBSTC) verified routes.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isStudent}
                  onChange={(e) => setIsStudent(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FC7728]" />
              </label>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-700 block">
                Dispatch &amp; Journey Communication
              </span>
              <div className="space-y-2.5">
                <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#0B2341]">
                        WhatsApp Live GPS &amp; QR Pass
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Receive departure track link and boarding QR code on your WhatsApp.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={whatsappNotifications}
                    onChange={(e) => setWhatsappNotifications(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FC7728] focus:ring-[#FC7728] cursor-pointer"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#0B2341]">
                        SMS 30-Minute Highway Alert
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Receive highway dispatch status and platform bay reminders via SMS.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsNotifications}
                    onChange={(e) => setSmsNotifications(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FC7728] focus:ring-[#FC7728] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-6 py-3 rounded-xl bg-[#FC7728] hover:bg-[#E6651D] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#FC7728]/25 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: SECURITY & SESSIONS */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="rounded-3xl p-6 sm:p-8 lg:p-10 bg-white border border-[#EAE8E4] shadow-[0_4px_24px_rgba(11,35,65,0.04)] space-y-6">
            <div className="pb-4 border-b border-slate-200/60">
              <h2 className="text-xl sm:text-2xl font-black text-[#0B2341] tracking-tight">
                Security &amp; Active Logins
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Manage your credentials and verify devices with active access to your OneGoBus account.
              </p>
            </div>

            {/* Active Sessions */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-700 block">
                Active Devices &amp; Sessions
              </span>
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FBF9F5] border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#0B2341] shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#0B2341] flex items-center gap-2">
                      <span>Web Browser (Current Session)</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                        Online Now
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Kolkata, West Bengal • Last active just now
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone: Logout */}
            <div className="pt-4 border-t border-slate-200/60 space-y-3">
              <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Account Management</span>
              </span>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleOpenSignOutModal}
                  className="px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of One Go Bus</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Modal (Lazy-loaded & pre-warmed) */}
      {hasOpenedSignOutModal && (
        <Suspense fallback={null}>
          <SignOutModal
            isOpen={isSignOutModalOpen}
            onClose={handleCloseSignOutModal}
            onConfirm={handleConfirmSignOut}
            isLoading={isSigningOut}
          />
        </Suspense>
      )}
    </div>
  );
};

export default ProfilePage;
