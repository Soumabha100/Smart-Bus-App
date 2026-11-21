import { useState, type FC, type FormEvent } from 'react';
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
  Download,
  AlertCircle,
  Save,
  CheckCircle2,
  LogOut,
  Camera,
  School,
  FileText,
  Smartphone,
  ChevronRight,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import howrahBridgeImg from '../assets/howrah-bridge-sunrise.jpg';

export const ProfilePage: FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  // Active sub-tab state: 'personal' | 'preferences' | 'privacy' | 'security'
  const [activeTab, setActiveTab] = useState<'personal' | 'preferences' | 'privacy' | 'security'>('personal');

  // Form states for personal info
  const [name, setName] = useState(user?.name || 'Rohan Sen');
  const [email] = useState(user?.email || 'rohan.wanderer@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98301 24567');
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
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDownloadData = () => {
    const travelerData = {
      user: {
        name,
        email,
        phone,
        gender,
        role: user?.role || 'Verified Traveler',
        memberSince: user?.memberSince || 'November 2026',
        seatPreference,
        emergencyContact: {
          name: emergencyContactName,
          phone: emergencyContactPhone,
        },
      },
      pastJourneys: [
        {
          route: 'Kolkata (Esplanade) ➔ Siliguri (Junction)',
          date: '14 Nov 2026',
          operator: 'Shyamoli Paribahan • Volvo Multi-Axle Sleeper',
          seat: 'L2 (Lower Deck)',
          fare: 749,
          status: 'Completed',
        },
        {
          route: 'Siliguri (Tenzing Norgay) ➔ Kolkata (Airport Gate 1)',
          date: '08 Nov 2026',
          operator: 'Greenline Travels • Scania AC Sleeper',
          seat: 'U3 (Upper Deck)',
          fare: 799,
          status: 'Completed',
        },
      ],
      dpdpCompliance: {
        act: 'Digital Personal Data Protection Act 2025',
        jurisdiction: 'West Bengal, India',
        dataRetentionPolicy: 'Encrypted in-transit, zero third-party LLM transmission',
      },
    };

    const blob = new Blob([JSON.stringify(travelerData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OneGoBus_Traveler_Profile_${name.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
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

      {/* BREADCRUMBS & NAVIGATION BAR */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-[#0B2341] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-400">My Account</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0B2341] font-bold">Profile</span>
      </nav>

      {/* 1. HERO PROFILE CARD WITH HOWRAH BRIDGE AMBIENT TINT */}
      <section className="relative rounded-3xl p-6 sm:p-8 glass border border-white/90 shadow-[0_16px_50px_rgba(11,35,65,0.08)] overflow-hidden">
        {/* Subtle Howrah Bridge photo background tint */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10">
          <img
            src={howrahBridgeImg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-top scale-110"
            style={{ filter: 'blur(14px)', opacity: 0.15 }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8F1]/90 via-[#FFF8F1]/80 to-[#FFF8F1]/90" />
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          {/* Avatar with Camera badge */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-[#0B2341] flex items-center justify-center">
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
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
                ];
                const nextAvatar =
                  sampleAvatars[(sampleAvatars.indexOf(avatarUrl) + 1) % sampleAvatars.length];
                setAvatarUrl(nextAvatar);
                updateUser({ avatar: nextAvatar });
              }}
              title="Click to switch photo avatar"
              className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#FC7728] text-white flex items-center justify-center shadow-md hover:bg-[#E6651D] transition-transform group-hover:scale-110 cursor-pointer border-2 border-white"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Meta Information */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0B2341] tracking-tight">
                {name}
              </h1>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs">
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

            <p className="text-xs sm:text-sm text-slate-600 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{email}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{phone}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                <span>Member since {user?.memberSince || 'November 2026'}</span>
              </span>
            </p>

            {/* Quick Corridor Counters */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs font-semibold text-slate-700">
              <div className="px-3 py-1.5 rounded-xl bg-white/70 border border-white/80 shadow-2xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#16834A]" />
                <span>4 Journeys Completed</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/70 border border-white/80 shadow-2xs flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FC7728]" />
                <span>₹1,850 Saved with OneGo AI</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/70 border border-white/80 shadow-2xs flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>Kolkata ⇄ Siliguri Favorite</span>
              </div>
            </div>
          </div>

          {/* Quick Sign Out Button */}
          <div className="shrink-0 self-center sm:self-start">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/80 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-white/90 hover:border-rose-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/80">
        {[
          { id: 'personal', label: 'Personal Information', icon: User },
          { id: 'preferences', label: 'Travel Preferences', icon: Armchair },
          { id: 'privacy', label: 'DPDP 2025 Privacy', icon: ShieldCheck },
          { id: 'security', label: 'Security & Sessions', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#0B2341] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0B2341] hover:bg-white/70'
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
          <div className="rounded-3xl p-6 sm:p-8 glass border border-white/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <div>
                <h2 className="text-lg font-black text-[#0B2341]">Personal Information</h2>
                <p className="text-xs text-slate-500">
                  Update your contact and identification details for bus ticket generation.
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Official Travel ID
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="profile-name" className="text-xs font-bold text-slate-700">
                  Full Name (as per Govt ID)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/90 border border-slate-200 text-xs font-bold text-[#0B2341] focus:ring-2 focus:ring-[#FC7728] focus:outline-none"
                    placeholder="e.g. Rohan Sen"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label htmlFor="profile-email" className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Primary Email Address</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Verified
                  </span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    id="profile-email"
                    type="email"
                    value={email}
                    disabled
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Mobile Phone Number */}
              <div className="space-y-1.5">
                <label htmlFor="profile-phone" className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Mobile Phone Number</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    SMS OTP Verified
                  </span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    id="profile-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/90 border border-slate-200 text-xs font-bold text-[#0B2341] focus:ring-2 focus:ring-[#FC7728] focus:outline-none"
                    placeholder="+91 98301 24567"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-slate-200 text-xs font-bold text-[#0B2341] focus:ring-2 focus:ring-[#FC7728] focus:outline-none cursor-pointer"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-slate-200 text-xs font-bold text-[#0B2341] focus:ring-2 focus:ring-[#FC7728] focus:outline-none"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-slate-200 text-xs font-bold text-[#0B2341] focus:ring-2 focus:ring-[#FC7728] focus:outline-none"
                  placeholder="+91 98309 87654"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#FC7728] hover:bg-[#E6651D] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
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
          <div className="rounded-3xl p-6 sm:p-8 glass border border-white/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
              <div>
                <h2 className="text-lg font-black text-[#0B2341]">Travel &amp; Bus Comfort</h2>
                <p className="text-xs text-slate-500">
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
                          : 'bg-white/70 border-slate-200 hover:bg-white'
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
            <div className="p-4 rounded-2xl bg-white/70 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#A04100] flex items-center justify-center">
                  <School className="w-5 h-5 text-[#FC7728]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0B2341]">
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
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FC7728]" />
              </label>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-700 block">
                Dispatch &amp; Journey Communication
              </span>
              <div className="space-y-2">
                <div className="p-3.5 rounded-2xl bg-white/70 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="text-xs font-bold text-[#0B2341]">
                        WhatsApp Live GPS &amp; QR Pass
                      </div>
                      <p className="text-[10px] text-slate-500">
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

                <div className="p-3.5 rounded-2xl bg-white/70 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Bell className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="text-xs font-bold text-[#0B2341]">
                        SMS 30-Minute Highway Alert
                      </div>
                      <p className="text-[10px] text-slate-500">
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

            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-6 py-2.5 rounded-full bg-[#FC7728] hover:bg-[#E6651D] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: DPDP 2025 PRIVACY & DATA TRANSPARENCY */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <div className="rounded-3xl p-6 sm:p-8 glass border border-white/80 shadow-xs space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold block text-sm">
                  DPDP Act 2025 Protected Account
                </span>
                <p className="text-emerald-800 mt-0.5 leading-relaxed">
                  Your personally identifiable information (name, phone number, email, and live locations) is stored strictly in encrypted databases and is <strong>never passed to third-party AI models</strong>.
                </p>
              </div>
            </div>

            {/* Data Portability */}
            <div className="p-5 rounded-2xl bg-white/70 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-sm text-[#0B2341]">
                  Export Personal Data &amp; Travel Records
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Download a copy of your verified passenger profile, tickets, and travel history as compliant JSON.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadData}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-[#0B2341] text-xs font-bold transition-colors flex items-center gap-2 shadow-2xs shrink-0 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#FC7728]" />
                <span>Download My Data (JSON)</span>
              </button>
            </div>

            {/* Privacy Policy Link */}
            <div className="p-4 rounded-2xl bg-white/70 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-slate-500" />
                <div>
                  <div className="text-xs font-bold text-[#0B2341]">
                    OneGoBus Privacy Policy &amp; Terms
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Read our full terms covering booking guarantees and state bus operator agreements.
                  </p>
                </div>
              </div>
              <Link
                to="/privacy"
                className="text-xs font-bold text-[#FC7728] hover:underline"
              >
                View Policy ➔
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB 4: SECURITY & SESSIONS */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="rounded-3xl p-6 sm:p-8 glass border border-white/80 shadow-xs space-y-5">
            <div className="pb-3 border-b border-slate-200/60">
              <h2 className="text-lg font-black text-[#0B2341]">Security &amp; Active Logins</h2>
              <p className="text-xs text-slate-500">
                Manage your credentials and verify devices with active access to your OneGoBus account.
              </p>
            </div>

            {/* Active Sessions */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Active Devices &amp; Sessions
              </span>
              <div className="p-4 rounded-2xl bg-white/70 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[#0B2341]">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0B2341] flex items-center gap-2">
                      <span>Web Browser (Current Session)</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[9px] font-bold border border-emerald-200">
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

            {/* Danger Zone: Logout & Deactivate */}
            <div className="pt-4 border-t border-slate-200/60 space-y-3">
              <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Account Management</span>
              </span>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of OneGoBus</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
