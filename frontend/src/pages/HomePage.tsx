import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenStorage } from '../utils/tokenStorage';
import heroBg from '../assets/hero_bussathi_compact.webp';
import exploreBus from '../assets/explore_bus.webp';
import exploreVoucher from '../assets/explore_voucher.webp';
import exploreStop from '../assets/explore_stop.webp';
import exploreQr from '../assets/explore_qr.webp';
import exploreStudents from '../assets/explore_students.webp';

interface BengalCity {
  city: string;
  terminal: string;
  region: string;
  icon: string;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  isDeal?: boolean;
}

const BENGAL_CITIES: BengalCity[] = [
  { city: 'Kolkata', terminal: 'Esplanade / Babughat / Karunamoyee', region: 'Kolkata Metro', icon: 'directions_bus' },
  { city: 'Howrah', terminal: 'Howrah Station / Nabanna Terminus', region: 'Howrah', icon: 'train' },
  { city: 'Durgapur', terminal: 'City Centre Bus Terminus / Muchipara', region: 'P. Bardhaman', icon: 'location_city' },
  { city: 'Asansol', terminal: 'SBSTC Bus Stand / Chelidanga', region: 'P. Bardhaman', icon: 'commute' },
  { city: 'Siliguri', terminal: 'Tenzing Norgay Bus Terminus / Junction', region: 'North Bengal', icon: 'landscape' },
  { city: 'Digha', terminal: 'Digha Old Bus Stand / New Digha', region: 'Coastal', icon: 'beach_access' },
  { city: 'Malda', terminal: 'Rathbari Terminus / English Bazar', region: 'Central Bengal', icon: 'history_edu' },
  { city: 'Bolpur / Santiniketan', terminal: 'Prantik Bus Stop / Jamboni', region: 'Birbhum', icon: 'palette' },
  { city: 'Haldia', terminal: 'City Centre Bus Terminal / Durgachak', region: 'Purba Medinipur', icon: 'anchor' },
];

const TIME_OPTIONS = [
  'Anytime',
  'Morning (06:00 - 12:00)',
  'Afternoon (12:00 - 17:00)',
  'Evening (17:00 - 21:00)',
  'Night (21:00 - 06:00)',
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const user = tokenStorage.getUser();

  // ─────────────────────────────────────────────────────────────
  // 1. SEARCH FORM STATES
  // ─────────────────────────────────────────────────────────────
  const [fromCity, setFromCity] = useState('Kolkata');
  const [fromSub, setFromSub] = useState('Esplanade / Babughat');
  const [toCity, setToCity] = useState('Siliguri');
  const [toSub, setToSub] = useState('Old Bus Stand');

  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  // Calendar states (17 Nov 2026 as per finalized Stitch design)
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 10, 17));
  const [displayedYear, setDisplayedYear] = useState(2026);
  const [displayedMonth, setDisplayedMonth] = useState(10); // November

  // Time & Budget
  const [selectedTime, setSelectedTime] = useState('Anytime');
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [budget, setBudget] = useState(800);

  // ─────────────────────────────────────────────────────────────
  // 2. UI NAVIGATION & COPILOT DRAWER STATES
  // ─────────────────────────────────────────────────────────────
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotChat, setCopilotChat] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: 'নমস্কার! Welcome to BusSathi 🙏\nI am your smart Bengal transit copilot. Need assistance discovering fast routes, applying student passes, or finding buses below your budget?',
    },
    {
      id: 'msg-2',
      sender: 'bot',
      isDeal: true,
    },
  ]);
  const [copilotInput, setCopilotInput] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Refs for click outside
  const fromContainerRef = useRef<HTMLDivElement>(null);
  const toContainerRef = useRef<HTMLDivElement>(null);
  const dateContainerRef = useRef<HTMLDivElement>(null);
  const timeContainerRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const chatStreamRef = useRef<HTMLDivElement>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (fromContainerRef.current && !fromContainerRef.current.contains(target)) {
        setFromDropdownOpen(false);
      }
      if (toContainerRef.current && !toContainerRef.current.contains(target)) {
        setToDropdownOpen(false);
      }
      if (dateContainerRef.current && !dateContainerRef.current.contains(target)) {
        setCalendarOpen(false);
      }
      if (timeContainerRef.current && !timeContainerRef.current.contains(target)) {
        setTimeDropdownOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll chat stream when new messages arrive
  useEffect(() => {
    if (chatStreamRef.current) {
      chatStreamRef.current.scrollTop = chatStreamRef.current.scrollHeight;
    }
  }, [copilotChat]);

  // ─────────────────────────────────────────────────────────────
  // 3. SEARCH & ROUTE HANDLERS
  // ─────────────────────────────────────────────────────────────
  const formatDateForDisplay = (d: Date): string => {
    const day = d.getDate();
    const monthStr = MONTH_NAMES_SHORT[d.getMonth()];
    const weekdayStr = DAY_NAMES_SHORT[d.getDay()];
    return `${day} ${monthStr}, ${weekdayStr}`;
  };

  const formatDateDDMMYYYY = (d: Date): string => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSwap = () => {
    setIsSwapping(true);
    const tempCity = fromCity;
    const tempSub = fromSub;
    setFromCity(toCity);
    setFromSub(toSub);
    setToCity(tempCity);
    setToSub(tempSub);
    setFromDropdownOpen(false);
    setToDropdownOpen(false);
    setTimeout(() => setIsSwapping(false), 300);
  };

  const handleTriggerSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    navigate('/results', {
      state: {
        from: fromCity,
        to: toCity,
        date: formatDateForDisplay(selectedDate),
        budget,
        time: selectedTime,
        mood: 'Recommended',
      },
    });
  };

  const handleSetQuickRoute = (from: string, fromT: string, to: string, toT: string) => {
    setFromCity(from);
    setFromSub(fromT);
    setToCity(to);
    setToSub(toT);
    if (searchSectionRef.current) {
      searchSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calendar logic
  const handleDatePreset = (preset: 'today' | 'tomorrow' | 'plus2' | 'weekend') => {
    const base = new Date(2026, 10, 17); // 17 Nov 2026 demo base
    const target = new Date(base);
    if (preset === 'tomorrow') {
      target.setDate(base.getDate() + 1);
    } else if (preset === 'plus2') {
      target.setDate(base.getDate() + 2);
    } else if (preset === 'weekend') {
      const day = base.getDay();
      let diff = 6 - day;
      if (diff <= 0) diff += 7;
      target.setDate(base.getDate() + diff);
    }
    setDisplayedYear(target.getFullYear());
    setDisplayedMonth(target.getMonth());
    setSelectedDate(target);
    setCalendarOpen(false);
  };

  const handlePrevMonth = () => {
    if (displayedMonth === 0) {
      setDisplayedMonth(11);
      setDisplayedYear((y) => y - 1);
    } else {
      setDisplayedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (displayedMonth === 11) {
      setDisplayedMonth(0);
      setDisplayedYear((y) => y + 1);
    } else {
      setDisplayedMonth((m) => m + 1);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 4. COPILOT HANDLERS
  // ─────────────────────────────────────────────────────────────
  const handleCopilotSend = (customText?: string) => {
    const textToSend = customText || copilotInput.trim();
    if (!textToSend) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
    };
    setCopilotChat((prev) => [...prev, userMessage]);
    if (!customText) setCopilotInput('');

    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let botResponse = '';
      if (lower.includes('ac') || lower.includes('non-ac')) {
        botResponse = 'Volvo Multi-axle AC buses offer temperature control, charging ports, and pushback sleeper berths (avg fare ₹750). Non-AC express coaches run every 20-30 mins at budget fares starting from ₹180-₹220.';
      } else if (lower.includes('student') || lower.includes('pass')) {
        botResponse = 'Students receive up to 40% monthly concessions! Use promo code CAMPUSCOMMUTE at checkout and keep your valid college ID handy during boarding.';
      } else if (lower.includes('luggage') || lower.includes('bag')) {
        botResponse = 'Each passenger is allowed 1 main baggage (up to 20kg in the under-deck cargo) and 1 laptop/hand carry bag in the overhead rack for free.';
      } else if (lower.includes('cheapest') || lower.includes('300')) {
        botResponse = 'Top budget routes under ₹300:\n• Kolkata → Digha: from ₹220\n• Kolkata → Durgapur: from ₹180\n• Kolkata → Haldia: from ₹160\nSet your budget slider to match!';
      } else {
        botResponse = `Found 28 verified buses matching your query across WBSTC, SBSTC, and private luxury operators. Would you like me to prefill departure and destination on your search card?`;
      }

      setCopilotChat((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botResponse,
        },
      ]);
    }, 400);
  };

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      setTimeout(() => {
        setIsVoiceActive(false);
      }, 2500);
    }
  };

  const handleLogout = () => {
    tokenStorage.clear();
    navigate('/login');
  };

  // Calendar Day Grid Computation
  const firstDayOfWeek = new Date(displayedYear, displayedMonth, 1).getDay();
  const daysInCurrentMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();
  const daysInPreviousMonth = new Date(displayedYear, displayedMonth, 0).getDate();
  const totalCells = firstDayOfWeek + daysInCurrentMonth;
  const trailingCells = (7 - (totalCells % 7)) % 7;

  // Filtered Cities
  const filteredFromCities = BENGAL_CITIES.filter(
    (c) =>
      c.city.toLowerCase().includes(fromSearch.toLowerCase()) ||
      c.terminal.toLowerCase().includes(fromSearch.toLowerCase()) ||
      c.region.toLowerCase().includes(fromSearch.toLowerCase())
  );

  const filteredToCities = BENGAL_CITIES.filter(
    (c) =>
      c.city.toLowerCase().includes(toSearch.toLowerCase()) ||
      c.terminal.toLowerCase().includes(toSearch.toLowerCase()) ||
      c.region.toLowerCase().includes(toSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9F9FF] font-['Plus_Jakarta_Sans',sans-serif] text-[#001B3E] antialiased flex flex-col">
      {/* ==========================================
          HEADER (FLOATING PILL NAVBAR, max-w-[1520px])
          ========================================== */}
      <header className="sticky top-1 sm:top-2 z-40 w-full px-3 sm:px-[22px]">
        <div className="max-w-[1520px] mx-auto h-[50px] sm:h-[54px] lg:h-[58px] rounded-full bg-[#FCFEFF]/95 backdrop-blur-[18px] border border-[#CEDDF3] shadow-[0_4px_20px_rgba(11,61,146,0.06)] px-3 sm:px-5 lg:px-6 flex items-center justify-between">
          {/* LEFT: BRAND */}
          <div className="flex items-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 group focus:outline-hidden text-left cursor-pointer"
            >
              <div className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] rounded-[10px] sm:rounded-[12px] bg-[#0B3D92] flex items-center justify-center text-white shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-200">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect height="13" rx="3" width="18" x="3" y="6" />
                  <path d="M3 11h18" />
                  <circle cx="7" cy="15" fill="#FF7900" r="1.5" stroke="none" />
                  <circle cx="17" cy="15" fill="#FF7900" r="1.5" stroke="none" />
                  <path d="M6 19v2" />
                  <path d="M18 19v2" />
                </svg>
              </div>
              <div className="flex flex-col justify-center leading-none">
                <span className="text-[20px] sm:text-[22px] font-black tracking-tight leading-none text-[#082E78]">
                  Bus<span className="text-[#FF7900]">Sathi</span>
                </span>
                <span className="text-[9.5px] sm:text-[10px] font-medium text-[#4B6584] tracking-wide mt-0.5">Travel Smart. Pay Less.</span>
              </div>
            </button>
          </div>

          {/* CENTER: DESKTOP NAVIGATION LINKS */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2.5">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="h-[34px] sm:h-[36px] px-3.5 rounded-[25px] bg-gradient-to-r from-[#104FBD] to-[#082E78] text-white font-bold text-[13px] sm:text-[13.5px] flex items-center gap-1.5 shadow-sm transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[17px]">home</span>
              <span>Home</span>
            </a>
            <a
              href="#routes"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('popular-journeys')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[#2D3F58] hover:text-[#0B4DBB] font-bold text-[13px] sm:text-[13.5px] px-2.5 py-1 flex items-center gap-1 transition-colors duration-200"
            >
              <span className="material-symbols-outlined text-[17px]">explore</span>
              <span>Routes</span>
            </a>
            <a
              href="#offers"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('student-special')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[#2D3F58] hover:text-[#0B4DBB] font-bold text-[13px] sm:text-[13.5px] px-2.5 py-1 flex items-center gap-1 transition-colors duration-200"
            >
              <span className="material-symbols-outlined text-[17px]">local_offer</span>
              <span>Offers</span>
            </a>
            <a
              href="#bus-pass"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('student-special')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[#2D3F58] hover:text-[#0B4DBB] font-bold text-[13px] sm:text-[13.5px] px-2.5 py-1 flex items-center gap-1 transition-colors duration-200"
            >
              <span className="material-symbols-outlined text-[17px]">badge</span>
              <span>Bus Pass</span>
            </a>
            <a
              href="#faq"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[#2D3F58] hover:text-[#0B4DBB] font-bold text-[13px] sm:text-[13.5px] px-2.5 py-1 flex items-center gap-1 transition-colors duration-200"
            >
              <span className="material-symbols-outlined text-[17px]">headset_mic</span>
              <span>Help &amp; Support</span>
            </a>
          </nav>

          {/* RIGHT: ACTIONS & USER PROFILE */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Sathi Copilot Trigger Button */}
            <button
              type="button"
              aria-label="Open Sathi Copilot AI Concierge"
              onClick={() => setCopilotOpen(true)}
              className="h-[34px] sm:h-[36px] px-3 rounded-full bg-[#082454] hover:bg-[#0C3270] text-white font-bold text-[12.5px] sm:text-[13px] flex items-center gap-1.5 shadow-xs transition-all cursor-pointer select-none"
            >
              <span className="text-amber-400 text-xs sm:text-sm">✦</span>
              <span>Sathi Copilot</span>
              <span className="bg-[#FF7900] text-white text-[9.5px] font-black px-1.5 py-0.2 rounded-full leading-none">
                AI
              </span>
            </button>

            {/* Notification Bell Button */}
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => alert('No new notifications right now.')}
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center hover:bg-slate-100 relative transition-colors duration-200 text-[#2D3F58] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="w-1.5 h-1.5 bg-[#FF7900] rounded-full ring-2 ring-white absolute top-1.5 right-1.5" />
            </button>

            {/* Profile Avatar Button with Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                aria-label="My Account Profile"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-[#EBF3FC] border border-[#CEDDF3] flex items-center justify-center text-[#082E78] hover:border-[#082E78] transition-colors duration-200 cursor-pointer font-bold text-[13px]"
              >
                {user?.name ? (
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">person</span>
                )}
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#D0E4FF] py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-500">Signed in as</p>
                    <p className="text-sm font-bold text-[#082E78] truncate">{user?.name || user?.email || 'Commuter'}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E3F8F5] text-[#0A5832]">
                      Verified Rider
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      navigate('/results');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#EAF3FF] hover:text-[#082E78] transition-colors"
                  >
                    My Bookings
                  </button>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setCopilotOpen(true);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-[#EAF3FF] hover:text-[#082E78] transition-colors flex items-center justify-between"
                  >
                    <span>Sathi Copilot AI</span>
                    <span className="text-[10px] bg-[#FF7900] text-white px-1.5 py-0.2 rounded font-bold">AI</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger (lg:hidden) */}
            <button
              type="button"
              aria-label="Toggle Mobile Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 text-[#082E78] transition-colors duration-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 max-w-[1520px] mx-auto bg-white rounded-2xl border border-[#CEDDF3] px-6 py-4 flex flex-col gap-3 shadow-xl">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="font-bold text-[#082E78] text-base py-1"
            >
              Home
            </a>
            <a
              href="#routes"
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('popular-journeys')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="font-medium text-slate-700 text-base py-1 hover:text-[#082E78]"
            >
              Routes
            </a>
            <a
              href="#offers"
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('student-special')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="font-medium text-slate-700 text-base py-1 hover:text-[#082E78]"
            >
              Offers &amp; Deals
            </a>
            <a
              href="#bus-pass"
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('student-special')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="font-medium text-slate-700 text-base py-1 hover:text-[#082E78]"
            >
              Student Bus Pass
            </a>
            <a
              href="#faq"
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="font-medium text-slate-700 text-base py-1 hover:text-[#082E78]"
            >
              Help &amp; Support
            </a>
          </div>
        )}
      </header>

      {/* ==========================================
          MAIN CONTENT CONTAINER
          ========================================== */}
      <main className="w-full grow bg-[#F9F9FF]">
        {/* ==========================================
            SECTION 1: HERO SECTION & KOLKATA BANNER
            ========================================== */}
        <section className="w-full max-w-[1560px] mx-auto px-3 sm:px-[22px] mt-2 sm:mt-2.5">
          <div className="relative w-full overflow-hidden h-[210px] sm:h-[230px] lg:h-[250px] rounded-[20px] sm:rounded-[24px] bg-[#FCFDFE] border border-[#E2ECF8] shadow-xs flex items-center">
            {/* Kolkata Transit Illustration: One Continuous Full-Width Background Layer */}
            <div className="absolute inset-0 z-0 w-full h-full pointer-events-none select-none overflow-hidden">
              <img
                src={heroBg}
                alt="Kolkata Bengal transit panorama with riverside trees, Howrah Bridge, ferry, Victoria Memorial, and modern bus"
                className="w-full h-full object-cover object-[center_80%] sm:object-[center_82%] md:object-[center_83%]"
              />
            </div>

            {/* Smooth Horizontal Gradient Scrim for Text Readability without hard vertical boundaries */}
            <div className="absolute inset-0 z-1 pointer-events-none bg-gradient-to-r from-white via-white/90 via-28% md:via-white/75 md:via-42% lg:via-white/55 lg:via-50% to-transparent w-full md:w-[70%] lg:w-[62%]" />

            {/* Hero Left Content: Heading Over Background */}
            <div className="relative z-10 h-full flex flex-col justify-center px-5 sm:px-8 lg:px-10 py-3 sm:py-3.5">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[28px] bg-white border border-[#CEDDF3] shadow-[0_2px_8px_rgba(11,61,146,0.04)] mb-1 sm:mb-1.5 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF7900]" />
                <span className="text-[9.5px] sm:text-[10px] text-[#082E78] uppercase tracking-[0.12em] font-extrabold">
                  BENGAL&apos;S SMARTEST TRANSIT NETWORK
                </span>
              </div>

              {/* Heading with arc curve on single line */}
              <div className="relative inline-block z-10">
                <h1 className="text-[26px] sm:text-[30px] lg:text-[34px] leading-tight font-[900] text-[#082454] tracking-tight drop-shadow-xs whitespace-nowrap">
                  Where to{' '}
                  <span className="text-[#FF7900] font-black relative inline-block pb-0.5 tracking-tight">
                    next?
                    <svg
                      className="absolute -bottom-1 left-0 w-full pointer-events-none"
                      fill="none"
                      viewBox="0 0 100 20"
                      preserveAspectRatio="none"
                    >
                      <path d="M2 14C30 2 70 2 98 14" stroke="#FF7900" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-[12px] sm:text-[13px] text-[#334D6E] font-medium mt-0.5 flex items-center gap-1">
                <span>Find affordable buses for your journey</span>
                <span className="text-sm">😊</span>
              </p>

              {/* Popular Route Pills */}
              <div className="flex items-center gap-1.5 mt-1.5 sm:mt-2 flex-wrap">
                <span className="text-[10px] sm:text-[10.5px] font-bold text-[#556987]">Popular:</span>
                <button
                  type="button"
                  onClick={() => handleSetQuickRoute('Kolkata', 'Esplanade / Babughat', 'Digha', 'Old Bus Stand')}
                  className="px-2 py-0.5 rounded-full bg-white/95 border border-[#CEDDF3] text-[10px] sm:text-[10.5px] font-bold text-[#082E78] hover:bg-[#EAF3FF] hover:border-[#104FBD] transition-all cursor-pointer shadow-xs"
                >
                  Kolkata → Digha
                </button>
                <button
                  type="button"
                  onClick={() => handleSetQuickRoute('Kolkata', 'Esplanade / Babughat', 'Siliguri', 'Old Bus Stand')}
                  className="px-2 py-0.5 rounded-full bg-white/95 border border-[#CEDDF3] text-[10px] sm:text-[10.5px] font-bold text-[#082E78] hover:bg-[#EAF3FF] hover:border-[#104FBD] transition-all cursor-pointer shadow-xs"
                >
                  Kolkata → Siliguri
                </button>
                <button
                  type="button"
                  onClick={() => handleSetQuickRoute('Kolkata', 'Esplanade / Babughat', 'Durgapur', 'City Centre')}
                  className="px-2 py-0.5 rounded-full bg-white/95 border border-[#CEDDF3] text-[10px] sm:text-[10.5px] font-bold text-[#082E78] hover:bg-[#EAF3FF] hover:border-[#104FBD] transition-all cursor-pointer shadow-xs"
                >
                  Kolkata → Durgapur
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION 2: MAIN 4-ROW BUS SEARCH CARD
            ========================================== */}
        <section
          ref={searchSectionRef}
          className="w-full relative z-30 px-4 sm:px-5 lg:px-[20px] -mt-[23px] mb-10"
        >
          <div className="max-w-[1220px] w-full mx-auto bg-white rounded-[23px] shadow-[0_10px_28px_rgba(11,61,146,0.08)] px-4 sm:px-5 pt-3.5 sm:pt-4 pb-3.5 sm:pb-4 border-[1.4px] border-[#D4E0EE]">
            <form onSubmit={handleTriggerSearch} className="flex flex-col gap-1.5 sm:gap-2">
              {/* Row 1: Origin and Destination with Searchable Dropdowns & Center Swap */}
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5 items-center">
                {/* FROM Container */}
                <div className="relative w-full" ref={fromContainerRef}>
                  <div
                    onClick={() => {
                      setFromDropdownOpen(!fromDropdownOpen);
                      setToDropdownOpen(false);
                      setCalendarOpen(false);
                      setTimeDropdownOpen(false);
                    }}
                    className={`h-[48px] sm:h-[50px] lg:h-[52px] bg-[#FBFCFF] border-[1.4px] transition-all rounded-[11px] sm:rounded-[12px] px-3 py-1 flex items-center justify-between shadow-xs cursor-pointer select-none ${fromDropdownOpen
                      ? 'border-[#0B3D92] ring-2 ring-[#0B3D92]/20 bg-white'
                      : 'border-[#D4E0EE] hover:border-[#0B3D92]'
                      }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-[30px] h-[30px] sm:w-[32px] sm:h-[32px] rounded-[8px] sm:rounded-[9px] bg-[#E8F1FC] text-[#0B3D92] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[8.5px] sm:text-[9px] text-[#556987] font-bold uppercase tracking-wider leading-tight">FROM</span>
                        <p className="text-[13.5px] sm:text-[14px] text-[#001B3E] font-extrabold truncate leading-tight">{fromCity}</p>
                        <p className="text-[9.5px] sm:text-[10px] text-[#64748B] font-medium truncate leading-tight">{fromSub}</p>
                      </div>
                    </div>
                    <span
                      className={`material-symbols-outlined text-[#556987] text-[18px] shrink-0 transition-transform duration-200 ${fromDropdownOpen ? 'rotate-180 text-[#0B3D92]' : ''
                        }`}
                    >
                      expand_more
                    </span>
                  </div>

                  {/* FROM Floating Dropdown */}
                  {fromDropdownOpen && (
                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 bg-white rounded-2xl shadow-2xl border-2 border-[#D0E4FF] p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 text-[#64748B] text-[20px]">
                          search
                        </span>
                        <input
                          type="text"
                          value={fromSearch}
                          onChange={(e) => setFromSearch(e.target.value)}
                          placeholder="Search Bengal departure city or stop..."
                          className="w-full pl-9 pr-4 py-2 text-sm bg-[#F1F5F9] rounded-xl border border-transparent focus:border-[#2058C5] focus:bg-white focus:outline-hidden text-[#001B3E] placeholder-[#64748B] font-medium"
                          autoFocus
                        />
                      </div>

                      {/* Popular Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 pb-1 border-b border-[#E2E8F0]">
                        <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mr-1">Popular:</span>
                        {['Kolkata', 'Durgapur', 'Siliguri', 'Asansol'].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              const found = BENGAL_CITIES.find((x) => x.city === c);
                              setFromCity(c);
                              if (found) setFromSub(found.terminal);
                              setFromDropdownOpen(false);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#EAF3FF] text-[#2058C5] hover:bg-[#2058C5] hover:text-white transition-colors cursor-pointer"
                          >
                            {c}
                          </button>
                        ))}
                      </div>

                      {/* City List */}
                      <div className="max-h-60 overflow-y-auto flex flex-col gap-1 pr-1">
                        {filteredFromCities.map((item) => (
                          <div
                            key={item.city}
                            onClick={() => {
                              setFromCity(item.city);
                              setFromSub(item.terminal);
                              setFromDropdownOpen(false);
                            }}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F0F3FF] cursor-pointer transition-colors group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-[#EAF3FF] group-hover:bg-[#082E78] group-hover:text-white text-[#2058C5] flex items-center justify-center transition-colors shrink-0">
                                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                              </div>
                              <div className="truncate text-left">
                                <span className="block font-bold text-sm text-[#001B3E] group-hover:text-[#082E78]">
                                  {item.city}
                                </span>
                                <span className="block text-xs text-[#64748B] truncate">{item.terminal}</span>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EAF3FF] text-[#2058C5] group-hover:bg-[#2058C5] group-hover:text-white shrink-0 ml-2">
                              {item.region}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Center Swap Button */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleSwap}
                    title="Swap departure and destination"
                    className="w-[34px] h-[34px] sm:w-[36px] sm:h-[36px] rounded-full bg-white border-[1.4px] border-[#CEDDF3] shadow-[0_2px_8px_rgba(11,61,146,0.12)] text-[#0B3D92] hover:bg-[#F2F7FD] hover:border-[#0B3D92] hover:shadow-[0_4px_12px_rgba(11,61,146,0.18)] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] sm:text-[19px] transition-transform duration-300 ${isSwapping ? 'rotate-180' : ''
                        }`}
                    >
                      sync_alt
                    </span>
                  </button>
                </div>

                {/* TO Container */}
                <div className="relative w-full" ref={toContainerRef}>
                  <div
                    onClick={() => {
                      setToDropdownOpen(!toDropdownOpen);
                      setFromDropdownOpen(false);
                      setCalendarOpen(false);
                      setTimeDropdownOpen(false);
                    }}
                    className={`h-[48px] sm:h-[50px] lg:h-[52px] bg-[#FBFCFF] border-[1.4px] transition-all rounded-[11px] sm:rounded-[12px] px-3 py-1 flex items-center justify-between shadow-xs cursor-pointer select-none ${toDropdownOpen
                      ? 'border-[#0B3D92] ring-2 ring-[#0B3D92]/20 bg-white'
                      : 'border-[#D4E0EE] hover:border-[#0B3D92]'
                      }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-[30px] h-[30px] sm:w-[32px] sm:h-[32px] rounded-[8px] sm:rounded-[9px] bg-[#FFF2E2] text-[#FF7900] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[8.5px] sm:text-[9px] text-[#556987] font-bold uppercase tracking-wider leading-tight">TO</span>
                        <p className="text-[13.5px] sm:text-[14px] text-[#001B3E] font-extrabold truncate leading-tight">{toCity}</p>
                        <p className="text-[9.5px] sm:text-[10px] text-[#64748B] font-medium truncate leading-tight">{toSub}</p>
                      </div>
                    </div>
                    <span
                      className={`material-symbols-outlined text-[#556987] text-[18px] shrink-0 transition-transform duration-200 ${toDropdownOpen ? 'rotate-180 text-[#0B3D92]' : ''
                        }`}
                    >
                      expand_more
                    </span>
                  </div>

                  {/* TO Floating Dropdown */}
                  {toDropdownOpen && (
                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 bg-white rounded-2xl shadow-2xl border-2 border-[#D0E4FF] p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3 text-[#64748B] text-[20px]">
                          search
                        </span>
                        <input
                          type="text"
                          value={toSearch}
                          onChange={(e) => setToSearch(e.target.value)}
                          placeholder="Search Bengal destination city or stop..."
                          className="w-full pl-9 pr-4 py-2 text-sm bg-[#F1F5F9] rounded-xl border border-transparent focus:border-[#FF7900] focus:bg-white focus:outline-hidden text-[#001B3E] placeholder-[#64748B] font-medium"
                          autoFocus
                        />
                      </div>

                      {/* Popular Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 pb-1 border-b border-[#E2E8F0]">
                        <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mr-1">Popular:</span>
                        {['Siliguri', 'Digha', 'Malda', 'Santiniketan'].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              const targetCity = c === 'Santiniketan' ? 'Bolpur / Santiniketan' : c;
                              const found = BENGAL_CITIES.find((x) => x.city.includes(targetCity));
                              setToCity(targetCity);
                              if (found) setToSub(found.terminal);
                              setToDropdownOpen(false);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#FFF0DF] text-[#FF7900] hover:bg-[#FF7900] hover:text-white transition-colors cursor-pointer"
                          >
                            {c}
                          </button>
                        ))}
                      </div>

                      {/* City List */}
                      <div className="max-h-60 overflow-y-auto flex flex-col gap-1 pr-1">
                        {filteredToCities.map((item) => (
                          <div
                            key={item.city}
                            onClick={() => {
                              setToCity(item.city);
                              setToSub(item.terminal);
                              setToDropdownOpen(false);
                            }}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FFF8F2] cursor-pointer transition-colors group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-[#FFF0DF] group-hover:bg-[#FF7900] group-hover:text-white text-[#FF7900] flex items-center justify-center transition-colors shrink-0">
                                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                              </div>
                              <div className="truncate text-left">
                                <span className="block font-bold text-sm text-[#001B3E] group-hover:text-[#FF7900]">
                                  {item.city}
                                </span>
                                <span className="block text-xs text-[#64748B] truncate">{item.terminal}</span>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FFF0DF] text-[#FF7900] group-hover:bg-[#FF7900] group-hover:text-white shrink-0 ml-2">
                              {item.region}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2: Date and Time Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5 items-center">
                {/* DATE CONTAINER & POPOVER */}
                <div className="relative w-full" ref={dateContainerRef}>
                  <div
                    onClick={() => {
                      setCalendarOpen(!calendarOpen);
                      setFromDropdownOpen(false);
                      setToDropdownOpen(false);
                      setTimeDropdownOpen(false);
                    }}
                    className={`h-[42px] sm:h-[44px] lg:h-[46px] bg-[#FBFCFF] border-[1.4px] transition-all rounded-[11px] sm:rounded-[12px] px-3 py-1 flex items-center justify-between shadow-xs cursor-pointer select-none ${calendarOpen
                      ? 'border-[#0B3D92] ring-2 ring-[#0B3D92]/20 bg-white'
                      : 'border-[#D4E0EE] hover:border-[#0B3D92]'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-[26px] h-[26px] sm:w-[28px] sm:h-[28px] rounded-[7px] bg-[#E8F1FC] text-[#0B3D92] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                      </div>
                      <div>
                        <span className="block text-[8px] sm:text-[8.5px] font-bold text-[#556987] uppercase tracking-wider leading-none">Date</span>
                        <span className="text-[12.5px] sm:text-[13px] font-extrabold text-[#001B3E] leading-tight">{formatDateDDMMYYYY(selectedDate)}</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#7A8EA8] text-[16px]">calendar_today</span>
                  </div>

                  {/* CALENDAR POPOVER */}
                  {calendarOpen && (
                    <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full sm:w-[360px] md:w-[380px] bg-white rounded-2xl shadow-2xl border-2 border-[#D0E4FF] p-4 flex flex-col gap-3.5 animate-in fade-in slide-in-from-top-2">
                      {/* Presets */}
                      <div className="flex items-center gap-1.5 pb-2.5 border-b border-[#E2E8F0] overflow-x-auto no-scrollbar">
                        <button
                          type="button"
                          onClick={() => handleDatePreset('today')}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#EAF3FF] text-[#2058C5] hover:bg-[#2058C5] hover:text-white transition-colors shrink-0 cursor-pointer"
                        >
                          Today
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDatePreset('tomorrow')}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#EAF3FF] text-[#2058C5] hover:bg-[#2058C5] hover:text-white transition-colors shrink-0 cursor-pointer"
                        >
                          Tomorrow
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDatePreset('plus2')}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#EAF3FF] text-[#2058C5] hover:bg-[#2058C5] hover:text-white transition-colors shrink-0 cursor-pointer"
                        >
                          +2 Days
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDatePreset('weekend')}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#FFF0DF] text-[#FF7900] hover:bg-[#FF7900] hover:text-white transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">weekend</span> Weekend
                        </button>
                      </div>

                      {/* Month Header */}
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-[#001B3E]">
                            {MONTH_NAMES[displayedMonth]} {displayedYear}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E3F8F5] text-[#0A5832]">
                            Fares from ₹180
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            aria-label="Previous Month"
                            onClick={handlePrevMonth}
                            className="w-8 h-8 rounded-lg hover:bg-[#F0F3FF] text-[#001B3E] flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                          </button>
                          <button
                            type="button"
                            aria-label="Next Month"
                            onClick={handleNextMonth}
                            className="w-8 h-8 rounded-lg hover:bg-[#F0F3FF] text-[#001B3E] flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                          </button>
                        </div>
                      </div>

                      {/* Day Names */}
                      <div className="grid grid-cols-7 text-center text-[11px] font-bold text-[#64748B] pt-1">
                        <span>Su</span>
                        <span>Mo</span>
                        <span>Tu</span>
                        <span>We</span>
                        <span>Th</span>
                        <span>Fr</span>
                        <span>Sa</span>
                      </div>

                      {/* Dynamic Days Grid */}
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {/* Leading padding */}
                        {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                          <div
                            key={`lead-${idx}`}
                            className="h-11 flex flex-col items-center justify-center text-xs text-[#CBD5E1] font-medium cursor-not-allowed select-none"
                          >
                            <span>{daysInPreviousMonth - firstDayOfWeek + idx + 1}</span>
                          </div>
                        ))}

                        {/* Month Days */}
                        {Array.from({ length: daysInCurrentMonth }).map((_, idx) => {
                          const dayNum = idx + 1;
                          const cellDate = new Date(displayedYear, displayedMonth, dayNum);
                          const isSelected =
                            selectedDate.getFullYear() === displayedYear &&
                            selectedDate.getMonth() === displayedMonth &&
                            selectedDate.getDate() === dayNum;
                          const isWeekend = cellDate.getDay() === 0 || cellDate.getDay() === 6;
                          const fare = dayNum % 3 === 0 ? '₹180' : dayNum % 2 === 0 ? '₹220' : '₹250';
                          const isBestFare = fare === '₹180';

                          return (
                            <button
                              key={`day-${dayNum}`}
                              type="button"
                              onClick={() => {
                                setSelectedDate(cellDate);
                                setCalendarOpen(false);
                              }}
                              className={`h-11 rounded-xl font-medium flex flex-col items-center justify-center relative transition-all cursor-pointer ${isSelected
                                ? 'bg-[#001A50] text-white font-bold shadow-md scale-105 z-10'
                                : `hover:bg-[#EAF3FF] hover:border hover:border-[#D0E4FF] text-[#001B3E] ${isWeekend ? 'bg-[#FAFCFF]' : ''
                                }`
                                }`}
                            >
                              <span className={`text-xs leading-none ${isSelected ? 'font-bold' : ''}`}>
                                {dayNum}
                              </span>
                              <span
                                className={`text-[9px] mt-0.5 leading-none ${isSelected
                                  ? 'text-[#FF7900] font-bold'
                                  : isBestFare
                                    ? 'text-[#059669] font-bold'
                                    : 'text-[#64748B]'
                                  }`}
                              >
                                {fare}
                              </span>
                              {isBestFare && !isSelected && (
                                <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                              )}
                            </button>
                          );
                        })}

                        {/* Trailing padding */}
                        {Array.from({ length: trailingCells }).map((_, idx) => (
                          <div
                            key={`trail-${idx}`}
                            className="h-11 flex flex-col items-center justify-center text-xs text-[#CBD5E1] font-medium cursor-not-allowed select-none"
                          >
                            <span>{idx + 1}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Hint */}
                      <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span className="w-2 h-2 rounded-full bg-[#10B981]" /> Lowest fares
                        </span>
                        <span
                          onClick={() => handleDatePreset('today')}
                          className="text-[#2058C5] font-semibold cursor-pointer hover:underline"
                        >
                          Jump to Today
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* TIME CONTAINER */}
                <div className="relative w-full" ref={timeContainerRef}>
                  <div
                    onClick={() => {
                      setTimeDropdownOpen(!timeDropdownOpen);
                      setFromDropdownOpen(false);
                      setToDropdownOpen(false);
                      setCalendarOpen(false);
                    }}
                    className={`h-[42px] sm:h-[44px] lg:h-[46px] bg-[#FBFCFF] border-[1.4px] transition-all rounded-[11px] sm:rounded-[12px] px-3 py-1 flex items-center justify-between shadow-xs cursor-pointer select-none ${timeDropdownOpen
                      ? 'border-[#0B3D92] ring-2 ring-[#0B3D92]/20 bg-white'
                      : 'border-[#D4E0EE] hover:border-[#0B3D92]'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-[26px] h-[26px] sm:w-[28px] sm:h-[28px] rounded-[7px] bg-[#FFF2E2] text-[#FF7900] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                      </div>
                      <div>
                        <span className="block text-[8px] sm:text-[8.5px] font-bold text-[#556987] uppercase tracking-wider leading-none">Time</span>
                        <span className="text-[12.5px] sm:text-[13px] font-extrabold text-[#001B3E] leading-tight">{selectedTime}</span>
                      </div>
                    </div>
                    <span
                      className={`material-symbols-outlined text-[#556987] text-[18px] transition-transform duration-200 ${timeDropdownOpen ? 'rotate-180' : ''
                        }`}
                    >
                      expand_more
                    </span>
                  </div>

                  {timeDropdownOpen && (
                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 bg-white rounded-2xl shadow-xl border-2 border-[#D0E4FF] p-2 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2">
                      {TIME_OPTIONS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setSelectedTime(slot);
                            setTimeDropdownOpen(false);
                          }}
                          className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${selectedTime === slot
                            ? 'bg-[#082E78] text-white'
                            : 'text-slate-700 hover:bg-[#EAF3FF] hover:text-[#082E78]'
                            }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Row 3: Max Budget Full-Width Horizontal Panel */}
              <div className="h-[38px] sm:h-[40px] lg:h-[42px] rounded-[10px] sm:rounded-[11px] bg-[#E7F7F3] border-[1.2px] border-[#B8E5D9] px-3 sm:px-4 flex items-center justify-between gap-2.5 sm:gap-4 shadow-xs">
                {/* Left: Label & Current Value */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-[24px] h-[24px] rounded-[6px] bg-[#2BB673]/20 text-[#0F6155] flex items-center justify-center font-black text-[13px] shadow-xs">
                    ₹
                  </div>
                  <div>
                    <span className="block text-[7.5px] sm:text-[8px] font-extrabold text-[#0F6155] uppercase tracking-wider leading-none">
                      MAX BUDGET
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-[14px] sm:text-[15px] text-[#082E78] font-[900] tracking-tight leading-none">
                        ₹{budget.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] sm:text-[9.5px] text-[#0F6155] font-semibold leading-none">per seat</span>
                    </div>
                  </div>
                </div>

                {/* Center: Interactive Slider */}
                <div className="flex-1 flex items-center gap-2 max-w-xl">
                  <span className="text-[10px] sm:text-[10.5px] font-bold text-[#145A4C] shrink-0">₹200</span>
                  <div className="relative flex-1 flex items-center">
                    <input
                      type="range"
                      min="200"
                      max="2500"
                      step="50"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      style={{
                        background: `linear-gradient(to right, #FF7900 0%, #FF7900 ${((budget - 200) / (2500 - 200)) * 100
                          }%, #374151 ${((budget - 200) / (2500 - 200)) * 100}%, #374151 100%)`,
                      }}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#FF7900] focus:outline-hidden"
                    />
                  </div>
                  <span className="text-[10px] sm:text-[10.5px] font-bold text-[#145A4C] shrink-0">₹2,500</span>
                </div>

                {/* Right: Friendly Pill Badge */}
                <div className="shrink-0 flex items-center">
                  <div className="inline-flex items-center gap-1 bg-[#D1F2E8] border border-[#A2DFCE] text-[#0B6B58] font-bold text-[10px] sm:text-[10.5px] px-2 py-0.5 rounded-[12px] shadow-xs">
                    <span className="material-symbols-outlined text-[13px]">eco</span>
                    <span>Budget Friendly</span>
                  </div>
                </div>
              </div>

              {/* Row 4: Search Button */}
              <button
                type="submit"
                className="h-[38px] sm:h-[40px] lg:h-[42px] rounded-[10px] sm:rounded-[11px] bg-gradient-to-r from-[#104FBD] to-[#062E79] hover:from-[#0B44A8] hover:to-[#042055] text-white text-[14px] sm:text-[14.5px] font-[800] flex items-center justify-center gap-2 shadow-[0_3px_10px_rgba(11,61,146,0.2)] hover:shadow-[0_5px_15px_rgba(11,61,146,0.28)] transition-all duration-200 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">search</span>
                <span className="tracking-wide">Search Buses</span>
              </button>
            </form>
          </div>
        </section>

        {/* ==========================================
            SECTION 3: EXPLORE MORE (5 PASTEL CARDS)
            ========================================== */}
        <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-10 mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#102B51] tracking-tight">✨ Explore More</h2>
            </div>
            <a
              href="#routes"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('popular-journeys')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm text-[#0B4DBB] font-bold hover:underline flex items-center gap-1"
            >
              View All <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Card 1: Popular Routes */}
            <div
              onClick={() => document.getElementById('popular-journeys')?.scrollIntoView({ behavior: 'smooth' })}
              className="group bg-[#EAF3FF] hover:bg-[#DEEDFF] p-4 rounded-2xl transition-all duration-200 flex flex-col justify-between shadow-xs border border-[#D0E4FF] cursor-pointer"
            >
              <img
                className="w-full h-24 object-cover rounded-xl mb-3 group-hover:scale-105 transition-transform duration-300"
                src={exploreBus}
                alt="Popular Bengal Bus Routes"
              />
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white shadow-xs text-[#2058C5] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[18px]">alt_route</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#102B51]">Popular Routes</h3>
                  <p className="text-[11px] text-[#444651] line-clamp-1">Across Bengal</p>
                </div>
              </div>
              <div className="flex justify-end pt-2 border-t border-[#D0E4FF]/60">
                <div className="w-6 h-6 rounded-full bg-white text-[#0B4DBB] flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </div>
              </div>
            </div>

            {/* Card 2: Best Deals */}
            <div
              onClick={() => {
                setBudget(400);
                searchSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group bg-[#FFF0DF] hover:bg-[#FFE5C7] p-4 rounded-2xl transition-all duration-200 flex flex-col justify-between shadow-xs border border-[#FFE1BF] cursor-pointer"
            >
              <img
                className="w-full h-24 object-cover rounded-xl mb-3 group-hover:scale-105 transition-transform duration-300"
                src={exploreVoucher}
                alt="Best Bus Travel Deals and Vouchers"
              />
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white shadow-xs text-[#FF7900] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[18px]">savings</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#102B51]">Best Deals</h3>
                  <p className="text-[11px] text-[#444651] line-clamp-1">Save with vouchers</p>
                </div>
              </div>
              <div className="flex justify-end pt-2 border-t border-[#FFE1BF]/60">
                <div className="w-6 h-6 rounded-full bg-white text-[#FF7900] flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </div>
              </div>
            </div>

            {/* Card 3: Nearby Stops */}
            <div
              onClick={() => {
                setFromDropdownOpen(true);
                searchSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group bg-[#EFF6FF] hover:bg-[#E0EEFF] p-4 rounded-2xl transition-all duration-200 flex flex-col justify-between shadow-xs border border-[#D5E6FF] cursor-pointer"
            >
              <img
                className="w-full h-24 object-cover rounded-xl mb-3 group-hover:scale-105 transition-transform duration-300"
                src={exploreStop}
                alt="Nearby Kolkata Bus Stops and Shelter"
              />
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white shadow-xs text-[#2058C5] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[18px]">pin_drop</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#102B51]">Nearby Stops</h3>
                  <p className="text-[11px] text-[#444651] line-clamp-1">Verified boarding</p>
                </div>
              </div>
              <div className="flex justify-end pt-2 border-t border-[#D5E6FF]/60">
                <div className="w-6 h-6 rounded-full bg-white text-[#2058C5] flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </div>
              </div>
            </div>

            {/* Card 4: Quick Book */}
            <div
              onClick={() => handleTriggerSearch()}
              className="group bg-[#E3F8F5] hover:bg-[#D1F2ED] p-4 rounded-2xl transition-all duration-200 flex flex-col justify-between shadow-xs border border-[#C2EFE9] cursor-pointer"
            >
              <img
                className="w-full h-24 object-cover rounded-xl mb-3 group-hover:scale-105 transition-transform duration-300"
                src={exploreQr}
                alt="Quick Book Instant Bus Ticket QR Code"
              />
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white shadow-xs text-[#00A896] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#102B51]">Quick Book</h3>
                  <p className="text-[11px] text-[#444651] line-clamp-1">Fast confirmed seats</p>
                </div>
              </div>
              <div className="flex justify-end pt-2 border-t border-[#C2EFE9]/60">
                <div className="w-6 h-6 rounded-full bg-white text-[#00A896] flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </div>
              </div>
            </div>

            {/* Card 5: Student Special */}
            <div
              onClick={() => document.getElementById('student-special')?.scrollIntoView({ behavior: 'smooth' })}
              className="group bg-[#F0EAFF] hover:bg-[#E4D8FF] p-4 rounded-2xl transition-all duration-200 flex flex-col justify-between shadow-xs border border-[#E0D0FF] col-span-2 sm:col-span-1 cursor-pointer"
            >
              <img
                className="w-full h-24 object-cover rounded-xl mb-3 group-hover:scale-105 transition-transform duration-300"
                src={exploreStudents}
                alt="College Students with Bengal Bus Passes"
              />
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white shadow-xs text-[#7C3AED] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[18px]">school</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#102B51]">Student Special</h3>
                  <p className="text-[11px] text-[#444651] line-clamp-1">Campus routes, save!</p>
                </div>
              </div>
              <div className="flex justify-end pt-2 border-t border-[#E0D0FF]/60">
                <div className="w-6 h-6 rounded-full bg-white text-[#7C3AED] flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION 4: POPULAR JOURNEYS (4 DESKTOP CORRIDORS)
            ========================================== */}
        <section id="popular-journeys" className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-10 mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#102B51]">Popular Journeys</h2>
              <p className="text-xs md:text-sm text-[#64748B]">Bengal&apos;s most-traveled commuter and weekend corridors</p>
            </div>
            <a
              href="#routes"
              onClick={(e) => {
                e.preventDefault();
                navigate('/results');
              }}
              className="text-sm text-[#0B4DBB] font-bold hover:underline flex items-center gap-1"
            >
              View All Routes <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Kolkata to Digha */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-[#DCE8F7] flex flex-col group">
              <div className="relative h-44 overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtRBjYUYkdrc3QoOxLn7sCNiL_jUet0hi18_ibWNaj_HYvtxGpcF4GGHDe-Po3vyILJ370yGP5b_IfI03WNfeBKIqAAruBBeL4ipyqk4x_5qZ17n75tty60lXsimNmM3-uuSAehY-M9hWx5fUnmjtHn1i7PgiuXwMbd_dEF6yi2hvMZq2g2gmuy1ba27suLgHngXRFeqIu0ZwKzicqeLq1Zt1r7aJnnh5xnq8v4yI"
                  alt="Digha Coastline"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#FF7900] font-bold text-xs px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">beach_access</span> 4 hrs 15 min
                </span>
                <span className="absolute bottom-3 right-3 bg-[#082E78] text-white text-xs font-bold px-2 py-0.5 rounded-md">
                  From ₹220
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
                    <span className="material-symbols-outlined text-[16px] text-[#2058C5]">explore</span>
                    <span>Coastal Escape</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#102B51] mt-1">Kolkata → Digha</h3>
                  <p className="text-xs text-[#64748B] mt-1">Direct AC Volvo &amp; non-AC express buses every 30 mins from Esplanade.</p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#F0F3FF] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0F6155] bg-[#E3F8F5] px-2 py-0.5 rounded">34 Daily Buses</span>
                  <button
                    type="button"
                    onClick={() => handleSetQuickRoute('Kolkata', 'Esplanade / Babughat', 'Digha', 'Old Bus Stand')}
                    className="w-8 h-8 rounded-full bg-[#EAF3FF] text-[#0B4DBB] flex items-center justify-center hover:bg-[#082E78] hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Kolkata to Siliguri */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-[#DCE8F7] flex flex-col group">
              <div className="relative h-44 overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaQL2MS3qcXidg5enI6f5CjGGY8FeTl2dnOmJZ1okQ9XI8ESHnTBt6TzavJAEGb2LZRvgeAqVuCg7AJkwFKI6DlD4QbVywqlzgT8gLCTCkbszgLnuNv4-lJ5MXZ6nBJJ8Cp5rihgkQjOd_m5AivRcAye4UcRrqsx8cVJdmZ6IE4_qe7Hau1Qgnq2CohYY6-wSIBoczg57XelmLHMUzNSaSNwm09fu_HMb7Hz45TZM"
                  alt="Siliguri Tea Hills"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#2058C5] font-bold text-xs px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">landscape</span> Overnight 12 hrs
                </span>
                <span className="absolute bottom-3 right-3 bg-[#082E78] text-white text-xs font-bold px-2 py-0.5 rounded-md">
                  From ₹750
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
                    <span className="material-symbols-outlined text-[16px] text-[#2058C5]">filter_drama</span>
                    <span>Gateway to Hills</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#102B51] mt-1">Kolkata → Siliguri</h3>
                  <p className="text-xs text-[#64748B] mt-1">Multi-axle Volvo &amp; BharatBenz sleeper luxury buses from Babughat.</p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#F0F3FF] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0F6155] bg-[#E3F8F5] px-2 py-0.5 rounded">48 Daily Buses</span>
                  <button
                    type="button"
                    onClick={() => handleSetQuickRoute('Kolkata', 'Esplanade / Babughat', 'Siliguri', 'Tenzing Norgay Bus Terminus')}
                    className="w-8 h-8 rounded-full bg-[#EAF3FF] text-[#0B4DBB] flex items-center justify-center hover:bg-[#082E78] hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Kolkata to Durgapur */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-[#DCE8F7] flex flex-col group">
              <div className="relative h-44 overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDel_Un8HzgMqZNWlwULF2WS5my6Vfbn22L8mgpGME_bOPNCsRarJO0YMk1dgIsrK5UQWyIf-R5XVWobOF4fWAKY9jHrthog8KjSrt1rxt9XcpRuNjgf3U1iVNfUrDlzGaDthrDD_2VCmTKOw4-MXa-lyUaB94dhkWkxDsLtLKezHGpQe5rOwCu_cwC4II-H2HtsJTlLXEHSTYzS2WRMyndo-aRJGmuKPKQJt8KKbI"
                  alt="Durgapur Highway"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#FF7900] font-bold text-xs px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">bolt</span> Express 3 hrs
                </span>
                <span className="absolute bottom-3 right-3 bg-[#082E78] text-white text-xs font-bold px-2 py-0.5 rounded-md">
                  From ₹180
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
                    <span className="material-symbols-outlined text-[16px] text-[#2058C5]">factory</span>
                    <span>Industrial Corridor</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#102B51] mt-1">Kolkata → Durgapur</h3>
                  <p className="text-xs text-[#64748B] mt-1">Hourly AC electric shuttle coaches via Durgapur Expressway (NH 19).</p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#F0F3FF] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0F6155] bg-[#E3F8F5] px-2 py-0.5 rounded">52 Daily Buses</span>
                  <button
                    type="button"
                    onClick={() => handleSetQuickRoute('Kolkata', 'Esplanade / Babughat', 'Durgapur', 'City Centre Bus Terminus')}
                    className="w-8 h-8 rounded-full bg-[#EAF3FF] text-[#0B4DBB] flex items-center justify-center hover:bg-[#082E78] hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 4: Kolkata to Malda */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-[#DCE8F7] flex flex-col group">
              <div className="relative h-44 overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcSoXlbXujDyos2DPBK0P7cQqaBaaz3U1PKi6pJesok2sJK_2bj4zp5gwXnNdR5296hSFX8piUk-o1F_pdK_mq2WMAZvYw68Tjd_MPHhry91MCgBSWH68TA9n2xlNrbcW8SxJ6YkkRy1xubHKA_6-yCJfSbrtgteM9-gS6lEYTmnMoKDfnDkWuoe7_Mjl5JFhC2qn8443DmvIqtJN3lq5If0FomhXCYbVOKd4LWSo"
                  alt="Malda Heritage"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#2058C5] font-bold text-xs px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">history_edu</span> 7 hrs 30 min
                </span>
                <span className="absolute bottom-3 right-3 bg-[#082E78] text-white text-xs font-bold px-2 py-0.5 rounded-md">
                  From ₹340
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
                    <span className="material-symbols-outlined text-[16px] text-[#2058C5]">temple_hindu</span>
                    <span>Heritage &amp; Mango City</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#102B51] mt-1">Kolkata → Malda</h3>
                  <p className="text-xs text-[#64748B] mt-1">Smooth overnight and day services connecting south and north Bengal.</p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#F0F3FF] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0F6155] bg-[#E3F8F5] px-2 py-0.5 rounded">26 Daily Buses</span>
                  <button
                    type="button"
                    onClick={() => handleSetQuickRoute('Kolkata', 'Esplanade / Babughat', 'Malda', 'Rathbari Terminus')}
                    className="w-8 h-8 rounded-full bg-[#EAF3FF] text-[#0B4DBB] flex items-center justify-center hover:bg-[#082E78] hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION 5: BENEFITS BANNER (DEEP NAVY)
            ========================================== */}
        <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-10 my-8">
          <div className="bg-[#082E78] text-white rounded-2xl p-8 lg:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-[#2058C5]/20 pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-[#FF7900]/10 pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Benefit 1 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 text-[#FF7900] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px]">verified_user</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Reliable &amp; Safe</h4>
                  <p className="text-xs text-blue-100 leading-relaxed mt-1">
                    100% verified operators, vetted captains &amp; live GPS track sharing.
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 text-[#FF7900] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px]">flash_on</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Easy Booking</h4>
                  <p className="text-xs text-blue-100 leading-relaxed mt-1">
                    Reserve in under 60 seconds with instant WhatsApp and SMS m-ticket.
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 text-[#FF7900] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px]">sell</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Great Value</h4>
                  <p className="text-xs text-blue-100 leading-relaxed mt-1">
                    Zero convenience surprises, fair rates &amp; cashback rewards on every trip.
                  </p>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 text-[#FF7900] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px]">support_agent</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Help When You Need It</h4>
                  <p className="text-xs text-blue-100 leading-relaxed mt-1">
                    24/7 dedicated Bengali &amp; English commuter support on call.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION 6: HOW BUSSATHI WORKS
            ========================================== */}
        <section className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <div className="text-center max-w-lg mx-auto mb-10">
            <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#102B51]">⚙️ How BusSathi Works</h2>
            <p className="text-xs md:text-sm text-[#64748B] mt-1.5">Commute effortlessly in three straightforward steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-[#DCE8F7] shadow-xs hover:shadow-md transition-shadow relative flex flex-col items-start">
              <div className="w-10 h-10 rounded-full bg-[#FF7900] text-white font-extrabold flex items-center justify-center text-base mb-4 shadow-md shadow-[#FF7900]/25">
                1
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#EAF3FF] text-[#082E78] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[24px]">map</span>
              </div>
              <h3 className="text-lg font-bold text-[#102B51]">Choose Your Route</h3>
              <p className="text-xs md:text-sm text-[#64748B] mt-2 leading-relaxed">
                Select departure and destination cities across Bengal. Easily switch pickup points with one tap.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-[#DCE8F7] shadow-xs hover:shadow-md transition-shadow relative flex flex-col items-start">
              <div className="w-10 h-10 rounded-full bg-[#FF7900] text-white font-extrabold flex items-center justify-center text-base mb-4 shadow-md shadow-[#FF7900]/25">
                2
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#FFF0DF] text-[#FF7900] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[24px]">tune</span>
              </div>
              <h3 className="text-lg font-bold text-[#102B51]">Set Preferences</h3>
              <p className="text-xs md:text-sm text-[#64748B] mt-2 leading-relaxed">
                Pick your preferred travel date, boarding slot, and slide your max budget to match your wallet.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-[#DCE8F7] shadow-xs hover:shadow-md transition-shadow relative flex flex-col items-start">
              <div className="w-10 h-10 rounded-full bg-[#FF7900] text-white font-extrabold flex items-center justify-center text-base mb-4 shadow-md shadow-[#FF7900]/25">
                3
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#E3F8F5] text-[#00A896] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[24px]">check_circle</span>
              </div>
              <h3 className="text-lg font-bold text-[#102B51]">Find Your Ride</h3>
              <p className="text-xs md:text-sm text-[#64748B] mt-2 leading-relaxed">
                Browse verified operators, select your window or aisle seat, and get instant confirmed e-tickets.
              </p>
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION 7: STUDENT TRAVEL SPECIAL
            ========================================== */}
        <section id="student-special" className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-10 my-8">
          <div className="rounded-2xl bg-gradient-to-r from-[#FFF7ED] to-[#FFEDD5] border border-[#FED7AA] p-8 md:p-10 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left Content */}
            <div className="flex-1 max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEDD5] border border-[#FDBA74] text-[#C2410C] font-semibold text-xs mb-3">
                <span className="material-symbols-outlined text-[16px]">school</span>
                <span>College &amp; University Pass</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#7C2D12]">Student Travel Special</h2>
              <p className="text-sm md:text-base text-[#9A3412] mt-2 font-medium">
                Go further for less! Exclusive concessions on university routes across West Bengal. Present college ID and
                save up to 40% every month.
              </p>
            </div>

            {/* Center Graphic */}
            <div className="shrink-0 flex items-center justify-center gap-3 bg-white/70 backdrop-blur-xs px-6 py-4 rounded-xl border border-[#FED7AA]">
              <div className="w-12 h-12 rounded-xl bg-[#FF7900] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">luggage</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[#102B51]">Flat ₹150 OFF</p>
                <p className="text-xs text-[#64748B]">
                  Code: <span className="font-mono font-bold text-[#FF7900]">CAMPUSCOMMUTE</span>
                </p>
              </div>
            </div>

            {/* Right Action Button */}
            <div className="shrink-0">
              <button
                type="button"
                onClick={() => {
                  setCopilotOpen(true);
                  handleCopilotSend('How do I apply for the 40% student pass?');
                }}
                className="inline-flex items-center gap-2 bg-[#FF7900] hover:bg-[#E06A00] text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Explore Student Offers</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* ==========================================
            SECTION 8: FREQUENTLY ASKED QUESTIONS (FAQ)
            ========================================== */}
        <section id="faq-section" className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-10 py-12 mb-16">
          <div className="text-center max-w-lg mx-auto mb-8">
            <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#102B51]">Frequently Asked Questions (FAQ)</h2>
            <p className="text-xs md:text-sm text-[#64748B] mt-1.5">Everything you need to know about riding with BusSathi</p>
          </div>

          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {[
              {
                id: 1,
                question: 'How do I book a bus ticket on BusSathi?',
                answer:
                  'Booking is effortless: enter your departure city, destination, and travel date above. Filter by timing or your maximum budget, choose your favorite seat layout, and finalize your booking using UPI, cards, or net banking. You will receive an instant confirmation SMS & WhatsApp m-ticket.',
              },
              {
                id: 2,
                question: 'Can I change or cancel my booking?',
                answer:
                  'Yes, tickets can be rescheduled or cancelled up to 2 hours prior to scheduled departure. Cancellation refund policies vary per bus operator, and your refund is automatically processed back to your original payment source within 24-48 hours.',
              },
              {
                id: 3,
                question: 'What payment methods are available?',
                answer:
                  'We accept all major payment modes including Google Pay, PhonePe, Paytm, all UPI apps, Rupay/Visa/Mastercard debit and credit cards, and internet banking from all recognized Indian banks with zero hidden handling fees.',
              },
              {
                id: 4,
                question: 'Is it safe to book on BusSathi?',
                answer:
                  'Completely safe. All bus operators on BusSathi are government-licensed and verified. Our platform provides 256-bit encrypted transactions, dedicated women’s seat reservation options, and real-time live bus GPS shareable links for family members.',
              },
            ].map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div key={faq.id} className="bg-white border border-[#DCE8F7] rounded-xl overflow-hidden shadow-xs transition-all">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-[#F0F3FF]/50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-bold text-[#102B51]">{faq.question}</span>
                    <span
                      className={`material-symbols-outlined text-[#0B4DBB] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                    >
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-[#444651] leading-relaxed border-t border-[#F0F3FF]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* ==========================================
          FOOTER (DEEP NAVY)
          ========================================== */}
      <footer className="w-full bg-[#082E78] text-white">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-10 pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-white/10">
            {/* Col 1 */}
            <div className="lg:col-span-1 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white font-bold">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect height="13" rx="3" width="18" x="3" y="6" />
                    <path d="M3 11h18" />
                    <circle cx="7" cy="15" fill="#FF7900" r="1.5" stroke="none" />
                    <circle cx="17" cy="15" fill="#FF7900" r="1.5" stroke="none" />
                  </svg>
                </div>
                <span className="text-lg text-white tracking-tight font-bold">BusSathi</span>
              </div>
              <p className="text-xs text-[#FF7900] font-semibold">Travel Smart. Pay Less.</p>
              <p className="text-xs text-blue-100 leading-relaxed">
                Reliable intercity and suburban smart bus travel across Bengal.
              </p>
            </div>

            {/* Col 2 */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-white">Company</h3>
              <div className="flex flex-col gap-2 text-xs text-blue-100">
                <a href="#about" className="hover:text-white transition-colors">About Us</a>
                <a href="#careers" className="hover:text-white transition-colors">Careers</a>
                <a href="#contact" className="hover:text-white transition-colors">Contact Us</a>
              </div>
            </div>

            {/* Col 3 */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-white">Plan Your Trip</h3>
              <div className="flex flex-col gap-2 text-xs text-blue-100">
                <a
                  href="#search"
                  onClick={(e) => {
                    e.preventDefault();
                    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Search Buses
                </a>
                <a
                  href="#routes"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('popular-journeys')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Popular Routes
                </a>
                <a
                  href="#offers"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('student-special')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Offers &amp; Deals
                </a>
              </div>
            </div>

            {/* Col 4 */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-white">Help &amp; Support</h3>
              <div className="flex flex-col gap-2 text-xs text-blue-100">
                <a
                  href="#faq"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </a>
                <a href="#help" className="hover:text-white transition-colors">Booking Help</a>
                <a href="#support" className="hover:text-white transition-colors">Customer Support</a>
              </div>
            </div>

            {/* Col 5 */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-white">Useful Links</h3>
              <div className="flex flex-col gap-2 text-xs text-blue-100">
                <a href="#terms" className="hover:text-white transition-colors">Terms &amp; Conditions</a>
                <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#sitemap" className="hover:text-white transition-colors">Sitemap</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-6 gap-4">
            <p className="text-xs text-blue-100 text-center md:text-left">
              © 2025 BusSathi Technologies Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#001A50] text-white flex items-center justify-center hover:bg-[#2058C5] transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">campaign</span>
              </span>
              <span className="w-8 h-8 rounded-full bg-[#001A50] text-white flex items-center justify-center hover:bg-[#2058C5] transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">language</span>
              </span>
              <span className="w-8 h-8 rounded-full bg-[#001A50] text-white flex items-center justify-center hover:bg-[#2058C5] transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">alternate_email</span>
              </span>
              <span className="w-8 h-8 rounded-full bg-[#001A50] text-white flex items-center justify-center hover:bg-[#2058C5] transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">forum</span>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ==========================================
          DEDICATED SATHI COPILOT SLIDE-OVER DRAWER (VARIANT 3)
          ========================================== */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${copilotOpen ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setCopilotOpen(false)}
          className={`fixed inset-0 bg-[#001A50]/40 backdrop-blur-xs transition-opacity duration-300 cursor-pointer ${copilotOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        />

        {/* Slide-over Drawer Panel */}
        <aside
          className={`fixed top-0 right-0 bottom-0 w-full max-w-[440px] bg-white shadow-2xl flex flex-col transition-transform duration-300 pointer-events-auto border-l border-[#D0E4FF] ${copilotOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* Drawer Header */}
          <div className="bg-gradient-to-r from-[#001A50] via-[#082E78] to-[#2058C5] text-white p-4 flex items-center justify-between shadow-md relative overflow-hidden shrink-0">
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#FF7900]/20 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs">
                <span className="material-symbols-outlined text-[24px] text-[#FF7900]">smart_toy</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-white tracking-tight">Sathi AI Concierge</h3>
                  <span className="text-[10px] font-extrabold bg-[#FF7900] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                    v2.4
                  </span>
                </div>
                <p className="text-[11px] text-[#A7D7CE] flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  Live Bengal Fleet Data Connected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 relative z-10">
              <button
                type="button"
                onClick={() => setCopilotOpen(false)}
                title="Minimize"
                className="w-8 h-8 rounded-lg hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">remove</span>
              </button>
              <button
                type="button"
                onClick={() => setCopilotOpen(false)}
                title="Close"
                className="w-8 h-8 rounded-lg hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* Quick Sub-bar */}
          <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-4 py-2 flex items-center justify-between text-xs text-[#475569] shrink-0">
            <span className="flex items-center gap-1 font-semibold text-[#2058C5]">
              <span className="material-symbols-outlined text-[16px]">electric_bolt</span> Fast Assistant
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCopilotChat([
                    {
                      id: `cleared-${Date.now()}`,
                      sender: 'bot',
                      text: 'Chat cleared. How else can I assist your Bengal bus journey today?',
                    },
                  ])
                }
                className="hover:text-[#001B3E] font-medium transition-colors hover:underline text-[11px] cursor-pointer"
              >
                Clear Chat
              </button>
              <span className="text-[#CBD5E1]">|</span>
              <span className="text-[11px] bg-[#E3F8F5] text-[#0A5832] font-bold px-2 py-0.5 rounded-full">
                24x7 Ready
              </span>
            </div>
          </div>

          {/* Message Stream */}
          <div
            ref={chatStreamRef}
            className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 bg-gradient-to-b from-[#F8FAFC] to-white"
          >
            {copilotChat.map((msg) => {
              if (msg.sender === 'user') {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="bg-[#082E78] text-white rounded-2xl rounded-tr-xs p-3 text-xs leading-relaxed max-w-[85%] shadow-xs">
                      {msg.text}
                    </div>
                  </div>
                );
              }

              if (msg.isDeal) {
                return (
                  <div key={msg.id} className="flex gap-2.5 items-start max-w-[96%]">
                    <div className="w-7 h-7 rounded-lg bg-[#082E78] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[16px]">recommend</span>
                    </div>
                    <div className="bg-gradient-to-br from-[#FFF8F2] to-white rounded-2xl rounded-tl-xs p-3.5 shadow-xs border border-[#FED7AA] text-xs leading-relaxed">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-extrabold text-[#7C2D12] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-[#FF7900]">trending_up</span>
                          Trending Deal Right Now
                        </span>
                        <span className="bg-[#FF7900] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Overnight
                        </span>
                      </div>
                      <p className="font-bold text-sm text-[#001B3E]">Kolkata → Siliguri (AC Sleeper)</p>
                      <p className="text-[#64748B] mt-0.5 text-[11px]">Departs 8:00 PM • Babughat • 94% on-time</p>
                      <div className="mt-2.5 pt-2 border-t border-[#FED7AA]/60 flex items-center justify-between">
                        <span className="text-lg text-[#082E78] font-black">₹750</span>
                        <button
                          type="button"
                          onClick={() => {
                            handleSetQuickRoute('Kolkata', 'Esplanade / Babughat', 'Siliguri', 'Tenzing Norgay Bus Terminus');
                            setCopilotOpen(false);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#FF7900] hover:bg-[#E06A00] text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                        >
                          Quick Apply <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex gap-2.5 items-start max-w-[92%]">
                  <div className="w-7 h-7 rounded-lg bg-[#082E78] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-xs border border-[#DCE8F7] text-xs text-[#001B3E] leading-relaxed whitespace-pre-line">
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Suggested Prompts */}
          <div className="px-3 py-2 border-t border-[#E2E8F0] bg-white shrink-0">
            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5 px-1">Suggested Prompts</p>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <button
                type="button"
                onClick={() => handleCopilotSend('Compare AC vs Non-AC routes')}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#EAF3FF] hover:bg-[#2058C5] hover:text-white text-[#2058C5] transition-colors whitespace-nowrap shrink-0 border border-[#D0E4FF] cursor-pointer"
              >
                Compare AC vs Non-AC
              </button>
              <button
                type="button"
                onClick={() => handleCopilotSend('How do I apply for the 40% student pass?')}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#FFF0DF] hover:bg-[#FF7900] hover:text-white text-[#FF7900] transition-colors whitespace-nowrap shrink-0 border border-[#FFE1BF] cursor-pointer"
              >
                40% student pass
              </button>
              <button
                type="button"
                onClick={() => handleCopilotSend('What is the luggage allowance policy?')}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#E3F8F5] hover:bg-[#00A896] hover:text-white text-[#00A896] transition-colors whitespace-nowrap shrink-0 border border-[#C2EFE9] cursor-pointer"
              >
                Luggage policy
              </button>
              <button
                type="button"
                onClick={() => handleCopilotSend('Find cheapest buses under ₹300')}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#F0EAFF] hover:bg-[#7C3AED] hover:text-white text-[#7C3AED] transition-colors whitespace-nowrap shrink-0 border border-[#E0D0FF] cursor-pointer"
              >
                Cheapest &lt; ₹300
              </button>
            </div>
          </div>

          {/* Drawer Input Box */}
          <div className="p-3 bg-white border-t border-[#DCE8F7] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCopilotSend();
              }}
              className="flex items-center gap-2 bg-[#F1F5F9] border border-[#CBD5E1] rounded-2xl px-3 py-1.5 focus-within:border-[#2058C5] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2058C5]/20 transition-all"
            >
              <button
                type="button"
                onClick={handleVoiceToggle}
                title="Voice Input"
                className={`transition-colors p-1 rounded-lg flex items-center justify-center cursor-pointer ${isVoiceActive ? 'text-[#FF7900]' : 'text-[#64748B] hover:text-[#082E78]'
                  }`}
              >
                <span className="material-symbols-outlined text-[20px]">mic</span>
              </button>
              <input
                type="text"
                autoComplete="off"
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                placeholder={isVoiceActive ? 'Listening for your voice... (say route or query)' : 'Ask Sathi (e.g. buses to Digha this evening)...'}
                className="flex-1 bg-transparent border-0 outline-hidden text-xs text-[#001B3E] placeholder-[#64748B] py-1.5"
              />
              <button
                type="submit"
                aria-label="Send Message"
                className="w-8 h-8 rounded-xl bg-[#082E78] hover:bg-[#FF7900] text-white flex items-center justify-center transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
            <div className="flex items-center justify-between text-[10px] text-[#64748B] px-1 mt-1.5">
              <span>Instant response • AI transit model</span>
              <span className="flex items-center gap-1 text-[#059669] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Sathi Active
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HomePage;
