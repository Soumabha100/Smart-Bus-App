# OneGoBus — Complete Agent Handoff & Technical Context Document

> **Target Audience:** Incoming AI Agent / Developer working in VS Code.  
> **Repository:** `West Bengal AI Smart Bus Booking Platform (OneGoBus)`  
> **Active Git Branch:** `feature/onego-theme-auth-ui`  
> **Timestamp:** November 2026

---

## 1. Pinned Architecture & Core Rules (STRICT — Never Violate)
Consult [`AGENTS.md`](file:///Users/soumabhamajumder/Documents/Projects/AI-Smart-Bus-Application/AGENTS.md) for full details:
1. **Official Brand:** **OneGoBus** (all older names like Roamly, BusWise, BusSathi, ApnaBus are strictly deprecated).
2. **Frontend Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide-React (`lucide-react`), TanStack Query, shadcn/ui.
3. **Backend Stack:** Java 25 (LTS), Spring Boot 4.1.x with Virtual Threads, PostgreSQL 18 with `pgvector` (Neon), Redis (Upstash) for 7-minute atomic seat locks. *Do not modify backend unless explicitly requested.*
4. **Dependency Guardrail:** Never add any Maven dependency or npm package without explicit user permission. Zero heavy animation packages (no Framer Motion or Lottie) — strictly hardware-accelerated CSS keyframes.
5. **Color & Theme System:** Strict **Light Mode exclusively**. Dark mode is deferred.
   - Canvas / Surface: `#FBF9F5` / `#FFF8F1`
   - Brand Navy: `#0B2341`
   - Primary Accent Orange: `#FC7728` / `#A04100`
   - Ink Strong / Muted: `#000D21` / `#44474E`
   - Glass System: `@utility glass` in `frontend/src/index.css` (`--glass-bg`, `--glass-border`, `--glass-blur`).
6. **Privacy & AI Agent Guardrails:** No PII transmitted to LLMs. Spring AI is propose-only; seat confirmation and payment require user-confirmed REST calls.

---

## 2. Chronological Evolution & Iterations (What We Did)

### Phase A: Initial 3D Illustrated Seats & RedBus Modal Expansion
- **Request:** Replace standard seat boxes with 3D PNG seat images across available, selected, booked, unavailable, and women-only statuses.
- **Feedback & Issues:**
  - PNG seat graphics were non-scalable, blurry, caused letter overlap inside seat cushions, and weighed over 2MB.
  - The modal was small, capped at 1240px, and contained separate internal scrollbars for both Lower Deck and Upper Deck.
  - RedBus reference was provided: RedBus uses a wide modal (~90–95% viewport width) with single-page unified modal scrolling.

### Phase B: Minimalist & Clean Redesign
- **Request:** Remove messy seat numbers from the static state. Show seat numbers only when selected. Expand Lower and Upper Decks to full page height without internal scrollbars.
- **Bug Fix:** Google Material Symbols font failed on `sports_steering_wheel`, rendering the text literal `_STEERING_WHEEL`. Fixed by creating a pure inline 3-spoke automotive bus steering wheel SVG icon (`DriverSteeringWheelIcon`).

### Phase C: Full Aesthetic Overhaul to Premium Glassmorphism (ChatGPT / Teammate Design)
- **Reference Artwork:**
  - `media_1795106338124_5f35e1c0.jpg`: Premium glassmorphism 3-column modal layout.
  - `media_1795106743426_9d9dd3f2.png`: Transparent Volvo luxury coach bus (`onego-luxury-coach.png`).
  - `media_1795108385802_cd4c6ada.jpg`: Sunrise Howrah Bridge photographic background (`howrah-bridge-sunrise.jpg`).
- **Elimination of Raster PNGs:**
  - Completely deleted all 6 legacy raster PNG seat files (`General_Seat*.png`).
  - Implemented `BusSeat.tsx` as a pure vector circular armchair component (~40px diameter) matching the exact reference.
  - Standardized seat colors:
    - **Available:** Background `#DDF6DD`, Border `#A8DDAA`, Icon `#276749`
    - **Selected:** Background `#FC7728`, Border `#E6651D`, Icon `#FFFFFF`
    - **Booked:** Background `#E4E1E5`, Border `#C6C2C9`, Icon `#77747D`
    - **Women only:** Background `#F8D1DF`, Border `#EFA9BF`, Icon `#934C67`
- **Unified 3-Column Glassmorphism Layout:**
  - **Left Column:** Blended sunrise Howrah Bridge photographic background (`blur(2px)` and `opacity: 0.45`), crisp foreground Volvo coach (`z-10`), and Journey Details frosted glass card (`Kolkata ➔ Siliguri`, departure/arrival times, amenities).
  - **Middle Column:** Segmented Deck Switcher (`Lower Deck` / `Upper Deck`), `Upper Deck 18 Seats Available` pill, 36-seat bus chassis container with driver cabin at the top, sequential seating, and bottom status legend.
  - **Right Column:** Dynamic booking summary card (`Your Seats`, connected station timeline for boarding/dropping, dynamic fare calculation, and `Continue ➔` CTA).

### Phase D: Background Scroll Lock & Zero Cumulative Layout Shift (CLS = 0)
- **Problem:** When opening the modal, scrolling the mouse scrolled the search results page behind it.
- **Fix:** Added scroll lock in `SeatSelectionModal.tsx` that calculates `scrollbarWidth = window.innerWidth - document.documentElement.clientWidth`, sets `document.body.style.overflow = 'hidden'`, and applies `paddingRight` compensation to prevent layout shift. Cleanly restores on modal close.

### Phase E: Interactive Polish, Transitions & Dynamic Pricing
1. **Red Close Button on Hover:**
   - Top-right close button turns rose-red on hover (`hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:shadow-rose-500/25 hover:scale-110 active:scale-95 duration-200 ease-in-out`).
   - Inner `X` icon smoothly rotates 90 degrees (`group-hover/close:rotate-90 transition-transform duration-200`).
2. **Smooth Open/Close Hardware-Accelerated Transitions:**
   - Pure CSS `@keyframes modalScaleIn`, `modalScaleOut`, `modalBackdropFadeIn`, `modalBackdropFadeOut` in `frontend/src/index.css`.
   - Added internal `isClosing` state in `SeatSelectionModal.tsx` with a 200ms ease-out animation before calling `onClose()`.
   - Zero external libraries; instant 60fps responsiveness across mobile and desktop.
3. **Dynamic Pricing & Strikethrough Higher Price:**
   - Derived directly from `ticket.price` on the search result card.
   - Dynamically calculates total fare based on selected seats (e.g. ₹749 base seat, ₹861 sleeper berth).
   - Displays strikethrough original higher price (`₹{totalOriginalPrice}`), highlighted discounted fare (`₹{totalPrice}`), green "Save ₹{totalSavings}" badge, and "Best price guarantee" notice.
4. **Removable Seat Chips & Station Timeline:**
   - Interactive seat chips in "Your Seats" summary with 1-click removal (`[ L2 ✕ ]` `[ L3 ✕ ]`).
   - Vertical connected route timeline between Boarding Point and Dropping Point with dashed indicator lines.
5. **State Architecture Refactoring:**
   - Eliminated `useEffect` state syncing that triggered React 19 linter cascading render warnings.
   - State uses a single `selectedSeatIds: string[]` with `selectedSeats` purely derived via `useMemo`.
   - Handlers wrapped in `useCallback`.

### Phase F: Complete User Authentication Lifecycle, Reactive Profile Dropdown & Glassmorphic Profile Page (Phase 23)
1. **Seamless Sign-In & Registration Redirects**:
   - `LoginPage.tsx` & `RegisterPage.tsx` authenticate users and redirect immediately back to the home page (`/`) with zero page reloads.
2. **Reactive Navigation Bar & Profile Avatar Dropdown**:
   - Replaces "Sign In" and "Register" buttons in `Navbar.tsx` with a 40px circular profile avatar button with live online status pip.
   - Fallback to uppercase two-letter initials on navy gradient when avatar photo is absent.
   - Interactive glassmorphic dropdown popup with click-away listener and Escape key dismiss.
   - Menu items: `My Profile` (`/profile`), `My Bookings / Trips` (`/results`), `Preferences & Settings` (`/profile#settings`), and `Sign Out` (rose-red hover, clears session, redirects to `/`).
   - `MobileMenu.tsx` fully synchronized with mobile profile preview and sign-out controls.
3. **Dedicated OneGoBus Profile Page (`ProfilePage.tsx`)**:
   - Mounted at lazy-loaded route `/profile` protected by `<ProtectedRoute>`.
   - Hero Card with Howrah Bridge ambient background blur, 96px avatar with photo change toggle, role badges (`Verified Traveler`, `Student Privilege Pass`), and trip counters.
   - Sub-Tabs: Personal Information (editable with save toast), Travel & Seat Preferences, DPDP 2025 Privacy (JSON data download), Security & Active Sessions.
4. **Clean Context Separation (Vite React Fast Refresh Compliant)**:
   - Split into `authContextInstance.ts`, `AuthContext.tsx`, and `useAuth.ts` to satisfy 100% strict ESLint rules.

### Phase G: Pixel-Accurate One Go Bus Footer Rebuild (Phase 24)
1. **Section One — Dark Navy CTA Banner**:
   - Background `#0B2341`, corner radius `26px`, height ~220px, orange uppercase tag `MADE FOR MOVING` (`#FC7728`), ExtraBold white heading `Your next journey starts here.`, and soft white description.
   - Minimalist route illustration: location pin, curved route path with orange waypoint node, and white bus icon.
   - White pill CTA button `Find buses →` navigating to `/results`.
2. **Section Two — 5-Column Navigation Grid**:
   - Navy rounded-square bus emblem + `One Go ` (Navy) `Bus` (Orange) wordmark.
   - 3 light-neutral square buttons (`#F5F3EF`) for Instagram, LinkedIn, and GitHub.
   - 4 Link columns: `EXPLORE`, `COMPANY`, `SUPPORT`, `GET IN TOUCH` (Kolkata location pin + `Contact our team` button).
3. **Section Three — Newsletter Subscription**:
   - Orange envelope icon, `Get route updates`, email input, and navy `#0B2341` `Subscribe` button with validation feedback.
4. **Section Four — Bottom Footer Bar with Kolkata Skyline Line-Art**:
   - Dynamic year copyright, legal links (`Privacy Policy` • `Terms of Service` • `Accessibility`).
   - Delicate light-gray vector line-art depicting Victoria Memorial and the Howrah Bridge cantilever truss.
   - Semibold `Made for West Bengal` with orange heart.

---

## 3. Current File Structure & Key Code References

| File Path | Description & Role |
| :--- | :--- |
| [`frontend/src/context/AuthContext.tsx`](file:///Users/soumabhamajumder/Documents/Projects/AI-Smart-Bus-Application/frontend/src/context/AuthContext.tsx) | Reactive AuthProvider component syncing auth state across windows and localStorage. |
| [`frontend/src/context/useAuth.ts`](file:///Users/soumabhamajumder/Documents/Projects/AI-Smart-Bus-Application/frontend/src/context/useAuth.ts) | Custom React hook providing `user`, `isAuthenticated`, `login`, `logout`, and `updateUser`. |
| [`frontend/src/pages/ProfilePage.tsx`](file:///Users/soumabhamajumder/Documents/Projects/AI-Smart-Bus-Application/frontend/src/pages/ProfilePage.tsx) | Complete light-mode glassmorphic traveler profile view with Personal Information, Travel Preferences, and Security controls. |
| [`frontend/src/components/layout/Navbar.tsx`](file:///Users/soumabhamajumder/Documents/Projects/AI-Smart-Bus-Application/frontend/src/components/layout/Navbar.tsx) | Floating pill navbar with responsive profile circle avatar button and glassmorphic dropdown. |
| [`frontend/src/components/layout/MobileMenu.tsx`](file:///Users/soumabhamajumder/Documents/Projects/AI-Smart-Bus-Application/frontend/src/components/layout/MobileMenu.tsx) | Responsive mobile drawer with authenticated user banner and sign-out action. |
| [`frontend/src/features/results/SeatSelectionModal.tsx`](file:///Users/soumabhamajumder/Documents/Projects/AI-Smart-Bus-Application/frontend/src/features/results/SeatSelectionModal.tsx) | The primary full-screen seat booking modal component (3 columns, glassmorphism, dynamic pricing, animations). |
| [`frontend/src/components/ui/BusSeat.tsx`](file:///Users/soumabhamajumder/Documents/Projects/AI-Smart-Bus-Application/frontend/src/components/ui/BusSeat.tsx) | Pure circular vector armchair seat component with top-down SVG rendering and 5 status themes. |
| [`frontend/src/features/results/TicketCard.tsx`](file:///Users/soumabhamajumder/Documents/Projects/AI-Smart-Bus-Application/frontend/src/features/results/TicketCard.tsx) | Individual bus search result card that opens the modal via "Select Seats". |
| [`frontend/src/index.css`](file:///Users/soumabhamajumder/Documents/Projects/AI-Smart-Bus-Application/frontend/src/index.css) | Design tokens (`--glass-surface`, `--onego-navy`, `--onego-orange`), keyframe animations (`modalScaleIn`, `modalBackdropFadeIn`), and glass utility classes. |
| [`frontend/src/assets/howrah-bridge-sunrise.jpg`](file:///Users/soumabhamajumder/Documents/Projects/AI-Smart-Bus-Application/frontend/src/assets/howrah-bridge-sunrise.jpg) | High-res photographic sunrise background of Howrah Bridge behind the bus (201 KB). |
| [`frontend/src/assets/onego-luxury-coach.png`](file:///Users/soumabhamajumder/Documents/Projects/AI-Smart-Bus-Application/frontend/src/assets/onego-luxury-coach.png) | High-res transparent PNG of OneGoBus Volvo luxury coach bus (498 KB). |
| [`docs/PROJECT_LOG.md`](file:///Users/soumabhamajumder/Documents/Projects/AI-Smart-Bus-Application/docs/PROJECT_LOG.md) | Exhaustive sprint & phase changelog (Phases 1 through 23). |

---

## 4. Key Component Interfaces & State

### `SeatSelectionModalProps`
```typescript
interface SeatSelectionModalProps {
  isOpen: boolean;
  ticket: BusTicket;
  origin: string;
  destination: string;
  onClose: () => void;
  onConfirmBooking: (ticket: BusTicket, selectedSeats: SelectedSeatInfo[]) => void;
}

export interface SelectedSeatInfo {
  id: string;
  deck: 'lower' | 'upper';
  price: number;
  type: string;
}
```

### Core Dynamic Pricing Calculation in `SeatSelectionModal.tsx`
```typescript
const basePrice = ticket.price || 749;
const isSleeperBus = ticket.busType?.toLowerCase().includes('sleeper') ?? true;
const sleeperPrice = isSleeperBus ? basePrice : Math.round(basePrice * 1.15);

// Selected seat IDs state
const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(['L2', 'L3']);

// Derived selected seats with dynamic pricing
const selectedSeats: SelectedSeatInfo[] = useMemo(() => {
  return selectedSeatIds.map((id) => {
    const isUpper = id.startsWith('U');
    return {
      id,
      deck: isUpper ? 'upper' : 'lower',
      price: isUpper ? sleeperPrice : basePrice,
      type: isUpper ? 'Upper Deck Berth' : 'Executive Seater',
    };
  });
}, [selectedSeatIds, basePrice, sleeperPrice]);

const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);
const totalOriginalPrice = Math.round(totalPrice * 1.25);
const totalSavings = totalOriginalPrice - totalPrice;
```

---

## 5. Verification & Test Commands
Always verify with the following commands:
- **Build Verification:**
  ```bash
  npm --prefix frontend run build
  ```
  *(Expected: Passes in ~250–350ms with 0 errors across 21 chunks).*
- **Lint Verification:**
  ```bash
  npm --prefix frontend run lint
  ```
  *(Expected: 0 errors, 0 warnings).*

---

## 6. Next Steps & Recommended Follow-up Tasks for the New Agent
1. **Passenger Details Integration:** Connect the "Continue →" button from `SeatSelectionModal` to Step 3 (Passenger Information input form and seat assignment).
2. **Upstash Redis Hold Integration:** Wire up the 7-minute atomic seat lock API (`POST /api/v1/seats/hold`) when the user selects seats.
3. **Boarding / Dropping Point Selector:** Allow users to choose their preferred boarding and dropping points from a radio/dropdown selector in Step 2 of the booking flow.
4. **Mobile Responsiveness Optimization:** Verify and tweak the 3-column desktop layout into a fluid single-column bottom sheet layout on viewport widths `< 768px`.
