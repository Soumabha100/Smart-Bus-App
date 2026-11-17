# Roamly Project Log

## Phase 0 - Discover (2026-11-13)
- **Files Read & Audited**:
  - `AGENTS.md`, `README.md`, `docs/PROJECT_LOG.md`
  - `backend/pom.xml`, `backend/src/main/java/com/smartbus/config/SecurityConfig.java`, `backend/src/main/resources/application.yml`
  - `docker-compose.yml`, `.github/workflows/ci.yml`
  - `frontend/package.json`, `frontend/src/api/systemApi.ts`
- **Design Source Audited**:
  - `docs/design/stitch/01-onboarding.html`
  - `docs/design/stitch/02-login.html`
  - `docs/design/stitch/03-register.html`
  - `docs/design/stitch/04-home.html`
  - `docs/design/stitch/05-results.html`
- **Decisions & Alignments**:
  - Discovered 5 core pages from Stitch project `14492966675348031117` and mapped them to routes (`/`, `/login`, `/register`, `/home`, `/results`).
  - Extracted comprehensive design tokens for colors, typography (`Sora`, `Inter`), spacing, border radius (24px and pills), shadows, and CSS/SVG animations.
  - Planned shared UI components (`<JourneyLine />`, `<PillButton />`, `<GlassCard />`, `<Input />`, `<Chip />`, `<BottomBar />`, `<PerforatedTicket />`, `<ProtectedRoute />`).
  - Identified backend auth scope (`POST /api/auth/register`, `POST /api/auth/login`) with Flyway `V2__create_users.sql` and mock data scope for search & results.
- **Risks & Mitigation**:
  - Dependency guardrail from `AGENTS.md`: explicit permission required for npm/maven packages.
  - CI pipeline compatibility: `.github/workflows/ci.yml` checks React 19 build; keeping frontend compatible with React 19 ensures CI remains green.

## Phase 1 - Frontend Foundation (2026-11-13)
- **Files Changed**:
  - `frontend/package.json`, `frontend/package-lock.json`: Added `react-router-dom`, `react-hook-form`, `zod`, `@hookform/resolvers`, and `axios`.
  - `frontend/index.html`: Loaded Google Fonts (`Sora:wght@400;500;600;700`, `Inter:wght@400;500;600;700`) and Material Symbols Outlined.
  - `frontend/tailwind.config.js`: Defined complete design token dictionary (`midnight`, `cream`, `coral`, `teal`, time themes, font families, radius 24px, pill, tap targets).
  - `frontend/src/index.css`: Linked `@theme` tokens, glassmorphism utilities, perforated ticket styles, reduced-motion accessibility media queries.
  - `frontend/src/hooks/useTimeTheme.ts`: Implemented dynamic time-of-day theme hook supporting morning (peach/gold), evening (violet/deep blue), and night (midnight navy/teal).
  - `frontend/src/components/ui/JourneyLine.tsx`: Handcrafted glowing SVG route component with scenic tea hill backdrops, waypoint beads, and bus silhouette.
  - `frontend/src/components/ui/PillButton.tsx`: Reusable capsule CTA with pulse indicator, hover flare, and min 48px tap target.
  - `frontend/src/components/ui/GlassCard.tsx`: Translucent container with 24px radius, backdrop blur, and glow variants.
  - `frontend/src/components/ui/Input.tsx`: Accessible input with React Hook Form `forwardRef`, leading icons, and password show/hide eye toggle.
  - `frontend/src/components/ui/Chip.tsx`: Interactive mood and date selector chips.
  - `frontend/src/components/ui/BottomBar.tsx`: Floating bottom navigation with elevated center "Go" button.
  - `frontend/src/components/ui/PerforatedTicket.tsx`: Rounded ticket stub with dual edge cutouts, tear perforation, comfort tags, and dynamic "Best for you" glow badge.
  - `frontend/src/components/ui/index.ts`: Central export hub for UI components.
- **Decisions & Why**:
  - Configured tokens in both `tailwind.config.js` and `@theme` in `index.css` to ensure full interoperability across Tailwind v4 build tooling.
  - Implemented `PerforatedTicket` using physical circular cutout notches (`-ml-3` and `-mr-3`) combined with dashed border styling for guaranteed cross-browser consistency without clipping box-shadows.

## Phase 2 - Routing Skeleton (2026-11-13)
- **Files Changed**:
  - `frontend/src/utils/tokenStorage.ts`: Created JWT and session state storage manager with typed retrieval.
  - `frontend/src/components/auth/ProtectedRoute.tsx`: Built auth guard that routes unauthorized travelers to `/login` preserving origin intent.
  - `frontend/src/pages/OnboardingPage.tsx`: Initialized route `/`.
  - `frontend/src/pages/LoginPage.tsx`: Initialized route `/login`.
  - `frontend/src/pages/RegisterPage.tsx`: Initialized route `/register`.
  - `frontend/src/pages/HomePage.tsx`: Initialized protected route `/home`.
  - `frontend/src/pages/ResultsPage.tsx`: Initialized protected route `/results`.
  - `frontend/src/pages/NotFoundPage.tsx`: Initialized 404 handler for unmatched routes.
  - `frontend/src/pages/SystemStatusPage.tsx`: Preserved Sprint 0 walking skeleton health check at `/system-status`.
  - `frontend/src/pages/index.ts`: Central barrel exports for all page views.
  - `frontend/src/App.tsx`: Wired `BrowserRouter`, `Routes`, and route guards.

## Phase 3 - Screens 1 & 2 High-Fidelity Conversion (2026-11-13)
- **Files Changed**:
  - `frontend/src/pages/OnboardingPage.tsx`: High-fidelity Onboarding screen faithful to `01-onboarding.html`.
  - `frontend/src/pages/LoginPage.tsx`: Complete Traveler Login screen matching `02-login.html`.

## Phase 4 - Screen 3: Progressive Form with RHF & Zod (2026-11-13)
- **Files Changed**:
  - `frontend/src/schemas/authSchema.ts`: Created validation schemas for registration and login.
  - `frontend/src/pages/RegisterPage.tsx`: Built interactive 3-step progressive account creation interface.

## Desktop-First Responsive Transformation (2026-11-13)
- **Files Changed**:
  - `frontend/src/components/layout/Navbar.tsx`: Created a sticky, full-width desktop navigation bar with brand emblem, route navigation links (`Explore Routes`, `Find Buses`, `System Health`), traveler profile with initials badge, and authentication action buttons.
  - `frontend/src/components/ui/BottomBar.tsx`: Configured with `md:hidden` so that the mobile floating capsule navigation bar is hidden on tablet and desktop viewports, appearing only on mobile (<768px).
  - `frontend/src/pages/HomePage.tsx`:
    - Replaced narrow mobile wrapper with responsive `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
    - Transformed "Plan your line" into a wide horizontal booking control card: Origin circle card (KOL / Kolkata), JourneyLine connector with swap button, Destination circle card (DAR / Darjeeling), date selector chips, travel mood chips, and primary "Find Buses" button.
    - Converted "Journeys people love" into a multi-column desktop grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`).
  - `frontend/src/pages/ResultsPage.tsx`:
    - Integrated `<Navbar />` and structured into a desktop 2-column layout (sidebar filters + results timeline feed).
    - Added sorting (recommended, price low to high, rating, earliest departure) and live mood filtering.
    - Added seat reservation confirmation modal with DPDP compliance details.
  - `frontend/src/components/ui/PerforatedTicket.tsx`:
    - Re-engineered into a physical boarding pass on desktop: horizontal layout (`md:flex`) with main ticket details on the left, vertical dashed perforation with top/bottom circular cutouts, and a dedicated stub on the right containing fare, seat availability dots, and reserve seat action.
  - `frontend/src/pages/OnboardingPage.tsx`:
    - Transformed into a majestic 12-column desktop hero layout (Left: brand story, typography, mosaic feature cards, CTAs; Right: scenic mountain landscape with glowing SVG Journey Line, hilltop bus marker, and live trail badge).
  - `frontend/src/pages/LoginPage.tsx` & `frontend/src/pages/RegisterPage.tsx`:
    - Transformed into balanced 2-column desktop layouts (`max-w-7xl mx-auto`, 12-column grid) with visual context on the left and form cards on the right.
- **Decisions & Why**:
  - Leveraged available desktop canvas (`1440px`, `1280px`, `1366px`) with `max-w-7xl` to prevent artificial mobile-width bottlenecks on desktop.
  - Retained strict mobile responsiveness (`320px–767px`) with zero horizontal overflow via fluid flex/grid layouts.
  - Fixed ESLint assignment warning in `Chip.tsx` and validated with `npm run lint` and `npm run build`.


## Collaboration Protocol - Two-Developer Architecture (2026-11-13)
- **Status**: Formally Adopted
- **Core Principles**:
  1. Respect Existing Work: Never modify or delete another developer's work unnecessarily (e.g., preserving `com.smartbus.system`, `systemApi.ts`, `SystemStatusPage.tsx`).
  2. Feature-Based Organization:
     - Frontend: Features modularized into clean feature folders (`src/features/auth`, `src/features/booking`, `src/features/journey`, `src/features/system`, with shared primitives in `src/components/ui` and `src/components/layout`).
     - Backend: Feature packages isolated (`com.smartbus.system`, `com.smartbus.auth`, etc.).
  3. Strict Separation of Concerns: Clear API boundaries between frontend and backend.
  4. Single Monorepo Root: No duplicate project structures or redundant application entry points.
  5. Shared Component Reuse: Maximize reuse of UI kit (`JourneyLine`, `PillButton`, `GlassCard`, `Input`, `Chip`, `PerforatedTicket`, `BottomBar`).
  6. Git & Branch Safety: Work confined to assigned feature branches; no branch overwrites, forced merges, or destructive git rebases without explicit agreement.
  7. File Preservation: No files deleted without verifying imports and runtime dependencies.
  8. Scoped Feature Work: Modifications limited strictly to the assigned feature scope.
  9. Continuous Documentation: All changes, decisions, and problem resolutions logged in `docs/PROJECT_LOG.md`.
  10. Integration Path: Changes integrated via Git branches and GitHub Pull Requests.

## Phase 5 - Replacement of HomePage with Stitch AI Travel Intelligence Dashboard (2026-11-13)
- **Stitch Design ID**: `8136311009390191591` ("ROAMLY — AI Travel Intelligence Dashboard")
- **Files Modified**:
  - `frontend/src/pages/HomePage.tsx`: Completely replaced the obsolete HomePage visual implementation with the new Stitch AI Travel Intelligence Dashboard layout while maintaining existing route `/home`, auth guard integration (`ProtectedRoute`), and user session handling (`tokenStorage`).
- **Layout & Components Implemented**:
  1. **Top Fixed Navigation Header**:
     - Modern ROAMLY logo with bus insignia.
     - Navigation items: `Dashboard` (active tab), `Route Planning` (scrolls to planner), `My Bookings` (navigates to `/results`), `AI Assistant` (opens Copilot drawer), and `Risk Reports` (scrolls to intelligence panel).
     - Live indicator: `AI Engine Online` badge with pulsing teal dot.
     - Interactive Notifications popover showcasing live radar and vehicle status alerts.
     - Traveler Profile avatar with initial badge, user email display, and one-click Sign Out action.
  2. **Telemetry Context Ribbon**:
     - Telemetry Workspace / Bengal Transit Radar `v4.8 Predictive` breadcrumb.
     - High-speed NH12/NH19 Sensor Array indicator with 12ms live sync pulse.
  3. **Three-Column Desktop Grid** (`1440px` target canvas):
     - **Left Column (`lg:col-span-3`) - Smart Route Planner**:
       - Predictive Engine header with Adaptive badge.
       - Terminus inputs for Origin (Esplanade Terminus) and Destination (Tenzing Norgay Terminus) with swap button.
       - Depart Date & Depart Time selectors with calendar/clock glyphs.
       - Reach-by Deadline (`08:30 AM Next Day`, "Target Met").
       - Interactive Max Budget Cap range slider (₹800 to ₹3,500) with dynamic currency formatting.
       - Bus specification fleet filter chips (`Volvo Multi-Axle Sleeper`, `BharatBenz Seater`, `Electric Luxury`).
       - Primary CTA `Find Smart Routes` navigating to `/results` with selected query parameters.
       - Computed routes and timetable fit telemetry helper.
     - **Central Column (`lg:col-span-6`) - AI Recommended Journey**:
       - Header banner with continuous telemetry rerouting badge and `98.4% Match Score`.
       - Operator card: Greenline Volvo B11R 9600 with verified badge, Tier-1 fleet status, and 4.9 rating.
       - Timeline node display: Kolkata departure (07:45 PM), duration (11h 45m, 584 km via NH12 bypass), and Siliguri arrival (07:30 AM).
       - Sleek route node bar with Malda Midnight Hub 30-minute rest stop.
       - Fare card: ₹1,450 (Best Value, ₹1,700 avg strikethrough), 7 Lower Berths Left pulsing alert, and onboard amenity tags.
       - AI validation metric tiles: 99.1% On-Time, 19% Savings, +60m Headroom.
       - AI Synthesis Reasoning card explaining the Farakka-Raiganj bypass time savings and dual-driver midnight rotation.
       - Primary CTA `View Journey & Select Berths` wired directly to `/results`.
     - **Right Column (`lg:col-span-3`) - Travel Intelligence Panel**:
       - Live Telemetry radar header.
       - En Route Micro-Climates: temperature and visibility across Kolkata (28°C Clear), Farakka (24°C Mist), and Siliguri (21°C Crisp) with zero precipitation guarantee.
       - Route Disruption Radar: NH12 Dalkhola Bypass delay alert (+14m delay auto-compensated in timetable) and Farakka Barrage smooth flow report.
       - Operator Telemetry Index: Safety 9.8/10, Fleet Age 1.2 yr, Punctuality 96.8%.
       - Quality & Security Checklist: Highway Security Patrol 24/7, Rest Stop Hygiene Grade A+, 94% Smooth Asphalt.
       - Terminal advisory for Friday exodus peak.
  4. **Full-Width Interactive Regional Transit Map**:
     - Header bar with corridor legend (Primary Active, Express Highway, Slow Corridor) and filter toggles (All Corridors, Live Fleet, Risk Hotspots).
     - Responsive SVG topology showing West Bengal transit geometry: Hooghly/Ganges river, NH19 western corridor, NH114A coastal corridor, and NH12 North-South corridor.
     - Glowing rotating hubs for Kolkata and Siliguri, animated active bus particle, and intermediate hub nodes (Digha, Durgapur, Asansol, Malda, Darjeeling).
     - Floating dynamic cards for Siliguri Gateway Hub (21°C, NH10 Open) and Esplanade Central (Gate 03).
     - Interactive map controls (Zoom In, Zoom Out, Reset Center).
  5. **Interactive "Ask ROAMLY" AI Copilot**:
     - Floating capsule action button in bottom right corner.
     - Interactive AI chat drawer providing immediate simulated guidance for sleeper berth queries, rest stop amenities, highway delays, and ticket advice.
  6. **Telemetry Footer**:
     - ROAMLY AI Predictive Travel Telemetry status and Global Radar Node #402-A metadata.
- **Design System Fidelity**:
  - Main background `#0B1020`, Sidebar `#111827`, Card `#192235`, Secondary Card `#202B40`.
  - Primary coral `#FF8066`, Secondary teal `#19C6B5` / `#42DCCA`, Mint `#75E5D0`.
  - Typography: `Sora` for headings/metrics, `Inter` for body/labels.
  - Border radius: 16px/24px rounded cards, pill chips, 12px inputs.
- **Verification**:
  - `npm run build` executed successfully (`tsc -b && vite build` bundled with 0 errors).
  - `npm run lint` executed successfully (0 errors).
  - Preserved all other pages, components, backend infrastructure, and two-developer collaboration rules.

## Phase 6 - Implementation of Roamly Smart Bus Journey Planner Stitch Design (2026-11-13)
- **Stitch Design ID**: `11128684862382041494` ("Roamly - Smart Bus Journey Planner")
- **Design Theme**: Nocturne Transit (`#0D1320` canvas, `#FF6B4A` primary coral, `#43EDCD` / `#00D2B4` radiant teal, `Sora` & `Inter` typography).
- **Files Modified**:
  - `frontend/src/pages/HomePage.tsx`: Faithfully implemented the updated Stitch homepage design in a single responsive component supporting both Desktop (1440 × 1024) and Mobile (390 × 844) viewports.
- **Components & Features Implemented**:
  1. **Fixed Navigation Bar (`h-20`)**:
     - Brand insignia with glowing bus emblem, "Roamly" heading, and "VOYAGE SYSTEMS" tracking subtitle.
     - Desktop links: `Book Journeys` (active elevated state), `Live Tracker`, `Explore Routes`, `My Bookings`, and `Offers`.
     - Mobile hamburger toggle drawer with full responsive navigation.
     - Live `24/7 Telematics Support` indicator with pulsing teal dot.
     - `₹ INR` currency badge and profile avatar connected to `tokenStorage` with dropdown and Sign Out action.
  2. **Hero & Smart Journey Planner Module**:
     - AI-Powered Route Optimization callout ribbon and glowing gradient headline.
     - Origin input with `Origin Hub` tag, `near_me` icon, clear button, and popular boarding pills ("Silk Board", "Koramangala", "Esplanade").
     - Centered animated swap button with 180° rotation on click.
     - Destination input with `Destination` tag, `location_on` icon, clear button, and top drop-offs pills ("Mapusa", "Calangute", "Siliguri").
     - Hot Routes quick-select pills ("Mumbai", "Hyderabad", "Coimbatore", "Chennai", "Manali", "Pune", "Darjeeling").
     - Dual schedule grid: Departure schedule (Date & Time Window) and Required Arrival Reach-By cutoff (Reach Date & 07:00 AM Cutoff with Guaranteed On-Time Match badge).
     - Maximum Travel Budget module: synchronized range slider (₹500 to ₹3,500) updating live `₹ / berth` display, with scale marks and fast preset chips (`₹800`, `₹1,200`, `₹1,500`, `₹2,200`).
     - Multi-select interactive travel preference chips with coral/teal active indicators (`Sleeper Berth`, `Seater Recliner`, `Climate AC`, `Natural Air`, `Fastest Non-Stop`, `Budget Friendly`, `Western Ghats Scenic`, `Single Women Reserved`).
     - Primary CTA button "Find My Smart Journey" with loading animation and direct navigation to `/results` passing all selected parameters.
     - Real-time match banner with verified bus count and criteria reflection.
  3. **The "Journey Line" Live Telemetrics Visualization**:
     - Live Waypoint Telemetry header with on-time index and active trip badge.
     - 4-metric telemetry bar: Departed Origin, Speed & Cabin (74 km/h | 22.5°C), Smart Rest Stop (Hubballi Food Plaza), and Predicted Arrival (12 min ahead of schedule).
     - SVG Journey Ribbon Visualizer: completed 65% gradient track, waypoint nodes with check and restaurant icons, and animated live bus position beacon with radar ping.
     - Telematics sensor strip: Dry road surface, twin-driver verification, and 5G active status.
  4. **"Journeys People Love" Fleet Grid**:
     - 4 high-demand route cards (Bengaluru → Goa, Mumbai → Pune, Delhi → Manali, Hyderabad → BLR) with fleet categories, star ratings, schedules, and direct "Book Seat" actions wired to `/results`.
  5. **Weekend Escapes & Curated Getaways**:
     - Bento-style 3-card grid (Ooty & Nilgiri Heights, Gokarna Quiet Shores, Hampi Ruins & River) with travel windows and starting fares.
  6. **Roamly Copilot AI Assistant**:
     - Natural language query search bar with prompt chips ("Solo female quiet sleeper to Hyderabad", "Fastest AC bus Mumbai to Pune").
     - Real-time parsed parameters response box.
  7. **Comprehensive Footer**:
     - Popular Highline Routes, Smart Route AI Guarantee, Safety Protocols, and Roamly Mobile Suite with store badges.
- **Responsive Adaptations**:
  - Desktop (1440 × 1024): 2-column input grid with centered floating swap button, 4-column metric bar, 4-column fleet grid, and 3-column bento getaways.
  - Mobile (390 × 844): Naturally stacks inputs and schedules vertically, swap button centers cleanly, touch targets meet accessibility standards (44px+), zero horizontal scrolling (`overflow-x-hidden`).
- **Verification**:
  - `npm run build`: Bundled with 0 errors (`tsc -b && vite build` in 1.49s).
  - `npm run lint`: 0 errors.
  - Dev server verified returning HTTP 200 OK.
  - All existing routes, authentication, and backend APIs preserved.

## Phase 7 - One Go Bus Light Theme & Stitch Auth UI (2026-11-15)
- **Branch**: `feature/onego-theme-auth-ui`
- **Branding**: Rebranded from obsolete names (Roamly/BusSathi) to **One Go Bus**.
- **Stitch Project ID**: `9772835342865580419`
- **Tokens Added**:
  - `frontend/src/index.css`: Added complete light mode token dictionary in `:root` and `@theme inline` (`--canvas`, `--surface`, `--surface-2..5`, `--line`, `--ink`, `--ink-strong`, `--ink-muted`, `--brand`, `--accent`, `--accent-bright`, `--accent-tint`, `--success`, `--danger`, `--font-sans`).
  - `frontend/index.html`: Loaded Google Fonts for `Plus Jakarta Sans` (weights 400-800) and updated `<title>` to "One Go Bus".
- **Modular Components Created** (`frontend/src/features/auth/`):
  - `AuthLayout.tsx` (151 lines): Fixed-viewport background architecture (`fixed inset-0 w-screen h-screen -z-10 object-cover object-bottom`) locking `Login_Hero.webp` strictly to viewport window bounds. Features the **Floating Sky Glass Pod** placed in the open right-leaning sky zone (`lg:pl-10 xl:pl-16`) away from tree leaves, completely uncovering the bus, temple spires, and bridge. Anchored with strict top alignment (`justify-start pt-2 lg:pt-6`) eliminating all jumping/shifting when switching between Sign In, Sign Up, Email/Password, and Phone OTP tabs.
  - `AuthField.tsx` (68 lines): Compact accessible input wrapper with real `<label>`, leading icons, `aria-invalid`, `aria-describedby`, and error/hint states.
  - `PasswordField.tsx` (74 lines): Secure password input with show/hide password toggle (44px min tap target) and 4-tier password strength meter.
  - `AuthButton.tsx` (42 lines): High-contrast primary navy button with spinner loading state.
  - `AuthSocialButtons.tsx` (29 lines): Minimal Apple ID and Google one-tap login buttons.
  - `frontend/src/components/brand/Logo.tsx` (80 lines): Streamlined speed bus emblem matching reference artwork and "One Go Bus" wordmark.
- **Pages Converted**:
  - `frontend/src/pages/LoginPage.tsx` (183 lines): Full illustration view with narrative anchored cleanly in the open sky above the bus. Features segmented tab switcher (Sign In / Sign Up), auth mode tabs (Email & Password / Phone OTP), remember me checkbox, password recovery, and error banner.
  - `frontend/src/pages/RegisterPage.tsx` (181 lines): Symmetrically balanced registration view with 2-column Name & Phone grid to prevent vertical card bloat. Internal scroll constraint (`max-h-[calc(100vh-90px)] overflow-y-auto`) prevents page stretching on smaller laptops.
- **Verification**:
  - `npm run build`: Bundled with 0 errors (`tsc -b && vite build` in 337ms).
  - `npm run lint`: 0 errors, 0 warnings across all project files.
  - Zero raw hex colors in all new files (strictly mapped to design tokens).
  - All new files kept modular and under 85 lines (pages under 185 lines).
  - No changes to backend, routing, or existing dark theme components on other pages.

## Phase 8 - BusSathi Finalized 4th Stitch Homepage Design (2026-11-16)
- **Branch**: `feature/frontend-Design`
- **Stitch Project ID**: `3249928304240990338`
- **Selected Screen**: Screen No. 4 (Latest/Finalized) — `3182ad4da42b4a0d85c76a30f6379413` ("BusSathi — Variant 3: Dedicated Sathi Copilot Slide-Over Drawer").
- **Exclusions Enforced**: Strictly avoided earlier Screen 1 (basic), Screen 2 (dropdowns only), and Screen 3 (calendar only).
- **Files Changed**:
  - `frontend/src/pages/HomePage.tsx`: Fully replaced with the finalized 4th Stitch homepage design.
- **Core Architecture & Features Implemented**:
  1. **Sticky Header (`h-[76px]`)**:
     - BusSathi logo emblem (navy `#082E78` container with white bus glyph + saffron wheel accents) + wordmark "BusSathi" with orange accent and subtitle "Travel Smart. Pay Less."
     - Desktop navigation links (`Home` active pill, `Routes`, `Offers`, `Bus Pass`, `Help & Support`).
     - Dedicated **Sathi Copilot Button** (`#082E78`, sparkle star, AI badge) with slide-over drawer trigger.
     - Notification bell with unread dot indicator and traveler account profile with dropdown.
     - Responsive mobile hamburger menu.
  2. **Hero Section (`min-h-[500px]`)**:
     - Kolkata Bengal Transit illustration (Howrah Bridge, Victoria Memorial, luxury bus).
     - "Bengal's Smartest Transit Network" pulsing badge.
     - Dynamic heading "Where to next?" with orange curved arc graphic.
  3. **Main 4-Row Bus Search Card (`max-w-[1120px]`, -mt-6 to -mt-14 relative z-30)**:
     - **Row 1 (Origin & Destination)**: Interactive searchable dropdowns with Bengal transit points (Kolkata, Howrah, Durgapur, Asansol, Siliguri, Digha, Malda, Santiniketan, Haldia) + quick popular chips + centered animated swap button.
     - **Row 2 (Date & Time)**: Interactive Calendar Popover with quick preset chips (`Today`, `Tomorrow`, `+2 Days`, `Weekend`), month navigator, days grid with lowest fare badges (`₹180`), and time slot selector.
     - **Row 3 (Max Budget Panel)**: Aqua container (`#E3F8F5`, border `#94D2BD`) with dynamic currency badge (`₹`), real-time budget range slider (₹200 to ₹2,500), and "Budget Friendly 🌱" status pill.
     - **Row 4 (Search CTA)**: Full-width button (`#001A50`) wired to `navigate('/results')`.
  4. **✨ Explore More (5 Soft Pastel Cards)**:
     - Popular Routes (`#EAF3FF`), Best Deals (`#FFF0DF`), Nearby Stops (`#EFF6FF`), Quick Book (`#E3F8F5`), Student Special (`#F0EAFF`).
  5. **Popular Journeys (4 Bengal Corridors in 1 Desktop Row)**:
     - Kolkata → Digha (Coastal Escape, 4 hrs 15 min, From ₹220, 34 daily buses).
     - Kolkata → Siliguri (Gateway to Hills, Overnight 12 hrs, From ₹750, 48 daily buses).
     - Kolkata → Durgapur (Industrial Corridor, Express 3 hrs, From ₹180, 52 daily buses).
     - Kolkata → Malda (Heritage & Mango City, 7 hrs 30 min, From ₹340, 26 daily buses).
     - Quick route prefill actions on each card.
  6. **Benefits Banner (Deep Navy `#082E78`)**:
     - 4 pillars: Reliable & Safe, Easy Booking, Great Value, Help When You Need It.
  7. **How BusSathi Works**:
     - 3 connected steps: Choose Your Route, Set Preferences, Find Your Ride.
  8. **Student Travel Special**:
     - Campus commute banner offering flat ₹150 OFF with code `CAMPUSCOMMUTE`.
  9. **Frequently Asked Questions (FAQ)**:
     - 4 collapsible accordion cards covering booking, cancellations, payment methods, and travel safety.
  10. **Comprehensive Footer**:
      - 5-column navigation with company links, trip planner, customer care, and legal guidelines.
  11. **Dedicated Sathi Copilot Slide-Over Drawer (Variant 3 Specific)**:
      - Slide-over panel (max-w-[440px]) with backdrop, live fleet connection status, and conversation stream.
      - Bengali transit welcome ("নমস্কার! Welcome to BusSathi 🙏") + Trending deal card (Kolkata → Siliguri ₹750 with Quick Apply action).
      - Suggested prompt chips ("Compare AC vs Non-AC", "40% student pass", "Luggage policy", "Cheapest < ₹300").
      - Interactive query responses, voice input button animation, and clear chat utility.
- **Verification**:
  - `npm run lint`: 0 errors, 0 warnings across all files.
  - `npm run build`: Production build succeeded (`tsc -b && vite build` in 1.18s).
  - Zero changes to other pages, authentication, backend code, database, or environment configs.

## BusSathi Hero Section — Seamless Panoramic Background Extension Behind Heading (2026-11-16)
- **Files Changed**:
  - `frontend/src/assets/hero_bussathi_design4.webp`: Created a seamless panoramic composite (2048×768 WebP, 165 KB) that extends the Bengal landscape canvas to the left behind the heading while preserving the right-side artwork.
  - `frontend/src/pages/HomePage.tsx`:
    - Imported `heroBg` from `../assets/hero_bussathi_design4.webp`.
    - Wired into Section 1 as ONE continuous full-width background layer (`w-full h-full object-cover object-right md:object-right-bottom lg:object-right opacity-95`).
    - Maintained exact heading typography, colors, orange arc underline, and positioning with subtle cream-white radial blur backdrop for effortless readability.
- **Visual Composition**:
  - **Right Side (Preserved Exactly)**: Modern smart coach bus in royal navy and saffron orange on the asphalt road, Howrah Bridge, Victoria Memorial dome on the horizon, calm Hooghly river with ferry boat, riverside trees and buildings, original colors and sharpness.
  - **Left Side (Extended Behind Heading)**: Soft cream-blue morning dawn sky, natural clouds, gentle riverbank greenery, and calm river waters continuing seamlessly behind the "Where to next?" heading.
  - **Seamless Unity**: One continuous full-width background layer with zero vertical seam or visible panel split.
- **Verification**:
  - `npm --prefix frontend run lint`: 0 errors, 0 warnings.
  - `npm --prefix frontend run build`: Succeeded in 1.90s, bundling `hero_bussathi_design4-B8mpKiTV.webp` (165.40 kB).
  - All collaboration rules and file protection constraints respected.

## BusSathi Asset Bundling & Explore Cards Local Integration (2026-11-16)
- **Files Changed**:
  - `frontend/src/assets/explore_bus.webp`: Local WebP asset for Card 1 (Express Highway Bus).
  - `frontend/src/assets/explore_voucher.webp`: Local WebP asset for Card 2 (Ticket Voucher).
  - `frontend/src/assets/explore_stop.webp`: Local WebP asset for Card 3 (Bus Stop Shelter).
  - `frontend/src/assets/explore_qr.webp`: Local WebP asset for Card 4 (Instant QR Code).
  - `frontend/src/assets/explore_students.webp`: Local WebP asset for Card 5 (Student Campus Special).
  - `frontend/src/pages/HomePage.tsx`: Wired local assets into Section 3 Explore Cards, eliminating all external session dependencies.
- **Verification**:
  - `npm --prefix frontend run lint`: 0 errors, 0 warnings.
  - `npm --prefix frontend run build`: Succeeded in 2.02s, bundling all 6 WebP assets cleanly into `dist/assets/`.

## BusSathi Hero Header — 100% Stitch Specification Realignment (2026-11-16)
- **Files Changed**:
  - `frontend/src/pages/HomePage.tsx`:
    - Container height adjusted to exact Stitch specification: `h-[340px] md:h-[370px] lg:h-[390px] flex flex-col justify-start bg-[#f9f9ff]`.
    - Restored Stitch's exact horizontal scrim overlay: `bg-gradient-to-r from-white/90 via-white/70 to-transparent w-full md:w-3/5 lg:w-1/2`.
    - Vertically centered headline container: `max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10 w-full h-full flex items-center`.
    - Heading typography reset to exact Stitch dimensions: `text-3xl md:text-4xl lg:text-[40px] leading-tight font-extrabold text-[#001A50] tracking-tight drop-shadow-xs`.
    - Subtitle reset to exact Stitch size and spacing: `text-sm md:text-base text-[#334155] font-semibold mt-2`.
    - Section 2 Search Card spacing reset to `mt-4` (removing artificial negative top margins).
  - `frontend/src/assets/hero_bussathi_design4.webp`: Bundled the authentic Stitch panoramic banner asset (`stitch_screen_d52ea_raw.png`, 163 KB) with `object-cover object-bottom`.
- **Verification**:
  - `npm --prefix frontend run lint`: 0 errors, 0 warnings.
  - `npm --prefix frontend run build`: Succeeded in 1.66s.

## BusSathi Above-the-Fold Optimization — redBus-Inspired Booking Form Placement (2026-11-16)
- **Files Changed**:
  - `frontend/src/assets/hero_bussathi_compact.webp`: Tailored panoramic Kolkata transit asset (1376×718 WebP, 171 KB) with optimized sky headroom, ensuring Howrah Bridge, Victoria Memorial dome, Hooghly river ferry, bus, and road remain 100% visible.
  - `frontend/src/pages/HomePage.tsx`:
    - **Header Compactness**: Height optimized to `h-[70px]` for standard desktop viewport efficiency.
    - **Hero Section Height**: Reduced to `h-[290px] sm:h-[310px] lg:h-[330px]` with `object-cover object-[center_60%]`, keeping the Howrah Bridge truss, Victoria Memorial dome, ferry, and orange-and-white express bus in full view.
    - **redBus-Style Card Elevation**: Applied `-mt-10 sm:-mt-11 lg:-mt-12` (40px–48px negative top margin), seamlessly overlapping the bottom asphalt road zone without covering the bus body, wheels, or landmark features.
    - **Compact Booking Form Proportions**:
      - Card padding: `p-3.5 sm:p-4 md:p-5` with `rounded-[22px]` and 2px `#D0E4FF` border.
      - Inter-row spacing: `gap-2.5 sm:gap-3` (10px–12px).
      - Row 1 (From / To): `h-[64px]` with 40px icon containers and clean `[10px]` uppercase labels.
      - Row 2 (Date & Time): `h-[54px] sm:h-[56px]` with 32px icons and quick presets.
      - Row 3 (Max Budget Slider): `py-2.5 px-3.5 sm:px-4` (~58px height) with responsive layout.
      - Row 4 (Search Buses CTA): `h-[48px] sm:h-[50px] rounded-[14px]` with `text-[16px]` font-bold.
    - **Above-the-Fold Result**: Total vertical stack height from top of page to bottom of Search button is ~605px–620px across `1366×768`, `1440×900`, and `1920×1080` viewports, leaving 45px–65px of margin above the fold line without scrolling.
- **Verification**:
  - `npm --prefix frontend run lint`: 0 errors, 0 warnings.
  - `npm --prefix frontend run build`: Succeeded in 1.43s, bundling `hero_bussathi_compact-C_GjuR6o.webp` cleanly into `dist/assets/`.
  - Zero modifications to other pages, routes, authentication, or backend code.

## BusSathi Finalized Compact Top Section Re-creation (2026-11-16)
- **Visual Reference**: Finalized design screenshot (`media_1794842958896_a1eecd72.jpg`, reference URL `bussathi-compact-booking-demo-2026.vibrantoffer4.chatgpt.site`).
- **Scope Boundary Strictly Followed**:
  - Replaced ONLY the three requested top sections:
    1. Navigation Bar (Floating pill navbar)
    2. Hero Section (Compact banner with right-bottom Kolkata artwork)
    3. Bus Search Form (4-row compact card up to the "Search Buses" CTA button)
  - Everything below the "Search Buses" button (Section 3: Explore More, Popular Routes, Offers, Bus Pass, FAQ, Footer, Sathi Copilot drawer, all modals) remains 100% UNCHANGED.
  - Excluded the website editor's floating "Edit site" control.
- **Files Changed**:
  - `frontend/src/pages/HomePage.tsx`:
    - **Floating Pill Navbar**: `max-w-[1520px] mx-auto h-[64px] rounded-full bg-[#FCFEFF]/95 backdrop-blur-[18px] border border-[#CEDDF3] shadow-[0_4px_20px_rgba(11,61,146,0.06)] px-4 sm:px-6 sticky top-3 z-40`.
      - Logo: 43×43px rounded-[13px] bg `#0B3D92`, "Bus" navy + "Sathi" orange font-black text-[23px] with "Travel Smart. Pay Less." muted blue.
      - Center navigation: Active Home gradient pill (`bg-gradient-to-r from-[#104FBD] to-[#082E78]` text white, rounded-[25px], home icon), Routes, Offers, Bus Pass, Help & Support with material icons.
      - Actions: Sathi Copilot AI pill button (`#082454`, `✦`, orange AI badge), notification bell with orange dot, profile avatar button with dropdown menu.
    - **Compact Hero Section**: `max-w-[1560px] mx-auto px-4 sm:px-[22px] mt-2.5 h-[250px] rounded-[24px] bg-white border border-[#E2ECF8] overflow-hidden`.
      - Right-bottom aligned Kolkata illustration: `hero_bussathi_compact.webp` at 116% container height, keeping Howrah Bridge, Victoria Memorial dome, Hooghly river ferry, bus, and road perfectly sharp and uncropped.
      - Scrim: Soft horizontal gradient scrim from white to transparent on left.
      - Badge: `• BENGAL'S SMARTEST TRANSIT NETWORK` pill.
      - Headline: "Where to next?" on a single line with orange arc curve underline SVG.
      - Subtitle: "Find affordable buses for your journey 😊".
      - Popular route pills: `Kolkata → Digha`, `Kolkata → Siliguri`, `Kolkata → Durgapur` with click-to-fill handlers.
    - **Compact 4-Row Search Form**: `max-w-[1220px] mx-auto bg-white rounded-[23px] shadow-[0_12px_32px_rgba(11,61,146,0.08)] px-5 pt-[17px] pb-[19px] border-[1.4px] border-[#D4E0EE] -mt-[23px]`.
      - Row 1: FROM & TO fields (`h-[61px]`, rounded-[13px], 35×35px icon containers, 9.5px uppercase labels, 15px city name, 10.5px subtext) + Center Swap button (`43×43px` circular, 22px `sync_alt` icon, 300ms smooth 180° rotation).
      - Row 2: DATE & TIME fields (`h-[52px]`, rounded-[13px], 32×32px icon containers, 9px uppercase labels, 14px bold values; Date formatted as `17-11-2026`, Time as `Anytime`; interactive calendar and time popovers preserved).
      - Row 3: MAX BUDGET panel (`h-[50px]`, rounded-[12px], bg `#E7F7F3`, border `#B8E5D9`, 28×28px rupee icon box, ₹800 per seat, dual-color track slider with `#FF7900` fill and `#374151` base, `Budget Friendly` leaf pill badge).
      - Row 4: CTA Button (`h-[46px]`, rounded-[12px], `bg-gradient-to-r from-[#104FBD] to-[#062E79]`, text-[15px] font-[800] with search icon).
- **Verification**:
  - `npm --prefix frontend run lint`: 0 errors, 0 warnings.
  - `npm --prefix frontend run build`: Succeeded in 2.32s with zero TypeScript or Vite errors.
  - All interactive features (dropdowns, calendar picker, time selector, budget slider, route search, copilot trigger, and profile menu) fully functional.

## BusSathi Top Section Viewport Height Responsiveness Optimization (2026-11-16)
- **Problem**: On Windows laptops with 125%/150% scaling or 1366×768 displays (effective inner browser viewport height ~460px–520px), the "Search Buses" CTA button was getting partially cropped off at the bottom.
- **Solution & CSS Adjustments**:
  - **Floating Navbar**: Compacted height to `h-[50px] sm:h-[54px] lg:h-[58px]` with `top-1 sm:top-2` and refined icon & brand scale (`34px–38px`).
  - **Hero Section**: Optimized height to `h-[180px] sm:h-[195px] lg:h-[205px]` with `mt-1.5 sm:mt-2`. The Kolkata illustration (`hero_bussathi_compact.webp`) remains right-bottom pinned at `116%` height, preserving Howrah Bridge, Victoria Memorial, ferry, bus, and road.
  - **Search Card Overlap**: Adjusted to `-mt-6 sm:-mt-7 lg:-mt-8` and streamlined internal padding to `px-3.5 sm:px-5 pt-3 sm:pt-3.5 pb-3 sm:pb-3.5` with `gap-1.5 sm:gap-2`.
  - **Row 1 (From / To)**: Streamlined to `h-[48px] sm:h-[50px] lg:h-[52px]` with 30px–32px icons, 8.5px labels, and 34px–36px circular swap button.
  - **Row 2 (Date & Time)**: Streamlined to `h-[42px] sm:h-[44px] lg:h-[46px]` with 26px–28px icons and 8px labels.
  - **Row 3 (Max Budget)**: Streamlined to `h-[38px] sm:h-[40px] lg:h-[42px]` with 24px rupee icon box, 7.5px label, 14px–15px amount, and compact Budget Friendly badge.
  - **Row 4 (Search CTA Button)**: Streamlined to `h-[38px] sm:h-[40px] lg:h-[42px]` with 18px search icon and 14px–14.5px font-[800].
  - **Result**: Total vertical footprint reduced from ~590px down to ~370px, leaving 90px+ of clear breathing margin on 460px laptop viewports and eliminating all clipping across all laptop screens and resolutions.
- **Verification**:
  - `npm --prefix frontend run lint`: 0 errors, 0 warnings.
  - `npm --prefix frontend run build`: Succeeded in 3.68s.

## BusSathi Homepage Visual Alignment & One Continuous Hero Section Fix (2026-11-16)
- **Visual Differences Resolved**:
  1. **Continuous Hero Section**:
     - Removed any split appearance between left text and right illustration.
     - Single hero container with `position: relative` and desktop height ~250px (`h-[210px] sm:h-[230px] lg:h-[250px]`).
     - Kolkata illustration positioned as an absolute background layer (`absolute inset-0 z-0 w-full h-full`) behind the content using `object-[center_80%] sm:object-[center_82%] md:object-[center_83%]`, preserving Howrah Bridge, Victoria Memorial dome, Hooghly river ferry, bus wheels on the road, and the asphalt road along the bottom edge without cropping landmarks.
     - Smooth horizontal gradient scrim (`bg-gradient-to-r from-white via-white/90 via-28% md:via-white/75 md:via-42% lg:via-white/55 lg:via-50% to-transparent w-full md:w-[70%] lg:w-[62%]`) providing soft readability for "Where to next?" and popular route pills on the left while smoothly fading to transparent with zero hard vertical division.
  2. **Preserved Navbar**:
     - Floating pill navbar preserved 100% with branding, navigation links, Sathi Copilot AI button, notification bell, and user profile avatar.
  3. **Search Form Dimensions & Alignment**:
     - Search card wrapper width set to `max-w-[1220px] w-full mx-auto` with ~20px horizontal page padding (`px-4 sm:px-5 lg:px-[20px]`).
     - Rounded corners set to `rounded-[23px]`.
     - Overlap maintained with `-mt-[23px]` top margin on the search section wrapper.
  4. **Budget Default Value**:
     - Default state set to ₹800 per seat (`useState(800)`), with min ₹200, max ₹2,500, step 50, and slider thumb initialized at ₹800 (26.09% along the dual-colored track).
  5. **Scope Guardrail Strictly Preserved**:
     - Everything below the "Search Buses" CTA button remains 100% untouched.
- **Verification**:
  - `npm --prefix frontend run lint`: 0 errors, 0 warnings.
  - `npm --prefix frontend run build`: Built successfully in 2.50s.
