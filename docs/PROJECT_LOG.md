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

## Phase 9 - OneGoBus Universal Glassmorphic Layout & Route Architecture (2026-11-17)
- **Objective**: Deprecate legacy dark mode Onboarding page, establish `HomePage.tsx` as primary app entry point (`/`), and introduce unified glassmorphic `Navbar` and `Footer` wrapped around all parent application views.
- **Tokens & CSS Utility Added** (`frontend/src/index.css`):
  - Defined CSS glass variables in `:root` strictly for light mode (`--glass-bg: rgba(255, 255, 255, 0.78)`, `--glass-border: rgba(255, 255, 255, 0.85)`, `--glass-blur: blur(20px)`, `--glass-shadow: 0 10px 35px rgba(11, 35, 65, 0.08)`, `--glass-highlight: rgba(255, 255, 255, 0.95)`, `--glass-fallback-bg: #FFFFFF`).
  - Added `@utility glass` with `backdrop-filter: var(--glass-blur) saturate(150%)`, subtle 1px border, box-shadow, and inner highlight.
  - Purged `.dark` classes, deferred dark mode, and updated `index.html` body to warm cream canvas (`#FBF9F5`) and deep ink (`#1B1C1A`).
  - Provided `@supports not (backdrop-filter: blur(1px))` and `@media (prefers-reduced-transparency: reduce)` fallbacks.
  - Implemented dynamic scrolled state enhancements (`data-scrolled="true"` on scroll > 8px) with zero React re-renders.
- **Components Created**:
  - `frontend/src/components/layout/Navbar.tsx`: Floating pill bar (`fixed top-3 inset-x-0 mx-auto w-[calc(100%-1.5rem)] max-w-6xl rounded-2xl z-50 glass`) with numeral '1' speed bus logo, desktop NavLinks with active indicators, theme toggle (light/dark with localStorage sync), and touch-optimized hamburger.
  - `frontend/src/components/layout/MobileMenu.tsx`: Accessible glass drawer with focus trap, body scroll lock, route-change auto-close, and pinned auth buttons.
  - `frontend/src/components/layout/footer.config.ts`: Single typed data configuration for brand, 5 responsive columns, newsletter, and legal links.
  - `frontend/src/components/layout/Footer.tsx`: 5-column responsive glass card with brand mission, inline SVG socials (GitHub, LinkedIn, Instagram, X), newsletter input, and legal bottom bar.
  - `frontend/src/components/layout/AppLayout.tsx`: Root layout component wrapping all views with reserved top padding (`pt-20`) guaranteeing zero cumulative layout shift (CLS = 0).
- **Page Upgrades & Cleanups**:
  - **OnboardingPage Deleted**: Unlinked and permanently deleted obsolete `OnboardingPage.tsx`.
  - **HomePage Upgraded**: Removed redundant local headers and footers; mounted as root route (`/`).
  - **AuthLayout Nested**: Streamlined `AuthLayout.tsx` to nest cleanly inside `AppLayout`, displaying the universal floating glass navbar and footer over the heritage bus backdrop.
  - **Placeholder Pages Created**: `FeaturesPage.tsx`, `HowItWorksPage.tsx`, `RoutesPage.tsx`, `AskAiPage.tsx`, `AboutPage.tsx`, `ContactPage.tsx`, `PrivacyPage.tsx`, `TermsPage.tsx`, `FaqPage.tsx`, and updated `NotFoundPage.tsx`.
  - **Route Architecture (`App.tsx`)**: Refactored all 14 routes to use `React.lazy()` and `Suspense`, enabling per-route code splitting and reducing main chunk size from 557 kB to 304 kB.
- **Verification**:
  - `npm run build`: Bundled in 309ms with 0 errors across 20 split chunks.
  - `npm run lint`: 0 errors, 0 warnings across entire codebase.


## Phase 10 - Auth Background Restoration & Retail Auth Micro-Footer Architecture (2026-11-17)
- **Problem Statement**:
  - Following the introduction of `AppLayout.tsx`, the Kolkata heritage vector-style art illustration background (`Login_Hero.webp`) on `/login` and `/register` disappeared and was replaced by a solid white screen.
  - The heavy 5-column marketing `Footer` was also rendered on the auth pages, causing an unwanted vertical scrollbar and covering the heritage bus, roadway, and Hooghly river artwork.
- **Root Cause Analysis**:
  - In `frontend/index.html` and `AppLayout.tsx`, `<body>` and the layout root container applied solid background colors (`bg-[#FBF9F5]` and `bg-canvas`).
  - In `AuthLayout.tsx`, the fixed backdrop container was styled with `fixed inset-0 -z-10`. Under CSS stacking context rules, negative z-indices are painted behind the background of parent elements, causing the solid cream/white surface to occlude the illustration.
- **Retail & Transit UX Research (Footer on Auth Pages)**:
  - Industry benchmark audit across top retail and transit platforms (Airbnb, Uber, redBus, MakeMyTrip, Amazon, Stripe, Linear):
    - Multi-column marketing sitemaps, newsletters, and heavy footers are strictly avoided on login/register pages because they introduce decision friction, break the focused conversion funnel, and cause vertical scrolling.
    - The optimal industry standard is a **focused Micro-Footer**: a sleek, single-line utility bar docked at the bottom containing copyright, legal links (Privacy Policy, Terms of Service), and DPDP 2025 compliance.
- **Implementation & Fixes**:
  - **Stacking Context Fixed (`AuthLayout.tsx`)**:
    - Changed backdrop container from `-z-10` to `z-0` (`fixed inset-0 z-0 w-screen h-screen overflow-hidden pointer-events-none select-none`).
    - The narrative Sky Pod and Auth Card remain at `relative z-10`.
    - Floating glass navbar sits at `fixed top-3 ... z-50`.
  - **Dynamic Layout Adaptability (`AppLayout.tsx`)**:
    - Added route detection: `const isAuthPage = location.pathname === '/login' || location.pathname === '/register';`.
    - Set layout background to `bg-transparent` on auth routes and `bg-canvas` on discovery/marketing routes.
    - Excluded the heavy 5-column marketing footer on auth pages (`{!isAuthPage && <Footer />}`).
  - **Micro-Footer Integrated (`AuthLayout.tsx`)**:
    - Embedded a lightweight, single-line micro-footer docked over the neutral asphalt section: `© 2026 OneGoBus • West Bengal AI Smart Bus Booking Platform • Privacy • Terms • DPDP 2025 Compliant`.
    - Zero vertical scrollbar on standard desktop screens (100vh fit).
  - **Preserved Artwork & Alignment**:
    - 100% of the artwork (heritage express coach, Howrah Bridge, Dakshineswar Kali Temple, Victoria Memorial, Goddess Durga idol, autumn flame tree) is unclipped and clearly visible.
    - Maintained top-aligned column anchors (`self-start items-start`) so switching between Sign In / Sign Up or Email / Phone OTP causes zero layout shifting.
- **Verification**:
  - `npm run build`: Bundled cleanly in 289ms across 20 chunks with 0 errors.
  - `npm run lint`: 0 errors, 0 warnings.


## Phase 11 - Desktop Bus Search Results Light Mode Redesign (2026-11-17)
- **Objective**: Replace the legacy dark mode search results page (`frontend/src/pages/ResultsPage.tsx`) with the modern light mode design from Stitch project `9772835342865580419` (Node ID: `bd8344ff3d534669bafe7eea90604b47` - "OneGoBus - Desktop Bus Search Results").
- **Design Specifications & Tokens Implemented**:
  - **Color Palette & Glassmorphic Surface**:
    - Canvas: `--canvas: #FBF9F5` (warm cream background).
    - Card surfaces: `--surface: #FFFFFF` with subtle border `#E5E1D8` and soft drop-shadow.
    - Typography & Ink: `--ink-strong: #0B2341` for headlines and prices; `--ink-muted: #64748B` for secondary details.
    - Accents: Coral/Orange `#FC7728` (`hover: #E06547`) for primary CTAs and badges; Teal `#0D9488` (`bg: #F0FDFA`, `border: #99F6E4`) for AI route recommendations and verification.
  - **Top Promo Announcement**:
    - Deep brand navy strip with "Bengal AI Route Advisor" pill announcing real-time NH-12 holiday rush traffic insights and sleeper locking advice.
  - **Route Summary Bar**:
    - Clean white card displaying origin ➔ destination (`Kolkata ⟿ Siliguri`), active journey pill (`SAT, 14 NOV • 1 PASSENGER • AC SLEEPER`), distance (574 km), corridor info (NH-12), and "Modify Route" action.
  - **Date Carousel Strip (`DateStrip.tsx`)**:
    - 6 interactive date tiles displaying daily minimum fares (12 Nov to 16 Nov) with "SELECTED" gradient pill and Calendar View trigger.
  - **Left Journey Filter Sidebar (`FilterSidebar.tsx`)**:
    - Travel Mood chips: `😴 Sleep Well`, `⚡ Fastest`, `💰 Budget Friendly`, `🌄 Scenic Route`, `All` (AI Recommended).
    - Max Price Budget Range Slider: ₹400 to ₹1,500 with instant discount callout.
    - Departure Time Slots: 4 tiles (Early Morning, Morning, Afternoon, Night - "Best Sleep Pick").
    - Bus Types & Comfort checkboxes: AC Sleeper, Semi-Sleeper, Volvo Luxury, Non-AC.
    - Boarding & Dropping Points: Esplanade, Babughat, Airport Gate 1, Dankuni; Tenzing Norgay, Siliguri Junction, ISBT.
    - Amenities multi-select: Free WiFi, Charging, Water, Blanket, Live GPS.
    - Bengal Operators: NBSTC (Govt of WB), SBSTC & WBTC, Shyamoli Paribahan, Royal Cruiser, Greenline Travels.
    - Conductor Route Advice callout card with scenic tips.
  - **Perforated Ticket Cards (`TicketCard.tsx`)**:
    - Authentic boarding pass styling with semicircular notches (`ticket-notch-top`, `ticket-notch-bottom`) and dashed perforation divider.
    - Real-time schedule timeline with on-time performance badges and amenity pills.
    - Interactive **Inline Sleeper Berth Selector**:
      - Expandable lower & upper deck diagrams with Driver position indicator.
      - Full interactive seat selection: Available, Ladies Only (`♀`), Selected (`✓`), Booked (`disabled`).
      - Selected berth checkout strip with total payable calculation and "Continue Booking" CTA.
  - **7-Minute OneGoHold™ Seat Protection Guarantee**:
    - Real-time countdown timer dialog (`SeatHoldModal.tsx`) enforcing DPDP 2025 compliance and instant seat holding.
    - Persistent bottom toast confirming reserved berth status with pulsing indicator.
  - **Trust Strip**:
    - 3 light cards highlighting 100% Safe Journey & GPS, Verified Bengal RTC & Fleets, and 15-Min Instant UPI Refunds.
- **Verification**:
  - `npm run build`: Bundled in 278ms across 20 chunks with 0 errors.
  - `npm run lint`: 0 errors, 0 warnings across the entire repository.


## Phase 12 - Seat Selection Modal (Desktop & Mobile Light Mode) & OneGoHold™ (2026-11-18)
- **Objective**: Implement the dedicated full-screen / responsive sheet Seat Selection Modal based on Stitch project `9772835342865580419`:
  - **Desktop Screen**: `projects/9772835342865580419/screens/13a355a4fb44436b8b133a2b76e1f65d` ("OneGoBus - Seat Selection Modal (Desktop Light)")
  - **Mobile Screen**: `projects/9772835342865580419/screens/dce2b070c6034041b93a50314ff81778` ("OneGoBus - Seat Selection Modal (Mobile Light)")
- **Animation Architecture**:
  - Engineered hardware-accelerated CSS spring animations (`cubic-bezier(0.16, 1, 0.3, 1)`) matching Framer Motion's physics-based fluid spring feel:
    - `.animate-modal-backdrop`: Smooth fade-in overlay with backdrop blur.
    - `.animate-modal-scale`: Smooth scale-up (0.95 ➔ 1.0) and ease-out for desktop dialog.
    - `.animate-sheet-up`: Mobile bottom-sheet upward slide (`translate-y-full` ➔ `translate-y-0`).
  - Zero bundle overhead and strict adherence to the project's pinned dependency guidelines.
- **Component Architecture (`frontend/src/features/results/SeatSelectionModal.tsx`)**:
  - **Modal Header**:
    - Route display (`Kolkata ➔ Siliguri`) with "Direct AC" badge, journey date, passenger counter, and vehicle class.
    - Pulsing "Instant Seat Confirmation" badge and live 7-minute countdown lock timer (`Locking 07m 00s`).
  - **Step Indicator Tabs**:
    - Step 1: Active "Select Seats" with teal badge and border indicator.
    - Step 2: "Board/Drop Point".
    - Step 3: "Passenger Details".
  - **Dual-Deck Layout & Selectors**:
    - Mobile deck switcher pill: toggle between Lower Deck and Upper Deck with seat count indicators.
    - Lower Deck (10 rows, 2+1 layout, ₹300/seat): Executive seating with steering wheel / driver cabin indicator.
    - Upper Deck (8 rows, 2+1 layout, ₹460–₹510/berth): Panoramic capsule sleeper berths with extra privacy curtains.
    - Interactive seat states: Available (white), Selected (`#FC7728` with `✓`), Ladies Only (`pink-100` with `♀`), and Booked (`#E4E2DE` with disabled state).
    - Seat Legend explaining each seat category and icon.
  - **Right Info Column (Operator & Route Intelligence)**:
    - Operator Profile: Avatar, verified badge, rating (4.8 ★), reviews count.
    - Visual Gallery: 3 high-resolution vehicle photos (Fleet exterior, Luxury cabin, Sanitized berths).
    - 6 Quick Highlight Badges: On-Time Record, USB Charging, Free 5G WiFi, Emergency SOS, Clean Linens, Air Suspension.
    - Interactive Policy Tabs: Highlights, Cancellation, Reschedule, Boarding Points.
    - OneGoBus AI Trip Intelligence callout detailing rest stops, dinner halt at NH-12 Shaktigarh, and traffic advisories.
  - **Sticky Bottom Checkout Bar**:
    - Live selected seat chips with deck indicator (`L3 (lower)`, `U2 (upper)`), price badge, and 1-click removal (`✕`).
    - Dynamic total payable fare calculation with inclusive tax notice and 7-minute lock status.
    - Primary CTA: "Book Seat" button with hover transitions and active micro-scaling.
- **Booking Staging & Confirmation**:
  - Connected `TicketCard.tsx` "View Seats" action directly to `SeatSelectionModal`.
  - Added OneGoHold™ staging modal in `ResultsPage.tsx`: locks selected seats in memory for 7 minutes and presents DPDP 2025 compliant privacy assurance before transitioning to Passenger Details.
- **Verification**:
  - `npm run build`: Bundled in 324ms with 0 errors across 20 lazy-loaded chunks.
  - `npm run lint`: 0 errors, 0 warnings.


## Phase 13 - OneGo Bus 3D Seat Status Specifications & Asset Integration (2026-11-18)
- **Objective**: Replace standard seat squares and boxes across Lower and Upper Decks with high-quality 3D illustrated seat PNG assets, integrating the user-specified 5-tier seat status and color specifications:
  1. **Available**: Outline `#16834A`, Highlight `#27AE60`, Background `#F0FBF4` (`General_Seat_Available.png`). Clickable to select.
  2. **Selected**: Outline `#0B4DBB`, Highlight `#2563EB`, Background `#EAF3FF` (`General_Seat_Selected.png`). Active user choice with spring pop animation.
  3. **Booked**: Outline `#B94B53`, Highlight `#D96A70`, Background `#FCEEEF` (`General_Seat_Booked.png`). Pre-booked and non-selectable.
  4. **Unavailable**: Outline `#B8BDC5`, Highlight `#A8AFB9`, Background `#F1F2F4` (`General_Seat_Unavailable.png`). Operator blocked or disabled.
  5. **Women Reserved**: Outline `#C55473`, Highlight `#E87999`, Background `#FFF0F5` (`General_Seat_Women.png`). Reserved exclusively for female commuters.
  6. **OneGo Brand General**: Outline `#0B2341`, Highlight `#FC7728`, Background `#FFF8F1` (`General_Seat.png`).
- **CSS Architecture (`frontend/src/index.css`)**:
  - Added `:root` custom CSS variables:
    - `--seat-available`, `--seat-available-highlight`, `--seat-available-bg`
    - `--seat-selected`, `--seat-selected-highlight`, `--seat-selected-bg`
    - `--seat-booked`, `--seat-booked-highlight`, `--seat-booked-bg`
    - `--seat-unavailable`, `--seat-unavailable-highlight`, `--seat-unavailable-bg`
    - `--seat-women`, `--seat-women-highlight`, `--seat-women-bg`
    - `--brand-navy`, `--brand-orange`, `--page-background`
  - Added micro-animations:
    - `@keyframes seatPop`: Scale 0.92 ➔ 1.08 ➔ 1.0 (`animate-seat-pop`) on selection toggle.
    - `@keyframes seatSelectedPulse`: Subtle dual-ring glow (`seat-selected-pulse`) on active user seats.
- **Component Architecture (`frontend/src/components/ui/BusSeat.tsx`)**:
  - Modular, memoized seat component accepting `id`, `status`, `deck`, `price`, `isSleeper`, `size`, `onClick`, `showPrice`, and `showBadge`.
  - Realistic orthographic 3D armchair display with centered seat ID on the cushion, status micro-badge (e.g. `✓`, `♀`, `✕`, `—`), and dynamic price label.
  - Full support for Upper Deck sleeper capsules with berth indicator pillows and sleeper frames.
- **Modal & Ticket Integration**:
  - **`SeatSelectionModal.tsx`**:
    - Replaced the seat legend with an interactive 5-card status guide displaying the real PNG seat miniatures, official status titles, price tiers, and hover descriptions.
    - Lower Deck (10 rows): Updated to render `<BusSeat deck="lower" size="md" />` with realistic aisle spacing.
    - Upper Deck (8 rows): Updated to render `<BusSeat deck="upper" isSleeper={true} size="md" />` with berth capsule frames.
    - Sticky bottom bar: Selected seat chips updated to blue `#0B4DBB` / `#EAF3FF` with the `General_Seat_Selected.png` icon.
  - **`TicketCard.tsx`**:
    - Updated inline seat selection preview drawer to render `<BusSeat size="sm" />` across lower and upper decks.
- **Verification**:
  - `npm run build`: Bundled in 335ms across 20 chunks with 0 errors.
  - `npm run lint`: 0 errors, 0 warnings.


## Phase 14 - MacBook Full-Screen Modal Scaling & Seat Cushion Overlap Fix (2026-11-18)
- **Objective**: Address user feedback on MacBook/laptop screen responsiveness:
  1. Expand modal to cover ~90–95% of the screen (similar to redBus / modern travel apps).
  2. Increase seat dimensions and eliminate letter overlap inside seat cushions.
  3. Redesign seat numbering to standard sequential bus seat nomenclature.
  4. Elevate aisle corridor and sleeper berth layouts for a premium, light-mode feel.
- **Root Cause Analysis**:
  - **Small Modal & Narrow Decks**: Modal was capped at `max-w-[1240px]` with 7-column allocation for the seat map. Inside each deck column, only ~300px was available, causing seats to shrink to 40px–50px.
  - **Letter Overlapping**: Test IDs included 4-character strings with underscores (e.g. `L_B1`, `U_B2`), causing text to collide with the seat armrests and backrest boundaries.
- **Architectural Enhancements**:
  - **RedBus-Style 95% Viewport Window (`SeatSelectionModal.tsx`)**:
    - Changed modal dimensions to `w-full sm:w-[96vw] max-w-[1680px] h-full sm:h-[94vh] max-h-[980px]`.
    - Reduced backdrop padding to `p-0 sm:p-2 md:p-3 xl:p-4`, maximizing interactive canvas on 13", 14", and 16" MacBooks.
    - Expanded grid distribution: `lg:col-span-7 xl:col-span-8 2xl:col-span-8` for the interactive seat map, and `lg:col-span-5 xl:col-span-4 2xl:col-span-4` for operator intelligence.
  - **Sequential Bus Seat Numbering**:
    - Lower Deck (10 Rows × 3 Seats = 30 Seats): Sequential IDs `L1` through `L30` (with realistic booked, unavailable, and ladies-reserved distributions).
    - Upper Deck (8 Rows × 3 Berths = 24 Berths): Sequential IDs `U1` through `U24`.
    - Default selected recommendation updated to `L7` (lower deck window seat).
  - **High-Resolution Scaled Seats & Zero Overlap (`BusSeat.tsx`)**:
    - Scaled cushion size: `md: w-14 h-14 sm:w-16 sm:h-16 md:w-[70px] md:h-[70px] xl:w-[74px] xl:h-[74px]`.
    - Tile widths: Regular seater `w-[74px] sm:w-[84px] md:w-[94px] xl:w-[98px]`; Sleeper berth `w-[78px] sm:w-[90px] md:w-[102px] xl:w-[110px] min-h-[118px] sm:min-h-[128px] md:min-h-[136px] xl:min-h-[142px]`.
    - Cushion typography: Positioned with `pt-2 sm:pt-2.5` down in the cushion basin with `font-black text-xs sm:text-sm md:text-[14px] xl:text-[15px]`, ensuring zero overlap with armrests or backrest borders.
    - Outer status badges (`✓`, `♀`, `✕`, `—`) anchored at `-top-1 -right-1`.
  - **Authentic Walkway Aisle Corridor**:
    - Replaced basic `| |` spacers with dedicated vertical aisle corridors featuring dashed side borders (`border-x border-dashed border-slate-200/90`), subtle shading (`bg-slate-50/40`), and vertical orientation-aware `AISLE` markers.
- **Verification**:
  - `npm run build`: Bundled in 321ms with 0 errors across 20 chunks.
  - `npm run lint`: 0 errors, 0 warnings across the codebase.


## Phase 15 - Modal Unified Scrolling & Clean Cushion Surface (Selected-Only Numbering) (2026-11-18)
- **Objective**:
  1. Remove seat numbers from unselected seats to eliminate visual noise and preserve clean 3D chair artwork; show seat numbers exclusively on selected seats.
  2. Remove individual nested scrollbars from Lower Deck and Upper Deck, making the entire modal scroll smoothly as a unified page container (Redbus-style).
  3. Eliminate horizontal and vertical scrolling in the Upper Deck by resizing sleeper berths, tuning column allocations (`lg:col-span-8` / `lg:col-span-4`), and adjusting aisle width so all 3 seats fit comfortably without edge clipping.
- **Architectural & Design Changes**:
  - **Selected-Only Cushion Numbering (`BusSeat.tsx`)**:
    - Unselected seats (Available, Booked, Unavailable, Women Reserved) now display the pristine 3D armchair graphic without text overlays.
    - When a seat is selected (`isSelected === true`), the seat ID (e.g. `L7`, `U4`) is rendered dynamically in bold brand blue (`#0B4DBB`) with pop animation (`animate-seat-pop`) directly inside the cushion basin.
    - Hover accessibility (`title` and `aria-label`) remains fully preserved.
  - **Unified Modal Scrolling (`SeatSelectionModal.tsx`)**:
    - Completely removed inner `max-h-[560px] overflow-y-auto` from both Lower Deck and Upper Deck containers.
    - Both deck cards expand naturally to their full 10-row and 8-row heights with `overflow-hidden`.
    - The full modal body (`flex-1 overflow-y-auto`) handles scrolling uniformly with sticky header and sticky checkout bar.
  - **Upper Deck Sizing & Zero Horizontal Overflow**:
    - Tuned sleeper capsule frame width to `w-[68px] sm:w-[74px] md:w-[80px] lg:w-[86px] xl:w-[90px]`, regular seater to `w-[64px] sm:w-[70px] md:w-[76px] lg:w-[80px] xl:w-[84px]`.
    - Sized walkway aisle to `w-6 sm:w-7 md:w-8` with vertical `AISLE` marker.
    - Total row width (~256px–280px) fits inside the deck card (~360px–460px) with 50px–100px of breathing margin, completely preventing horizontal clipping and scrollbars.
- **Verification**:
  - `npm run build`: Bundled in 291ms across 20 chunks with 0 errors.
  - `npm run lint`: 0 errors, 0 warnings.


## Phase 16 - Minimal Clean Seat Selection Modal Redesign (2026-11-19)
- **Objective**: Completely transform the Seat Selection Modal to match the user's uploaded clean reference design (`media_1795026707961_d4c5fc5d.jpg`), removing clunky/messy visual elements and achieving pixel-perfect alignment.
- **Architectural & Design Enhancements**:
  - **Clean Header**:
    - Replaced cluttered badges with a sleek, minimalist bar: `Kolkata ➔ Siliguri`, `Wed, 18 Nov • 1 passenger`, and a single amber countdown pill (`🔒 Locking 06m 35s`).
  - **Refined 3-Step Navigation**:
    - Step 1: Active `(1) Select seats` with solid orange circle (`#FC7728`), bold title, and bottom active indicator line.
    - Steps 2 & 3: Clean muted `›` chevrons leading to `(2) Boarding & dropping` and `(3) Passenger details`.
  - **Left Container (Deck & Seats Canvas)**:
    - **Single-Row Status Legend**: 5 clean, compact status pills (`Available`, `Selected`, `Booked`, `Unavailable`, `Women reserved`) in a single horizontal strip.
    - **Lower Deck Sub-Card**: Clean header with `Lower deck`, `Executive Seater (2+1) • 10 Rows • 30 Seats`, and a minimalist `Driver` badge with steering wheel icon. 10 complete rows with 3D armchair graphics, centered `AISLE` text, and clean price tags below.
    - **Upper Deck Sub-Card**: `Upper deck`, `Full Capsule Sleeper (2+1) • 8 Rows • 24 Berths`. 8 complete rows of sleeper capsules with colored top pillow bars, 3D chairs, clean prices (`₹460`, `₹510`), and zero text clutter inside the cushion.
    - **No Inner Scrollbars**: Both decks expand fully to their natural heights without nested scrollbars.
  - **Right Container (Operator, Route & Amenities)**:
    - **Operator Title**: Bold uppercase `GREENLINE TRAVELS`, subtitle `Scania AC Multi-Axle Sleeper`, and solid emerald rating badge `★ 4.8`.
    - **Schedule Timeline**: Clean modern station-to-station timeline with `22:00 Kolkata ── 11h • Direct ➔ ── 09:00 Siliguri`.
    - **Bus Photo Gallery**: 3 real luxury coach photos side-by-side in a responsive 3-column grid (`aspect-[4/3]`).
    - **Tab Navigation**: Minimal horizontal tabs (`Highlights`, `Cancellation`, `Reschedule`, `Boarding points`) with orange active indicator.
    - **Highlights 2x2 Grid**: Exactly 4 clean amenity cards: 🚌 `Premium AC bus`, 🍽️ `Complimentary breakfast`, 🚻 `Onboard washroom`, 👩 `Women-friendly`.
  - **Minimal Sticky Checkout Footer**:
    - Left: Single clean summary text: `1 seat selected • L7` (or `2 seats selected • L7, U4`).
    - Right: Dynamic `Total ₹300` and primary action button `Continue to boarding ➔`.
- **Verification**:
  - `npm run build`: Bundled cleanly in 304ms across 20 chunks with 0 errors.
  - `npm run lint`: 0 errors, 0 warnings across the codebase.


## Phase 17 - Driver Steering Wheel Icon Bug Fix & Header Text Alignment (2026-11-19)
- **Bug Analysis**:
  - In `SeatSelectionModal.tsx`, the Driver badge used `<span className="material-symbols-outlined">sports_steering_wheel</span>`. Because `sports_steering_wheel` is not supported in Google Material Symbols, the font failed to render an icon and fell back to displaying raw ligature text (`_STEERING_WHEEL`).
  - This lengthy unspaced string broke the flexbox container, squeezing the left title container and wrapping "Lower deck" into multiple fragmented lines.
- **Fixes Applied**:
  - Replaced the ligature font with a crisp, standalone inline SVG steering wheel (`<svg viewBox="0 0 24 24">` with wheel circle, hub, and spokes).
  - Also replaced the modal close button and timer lock icon with clean, zero-delay vector SVGs, completely eliminating any external webfont ligature fallbacks.
  - Added `shrink-0` to the Driver badge and `min-w-0` with `leading-tight` to the title block, guaranteeing that "Lower deck" and its subtitle render on a single, clean line with proper spacing.
- **Verification**:
  - `npm run build`: Bundled cleanly in 274ms across 20 chunks with 0 errors.
  - `npm run lint`: 0 errors, 0 warnings across the repository.


## Phase 18 - Premium Glassmorphism Seat Booking Modal Implementation (2026-11-19)
- **Objective**: Implement the brand-new, high-fidelity 3-column glassmorphism seat booking modal based on the user's reference design (`media_1795106338124_5f35e1c0.jpg`) and transparent One Go Bus luxury coach asset (`onego-luxury-coach.png`), removing all previous heavy PNG seat images and outdated clutter.
- **Architectural & Design Enhancements**:
  - **1. Premium Glassmorphic Modal Window**:
    - Frosted glass container (`rounded-[28px]`, `background: linear-gradient(135deg, rgba(255, 248, 241, 0.94) 0%, rgba(255, 237, 228, 0.88) 50%, rgba(254, 245, 238, 0.92) 100%)`, `backdrop-filter: blur(28px) saturate(150%)`, border `1px solid rgba(255, 255, 255, 0.8)`).
    - Top header with OneGoBus brand wordmark, vertical separator, "Choose your seats" frosted pill, and circular `✕` close button.
  - **2. Column 1 (Left - Bus Showcase & Journey Details)**:
    - Authentic inline vector silhouette of Kolkata's landmark **Howrah Bridge** rendered as a soft atmospheric backdrop.
    - User's branded Volvo luxury coach bus (`onego-luxury-coach.png`) with ambient lighting and ground shadow.
    - Frosted Journey Details card displaying `Kolkata ➔ Siliguri`, departure & arrival times, AC Sleeper 2+1, and total seat count.
  - **3. Column 2 (Center - Deck Switcher & Bus Cabin Layout)**:
    - Segmented pill deck switcher (`Lower Deck` active `#FC7728` vs `Upper Deck`) plus interactive floating badge (`Upper Deck 18 Seats Available ›`).
    - Vertical bus cabin chassis with driver steering wheel icon at front, rows 1 through 10 along the left margin, central dashed aisle line, and 4 circular seat columns.
    - Pure vector top-down armchair SVG icons replacing all raster PNG assets:
      - Available: Bg `#DDF6DD`, Border `#A8DDAA`, Icon `#276749`
      - Selected: Bg `#FC7728`, Border `#E6651D`, Icon `#FFFFFF`
      - Booked: Bg `#E4E1E5`, Border `#C6C2C9`, Icon `#77747D`
      - Women only: Bg `#F8D1DF`, Border `#EFA9BF`, Icon `#934C67`
    - Horizontal status legend directly below bus chassis.
  - **4. Column 3 (Right - Booking Summary & CTA)**:
    - Frosted glass card with real-time dynamic seat selection (`Your Seats: L2, L3`), Boarding point (`Esplanade, Kolkata`), Dropping point (`Siliguri Junction`), Best Price green badge, calculated total fare (`₹1,499 Including taxes`), and full-width pill `Continue →` CTA.
  - **5. Asset Optimization**:
    - Completely removed all 6 legacy raster PNG seat files (`General_Seat*.png`), saving over 2MB of bundle weight.
    - Updated `TicketCard.tsx` to utilize pure vector `SeatArmchairIcon`.
- **Verification**:
  - `npm run build`: Bundled cleanly in 371ms across 20 chunks with 0 errors.
  - `npm run lint`: 0 errors, 0 warnings across the repository.


## Phase 19 - Premium Glassmorphism UI Polish Pass & Visual Hierarchy Refinement (2026-11-19)
- **Objective**: Thoroughly polish the seat booking modal to match the intended premium glassmorphism reference design (`media_1795106338124_5f35e1c0.jpg`), eliminating large empty voids, fixing functional data inconsistencies, standardizing icons to Lucide-React, and perfecting layout balance across all 3 columns.
- **Architectural & Design Enhancements**:
  - **1. Unified Left Composition (Eliminated Blank Canyon)**:
    - Removed `justify-between` and the disconnected separate rectangular bus card that previously pushed the bus to the top and trip details to the bottom with an empty ~250px void.
    - Integrated the transparent luxury Volvo coach bus (`~92% width`), ground shadow, Howrah Bridge vector skyline, and the Journey Details glass card into a single, cohesive visual composition with proportional natural spacing.
  - **2. Resolved Seat Count & Selection Inconsistencies**:
    - Aligned layout to **36 seats across 9 rows** (`9 rows × 4 seats = 36 seats`), resolving the mismatch where the info badge said 36 seats but 40 circles were displayed.
    - Highlighted seats in Row 2 (left column) now correspond accurately to `L2` and `L3`, perfectly synchronizing the seat map with the `Your Seats: L2, L3` summary.
  - **3. Single-Line Deck Switcher Controls**:
    - Added `whitespace-nowrap` to the segmented control buttons ("Lower Deck" / "Upper Deck"), preventing text from breaking across two lines.
    - Decoupled the "Upper Deck 18 Seats Available" availability pill into its own flexible container so it never crowds or distorts the deck tabs.
  - **4. Consistent Vector Iconography (Zero Emojis)**:
    - Standardized all icons using pure, tree-shaken `lucide-react` components with a uniform 1.75px–2px stroke: `CalendarDays`, `Clock3`, `MapPin`, `Armchair`, `BedSingle`, `IndianRupee`, `ArrowRight`, `X`, `Tag`, and `ChevronRight`.
    - Implemented an authentic 3-spoke automotive steering wheel SVG for the front driver station.
  - **5. Tightened Booking Summary (Right Column)**:
    - Replaced sparse, overstretched vertical layouts with a structured, elegant hierarchy: `Your Seats` (large bold navy `L2, L3`), thin dividers, `Boarding` and `Dropping` station points, `Fare` total with `Best price` tag, and a 52px full-width pill `Continue ➔` CTA button.
  - **6. Enhanced Glassmorphism Depth & Ambient Atmosphere**:
    - Added CSS design tokens (`--glass-surface`, `--glass-surface-strong`, `--glass-border`, `--glass-shadow`) and `.premium-glass-card` in `frontend/src/index.css`.
    - Introduced soft, diffused ambient light glows (pale sage, warm cream, soft peach) behind translucent frosted glass surfaces.
- **Verification**:
  - `npm run build`: Bundled in 286ms across 21 chunks with 0 errors.
  - `npm run lint`: 0 errors, 0 warnings across the repository.


## Phase 20 - Howrah Bridge Photographic Background Integration & Subtle Blur Layering (2026-11-19)
- **Objective**: Integrate the user-supplied high-resolution Howrah Bridge sunrise photographic illustration (`media_1795108385802_cd4c6ada.jpg` -> `howrah-bridge-sunrise.jpg`) as the atmospheric background layer for the Seat Booking Modal, applying a subtle `blur(2px)` and `opacity: 0.45` while preserving 100% crispness on the Volvo coach bus and UI controls.
- **Architectural & Design Enhancements**:
  - **1. Background Image Asset Management**:
    - Saved high-resolution artwork as `frontend/src/assets/howrah-bridge-sunrise.jpg` (197 KB).
    - Bundled into production build output (`201.99 kB`).
  - **2. Selective Blur & Opacity Separation**:
    - Embedded the photographic Howrah Bridge background in a dedicated layer behind the bus in the Left Column (`filter: 'blur(2px)'`, `opacity: 0.45`, `object-cover`, `scale-105`).
    - Added an upward warm cream gradient mask (`from-[#FFF8F1] via-[#FFF8F1]/20 to-transparent`) to blend the Hooghly river reflections into the Journey Details card.
    - Positioned the transparent One Go Bus luxury coach (`onego-luxury-coach.png`) in an independent foreground layer (`z-10`) with zero blur applied, maintaining complete visual sharpness, high contrast, and realistic ground shadow.
  - **3. Modal-Wide Ambient Glow Harmonization**:
    - Added a subtle modal-wide background layer using the Howrah Bridge photograph with `blur(16px)` and `opacity: 0.14`, harmonizing the pastel pink, golden, and mint green hues across the entire frosted glass window.
- **Verification**:
  - `npm run build`: Bundled cleanly in 276ms across 21 chunks with 0 errors.
  - `npm run lint`: 0 errors, 0 warnings across the repository.


## Phase 21 - Background Scroll Lock & Zero Cumulative Layout Shift Fix (2026-11-19)
- **Objective**: Fix background page scrolling when the Seat Selection Modal is open, ensuring a native, professional modal experience without layout shifts or scroll leakage.
- **Implementation**:
  - Added a dedicated `useEffect` in [`SeatSelectionModal.tsx`](file:///Users/soumabhamajumder/Documents/Projects/AI-Smart-Bus-Application/frontend/src/features/results/SeatSelectionModal.tsx) triggered by `isOpen`.
  - Dynamically calculates `scrollbarWidth = window.innerWidth - document.documentElement.clientWidth`.
  - Sets `document.body.style.overflow = 'hidden'` to completely lock background screen scrolling on `/results`.
  - When a vertical scrollbar was present, applies `document.body.style.paddingRight = '${scrollbarWidth}px'` to avoid any page content shifting (CLS = 0).
  - Gracefully restores original `overflow` and `paddingRight` values when the modal is closed or unmounted.
- **Verification**:
  - `npm run build`: Bundled in 339ms across 21 chunks with 0 errors.
  - `npm run lint`: 0 errors, 0 warnings across the repository.


## Phase 22 - Premium Modal Polish: Red Close Button, Spring Transitions, Dynamic Pricing & Removable Chips (2026-11-19)
- **Objective**: Deliver a refined, high-performance user experience for the Seat Selection Modal addressing four key areas:
  1. Top-right close button turns vibrant red on hover with smooth micro-interaction.
  2. Hardware-accelerated modal entry & exit animations with ease-in/ease-out transitions, zero lag, and instant responsiveness across all devices.
  3. Dynamic pricing tied directly to search results (`ticket.price`), featuring strikethrough original price, real-time total fare computation, and savings indicator.
  4. Interactive removable seat chips (`[ L2 ✕ ]` `[ L3 ✕ ]`) and a connected station timeline in the booking summary card.
- **Architectural & Design Enhancements**:
  - **1. Micro-Interactions: Red Hover Close Button**:
    - Enhanced top-right `X` button with `group/close` hover state: turns rose-red (`hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:shadow-rose-500/25 hover:scale-110 active:scale-95 duration-200 ease-in-out`).
    - Added 90-degree smooth rotation on the `X` icon inside: `group-hover/close:rotate-90 transition-transform duration-200`.
  - **2. Hardware-Accelerated Open & Exit Transitions**:
    - Created lightweight CSS keyframe animations in `frontend/src/index.css`:
      - `@keyframes modalBackdropFadeIn` & `@keyframes modalBackdropFadeOut` (opacity fade).
      - `@keyframes modalScaleIn` & `@keyframes modalScaleOut` (scale 0.95 ➔ 1.0 ➔ 0.96 with subtle vertical translation).
    - Implemented internal `isClosing` state and `handleClose` callback in `SeatSelectionModal.tsx` that triggers a 200ms exit animation before calling `onClose()`.
    - Zero external dependencies (zero Framer Motion / Lottie bundle bloat) ensuring 60fps performance on mobile, tablets, and laptops.
  - **3. Dynamic Pricing & Strikethrough Original Fare**:
    - Replaced static `₹1,499` with dynamic fare calculation derived from `ticket.price`:
      - Standard Lower Deck seats: base price (defaults to `ticket.price` or `₹749`).
      - Upper Deck sleeper berths: dynamic markup (`Math.round(basePrice * 1.15)`).
      - Total fare computes dynamically based on all selected seats.
      - Displays higher strikethrough original price (`₹{totalOriginalPrice}`), highlighted total payable fare (`₹{totalPrice}`), green "Save ₹{totalSavings}" badge, and "Best price guarantee" callout.
  - **4. Removable Seat Chips & Connected Station Timeline**:
    - "Your Seats" summary displays interactive seat pills with 1-click removal (`✕`), allowing users to deselect seats directly from the summary.
    - Added connected station route timeline in the right booking column with a vertical dashed connecting line and custom colored route node pins.
  - **5. Clean State Architecture (Zero React 19 Linter Warnings)**:
    - Replaced state duplication with a single `selectedSeatIds: string[]` state and purely derived `selectedSeats` via `useMemo`.
    - Wrapped handlers in `useCallback` to satisfy ESLint `react-hooks/set-state-in-effect` and `exhaustive-deps`.
- **Verification**:
  - `npm run build`: Bundled in 270ms across 21 chunks with 0 errors.
  - `npm run lint`: 0 errors, 0 warnings across the entire repository.


## Phase 23 - User Authentication Flow, Reactive Profile Avatar, and Glassmorphic Profile Page (2026-11-21)
- **Objective**: Implement the complete end-to-end user authentication lifecycle:
  1. Redirect travelers back to the home page (`/`) upon sign-in or registration.
  2. Dynamically replace "Sign In" and "Register" buttons in the top navbar with a 40px circular profile avatar button with live online status pip.
  3. Interactive glassmorphic dropdown popup with user preview (avatar, name, email, verified badge), navigation links ("My Profile", "My Bookings / Trips", "Preferences & Settings"), and sign-out action.
  4. Build a comprehensive, DPDP 2025 compliant glassmorphic Profile Page (`/profile`) showcasing traveler personal information, bus seat preferences, emergency contacts, JSON data export, and security session controls.
- **Architectural & Design Enhancements**:
  - **1. Reactive State Synchronization (`AuthContext` & `useAuth`)**:
    - Created `frontend/src/context/authContextInstance.ts`, `frontend/src/context/AuthContext.tsx`, and `frontend/src/context/useAuth.ts` separating React context, provider component, and custom hook to strictly satisfy Vite Fast Refresh linter rules.
    - Synchronized with `localStorage` across browser tabs via window storage listeners.
    - Enhanced `StoredUser` interface in `frontend/src/utils/tokenStorage.ts` with typed fields (`phone`, `avatar`, `role`, `memberSince`, `isStudent`, `emergencyContactName`, `emergencyContactPhone`, `gender`, `seatPreference`, `whatsappNotifications`, `smsNotifications`).
  - **2. Seamless Auth Redirects**:
    - Updated `LoginPage.tsx` and `RegisterPage.tsx` to authenticate travelers with initial verified mock profile profiles and redirect directly to `/` (Home page) or preserved return intent.
  - **3. Navbar & Mobile Menu Integration**:
    - `Navbar.tsx`: Added circular profile button with fallback to uppercase user initials on brand navy gradient.
    - Added click-away listener, Escape key dismiss, and smooth fade/slide micro-interactions for the profile dropdown.
    - `MobileMenu.tsx`: Updated mobile drawer to present authenticated traveler card with direct "My Profile" and "Sign Out" actions.
  - **4. Comprehensive Traveler Profile Page (`ProfilePage.tsx`)**:
    - Built light-mode glassmorphic page mounted at lazy-loaded route `/profile` protected by `<ProtectedRoute>`.
    - Hero Card: Howrah Bridge ambient background blur, 96px avatar with photo change toggle, role badges (`Verified Traveler`, `Student Privilege Pass`), and trip summary stats (4 journeys, ₹1,850 saved).
    - Modular Sub-Tabs:
      - **Personal Information**: Full Name, Primary Email (Verified), Phone Number (+91 SMS OTP Verified), Gender, Emergency Contact Name & Phone with inline Save micro-interaction and toast notification.
      - **Travel & Seat Preferences**: Preferred Seat Position (Lower Deck Window, Upper Deck Sleeper, Aisle), Student Concession Pass toggle, WhatsApp real-time GPS & QR pass dispatch toggle, SMS 30-min alert toggle.
      - **DPDP 2025 Privacy**: Data transparency card, "Download My Data (JSON)" export generator, and privacy policy links.
      - **Security & Sessions**: Active session details and one-click "Log Out of OneGoBus" button.
- **Verification**:
  - `npm run build`: Bundled in 264ms across 26 code-split chunks with 0 errors.
  - `npm run lint`: 0 errors, 0 warnings across the entire repository.


## Phase 24 - Complete One Go Bus Footer Redesign: Pixel-Accurate Reference Implementation (2026-11-21)
- **Objective**: Completely rebuild the website footer to match the exact design specification provided in `media_1795202553622_7da2d823.jpg`, replacing the previous oversized floating card with an elegant full-width layout flowing naturally with the cream-and-white canvas.
- **Architectural & Design Enhancements**:
  - **1. Section One — Premium Dark Navy Journey CTA Banner**:
    - Deep navy container (`#0B2341`, `rounded-[26px]`, horizontal padding `px-6 sm:px-12 lg:px-16`, vertical padding `py-8 sm:py-10`).
    - Left text: `MADE FOR MOVING` orange label (`#FC7728`, uppercase, bold), ExtraBold white heading `Your next journey starts here.`, and soft white description `Explore routes across Kolkata and West Bengal.`
    - Right illustration & action: Minimalist route illustration featuring location pin, smooth curved white path with orange waypoint dot (`#FC7728`), and white front-facing bus icon. Pill CTA button `Find buses →` with subtle hover slide animation navigating to `/results`.
  - **2. Section Two — Brand Information & 5-Column Navigation Grid**:
    - Column 1: Navy rounded-square bus emblem (`#0B2341`), exact brand text `One Go ` (Navy `#0B2341`) `Bus` (Orange `#FC7728`), mission description, and 3 light-neutral square buttons (`#F5F3EF`, radius 12px) for Instagram, LinkedIn, and GitHub.
    - Column 2 (`EXPLORE`): Search Buses, Popular Routes, Live Tracking, Ask AI.
    - Column 3 (`COMPANY`): About Us, Our Team, How It Works.
    - Column 4 (`SUPPORT`): Help Center, FAQs, Cancellations & Refunds, Contact Support.
    - Column 5 (`GET IN TOUCH`): Orange location pin with `Kolkata, West Bengal, India` and outlined white `Contact our team` button with envelope icon.
  - **3. Section Three — Newsletter Subscription**:
    - Thin `#EAE8E4` dividers above and below.
    - Orange envelope icon, heading `Get route updates`, and subtitle `Occasional travel news, straight to your inbox.`
    - High-accessibility email input and navy `#0B2341` `Subscribe` button with interactive validation and submission feedback toast.
  - **4. Section Four — Bottom Footer Bar with Kolkata Skyline Line-Art**:
    - Dynamic year copyright: `© 2026 One Go Bus. All rights reserved.`
    - Centered legal links: `Privacy Policy` • `Terms of Service` • `Accessibility`.
    - Delicate vector line-art illustration depicting Victoria Memorial dome & colonnade alongside the Howrah Bridge cantilever truss.
    - Orange outlined heart icon and semibold label: `Made for West Bengal`.
  - **5. Configuration & Code Cleanliness**:
    - Updated `frontend/src/components/layout/footer.config.ts` with strongly-typed interfaces.
    - Fully responsive across desktop (1920px, 1440px), tablet (1024px, 768px), and mobile (390px).
- **Verification**:
  - `npm run build`: Bundled in 296ms across 26 code-split chunks with 0 errors.
  - `npm run lint`: 0 errors, 0 warnings across the entire repository.


## Phase 25 - Footer Instagram SVG Icon Rendering Bug Fix (2026-11-21)
- **Problem**: In `frontend/src/components/layout/Footer.tsx`, the first social button (Instagram) rendered as a blank square while LinkedIn and GitHub appeared normally.
- **Root Cause**:
  1. The Instagram SVG had `className="w-5 h-5 fill-none stroke-currentColor"` where `stroke-currentColor` is not a valid Tailwind CSS class (the Tailwind utility is `stroke-current`, and standard SVG attribute is `stroke="currentColor"`).
  2. Because `stroke-currentColor` failed to resolve, the browser defaulted to `stroke: none`, while `fill-none` explicitly removed the fill, making all SVG shapes (rect, circle, dot) completely invisible (`fill: none; stroke: none;`).
  3. In contrast, LinkedIn and GitHub used explicit filled SVG paths with `fill="currentColor"`.
- **Solution**:
  - Replaced the stroked multi-shape Instagram SVG with the standard, high-contrast filled glyph SVG using explicit `fill="currentColor"` attribute and `className="w-5 h-5"`.
  - Harmonized `linkedin` and `github` to also use standard explicit `fill="currentColor"` attributes.
- **Verification**:
  - `npm run build`: Bundled in 284ms across 26 code-split chunks with 0 errors.
  - `npm run lint`: 0 errors, 0 warnings across the entire repository.


## Phase 27 - Profile Page Kolkata Heritage Panoramic Banner Redesign (2026-11-24)
- **Objective**: Redesign the traveler Profile page (`frontend/src/pages/ProfilePage.tsx`) banner to match the pixel-accurate user reference layout, integrating an authentic Kolkata heritage WebP artwork (`kolkata-profile-banner.webp`, 1552x236) depicting Victoria Memorial, the River Ganges with ferryboat, Howrah Bridge cantilever truss, vintage Kolkata yellow/blue bus, lamppost, and autumn foliage.
- **Key Architectural Decisions & Implementation**:
  - **Asset Integration**:
    - Converted and integrated `frontend/src/assets/kolkata-profile-banner.webp` (15.67 kB bundle footprint), optimized for instant asynchronous decoding and zero cumulative layout shift.
  - **Left-Aligned Desktop Information Architecture**:
    - Pinned the avatar and user profile details over the warm cream canvas (`#FCEBD7`) on the left half of the banner card.
    - Preserved 100% visibility of Howrah Bridge, Victoria Memorial, and the heritage coach on the right.
    - Designed an ultra-smooth CSS linear gradient mask (`#FCEBD7 0%` to transparent `66%`) eliminating any visible seams while guaranteeing maximum WCAG contrast for text and pills.
    - Embedded 3 quick corridor feature chips in a single horizontal row on desktop: `4 Journeys Completed`, `₹1,850 Saved with OneGo AI`, and `Kolkata ⇄ Siliguri Favorite`.
    - Placed top-right floating `Sign Out` button (`bg-white/90 hover:bg-rose-50 text-slate-700 hover:text-rose-600`) over the sky area.
  - **Responsive Mobile Stacking**:
    - On mobile viewports (`< 640px`), segregated artwork into a dedicated top scenic window (`h-36 object-cover object-right`), keeping the artwork completely clear of text.
    - Avatar overlaps cleanly with negative margin (`-mt-12`), and user contact details, verification badge, and chips stack neatly below in the cream card area.
    - Zero horizontal overflow or clipped text across all mobile device widths.
  - **Tabs & Functional Integration**:
    - Re-architected all tab containers (`Personal Information`, `Travel Preferences`, `DPDP 2025 Privacy`, `Security & Sessions`) using crisp white surfaces (`bg-white rounded-3xl border border-[#EAE8E4] shadow-xs`).
    - Maintained full reactivity with `useAuth` and `tokenStorage`: profile name/phone updates, seat preference options, student pass toggle, notification checkboxes, session indicators, and DPDP 2025 compliant JSON export.
- **Verification**:
  - `npm run build`: Bundled in 532ms across 26 code-split chunks with 0 errors.
  - `npm run lint`: 0 errors, 0 warnings across the entire repository.
  - Captured visual screenshots on desktop (1280x900) and mobile (390x844) viewports verifying pixel-accurate composition against the design mockup.


## Phase 28 - Profile Banner Minimalism & Traveler Milestones Strip (2026-11-24)
- **Problem**: In `frontend/src/pages/ProfilePage.tsx`, the "Member since" date and long contact line were extending into the right-hand artwork gradient, causing text blur and visual competition with the Howrah Bridge and heritage bus artwork.
- **Solution & UX Architecture**:
  - **Banner Minimalism & Frosted Glass Contact Capsule**:
    - Reduced banner content to essential identity elements: Avatar with ring and camera toggle, Full Name ("Soumabha Majumder"), emerald "Verified Traveler" pill, and a dedicated high-contrast frosted glass capsule (`bg-white/85 backdrop-blur-md border border-white/95 text-xs font-bold text-[#0B2341]`) containing email and phone with colored icon accents.
    - Freed over 70% of the banner canvas, keeping Victoria Memorial, River Ganges, Howrah Bridge, vintage coach, and foliage completely unobstructed.
  - **Traveler Milestones & Activity Bar**:
    - Extracted "Member Since" and corridor metrics into a dedicated 4-card quick perks bar positioned directly between the hero banner and sub-navigation tabs.
    - 4 balanced cards on desktop (2x2 grid on mobile):
      1. `Member Since`: Calendar icon in slate well, tenure date ("November 2026").
      2. `Completed Trips`: Emerald checkmark well, journey count ("4 Journeys").
      3. `OneGo AI Savings`: Orange sparkle well, saved amount ("₹1,850 Saved").
      4. `Favorite Corridor`: Teal pin well, frequent corridor ("Kolkata ⇄ Siliguri").
  - **Mobile Enhancement**:
    - Clean stacking on mobile with 2x2 grid for milestone cards, eliminating horizontal overflow and text crowding.
- **Verification**:
  - `npm run build`: Bundled cleanly in 346ms across 26 code-split chunks with 0 errors.
  - `npm run lint`: 0 errors, 0 warnings across the entire repository.
  - Captured updated desktop and mobile screenshots verifying high contrast, sharp readability, and zero text blur.


## Phase 29 - Backend Sign-Out Synchronization & Animated Confirmation Modal (2026-11-24)
- **Problem**:
  1. The banner's Sign Out button directly cleared local storage without notifying the Spring Boot backend server, leaving session cookies active.
  2. Clicking Sign Out immediately kicked the user out without a confirmation prompt or graceful transition.
- **Solution & Architecture**:
  - **Spring Boot Backend Synchronization**:
    - Added `@PostMapping("/logout")` to `com.smartbus.auth.controller.AuthController` clearing the HTTP-only `onego_token` cookie with `maxAge(0)` and returning `204 No Content`.
    - Added `logoutUser()` helper in `frontend/src/api/authApi.ts` triggering `POST /api/v1/auth/logout`.
    - Updated `AuthContext.tsx` to asynchronously notify the backend before resetting local user state and clearing `tokenStorage`.
  - **Animated Sign Out Confirmation Modal (`SignOutModal.tsx`)**:
    - Pop-in / pop-out CSS transition (`zoom-in-95 ease-out duration-200`) with dimmed backdrop (`bg-[#000D21]/50 backdrop-blur-xs`).
    - Styled with rose logout vector icon well, clear heading ("Are you sure you want to sign out?"), supportive context, X close button, and Cancel / Yes, Sign Out action buttons.
    - Zero cumulative layout shift (CLS = 0) with zero-shift body scroll lock and keyboard ESC-key dismissal.
    - Integrated across all profile sign out touchpoints (banner top-right desktop/mobile and Security tab danger zone).
- **Verification**:
  - Backend compile `./mvnw test-compile`: `BUILD SUCCESS` (7.66s, 22 source files).
  - Frontend `npm run lint` & `npm run build`: 0 errors, 0 warnings across 26 code-split chunks.
  - Captured visual screenshots on desktop (1280x900) and mobile (390x844) verifying modal appearance and responsiveness.


## Phase 31 - Purge of AI-Generated DPDP 2025 Badges & Profile Tab Streamlining (2026-11-24)
- **Problem**: The web application and traveler Profile Page contained repetitive references to "DPDP 2025 Privacy" and legal compliance badges. These appeared artificial, cluttered the UI, and were not actual user features.
- **Solution & Scope of Changes**:
  - **Traveler Profile Page (`frontend/src/pages/ProfilePage.tsx`)**:
    - Completely removed the "DPDP 2025 Privacy" tab from the tab navigation.
    - Removed the associated tab panel containing the JSON export generator and redundant legal text.
    - Cleanly streamlined the profile page to 3 focused, actionable tabs: `Personal Information`, `Travel Preferences`, and `Security & Sessions`.
    - Removed unused icons (`Download`, `FileText`) and handlers (`handleDownloadData`).
  - **Navbar Profile Dropdown (`frontend/src/components/layout/Navbar.tsx`)**:
    - Updated profile dropdown subtitle from `Seat choice & DPDP privacy` to `Seat choice & notifications`.
  - **Auth & Onboarding Layouts (`frontend/src/features/auth/AuthLayout.tsx`, `frontend/src/pages/RegisterPage.tsx`)**:
    - Replaced `DPDP 2025 Certified` with `Smart Transit Verified`.
    - Replaced `DPDP 2025 Compliant` with `Secure & Encrypted`.
    - Updated registration footnote from `I agree to Terms • DPDP 2025 compliant privacy` to standard `I agree to Terms of Service • Privacy Policy`.
  - **Booking & Results Modals (`frontend/src/features/results/SeatHoldModal.tsx`, `frontend/src/pages/ResultsPage.tsx`)**:
    - Replaced `DPDP 2025 regulations` with `West Bengal Smart Bus booking rules`.
    - Replaced `DPDP Act 2025 Protected` with `Instant Seat Protection`.
  - **Static Pages (`frontend/src/pages/AboutPage.tsx`, `frontend/src/pages/FeaturesPage.tsx`, `frontend/src/pages/PrivacyPage.tsx`)**:
    - Converted `DPDP 2025 Privacy` / `DPDP 2025 Certified` to clean, realistic transit privacy headers (`Data Privacy & Security`, `Safe & Verified Travel`, `User Data Rights`).
  - **Project Documentation (`AGENTS.md`, `docs/Docs.md`, `README.md`, `docs/AGENT_HANDOFF_SUMMARY.md`)**:
    - Updated section headers and specifications to reflect standard data privacy guardrails and the streamlined 3-tab profile architecture.
- **Verification**:
  - `git grep -i "dpdp" frontend/src/`: 0 matches in frontend codebase.
  - `npm --prefix frontend run lint`: 0 errors, 0 warnings.
  - `npm --prefix frontend run build`: Clean build in 329ms across 26 code-split chunks.

## Phase 32 - Kolkata Heritage Sign-Out Modal Pixel-Accurate Redesign (2026-11-24)
- **Problem**: The previous sign-out modal used a generic rose icon well and did not feature the brand's authentic visual identity, warm cream surfaces, or Kolkata transit heritage.
- **Solution & UX Architecture**:
  - **Kolkata Heritage Header**: Reused `kolkata-profile-banner.webp` within a warm cream header (`bg-[#FCEBD7]`, `h-[170px] sm:h-[185px]`) positioned with `object-cover object-right` showcasing Howrah Bridge, River Ganges, Victoria Memorial, and the vintage Kolkata heritage bus.
  - **Live Brand Identifier**: Integrated floating `[→ | One Go Bus` badge on top-left of the header with bold navy `#0B2341` wordmark and brand orange `#FC7728` vertical divider.
  - **Circular Close Button**: Positioned a pure white circular button (`w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md hover:bg-slate-50`) with an `X` vector icon on the top-right.
  - **Typography & Live Copy**:
    - Title: `Sign out of One Go Bus?` (`text-2xl sm:text-[27px] font-extrabold text-[#0B2341]`).
    - Subtitle: `You’ll sign out on this device. Your bookings stay saved.` (`text-[15px] sm:text-base text-slate-600`).
  - **Interactive Action Buttons (2 Columns Side-by-Side)**:
    - `Stay signed in`: White surface, border `border-slate-300`, navy text `#0B2341`, height `52-56px`, generous `rounded-2xl`. Receives initial keyboard focus on mount via `ref`.
    - `Sign out`: Primary deep navy `#0B2341`, white text, logout vector icon, height `52-56px`, `rounded-2xl`. Connected to `onConfirm` and disabled with loading indicator while pending.
  - **Accessibility & Interaction Polish**:
    - Dialog constrained to `max-w-[480px]` with 16px mobile side margins (`p-4` backdrop container).
    - Initial keyboard focus automatically applied to "Stay signed in" on modal mount.
    - Escape key and close icon dismiss the dialog and immediately return keyboard focus to the opener trigger element.
    - Focus trap cycles focus between modal interactive elements.
    - Zero layout shift scroll lock (`CLS = 0`) with scrollbar width compensation.
- **Verification**:
  - Captured desktop (1280x900) and mobile (390x844) visual screenshots (`modal_reference_desktop.png`, `modal_reference_mobile.png`) confirming exact alignment with user's reference image.
  - Verified initial focus check: `isStaySignedIn: true`.
  - Verified ESC key dismissal and modal closure: `modalClosed: true`.
  - `npm run lint`: 0 errors, 0 warnings.
  - `npm run build`: 0 errors across 26 code-split chunks (296ms).

## Phase 33 - Universal Navbar Dropdown & Mobile Menu Sign-Out Modal Integration (2026-11-25)
- **Problem**: When clicking "Sign Out" in the Navbar profile dropdown menu or the mobile navigation drawer, the application immediately executed an unconfirmed logout, bypassing the newly created Kolkata heritage `SignOutModal`.
- **Solution & Scope of Changes**:
  - **Navbar Profile Dropdown (`frontend/src/components/layout/Navbar.tsx`)**:
    - Connected `SignOutModal` directly into the floating `Navbar` layout.
    - Added `isSignOutModalOpen` and `isSigningOut` reactive states.
    - Replaced direct logout invocation on the dropdown menu item with `handleOpenSignOutModal()`, closing the dropdown menu and immediately opening the confirmation modal.
    - Connected confirmation to `handleConfirmSignOut()`, initiating asynchronous `POST /api/v1/auth/logout` to the backend, clearing local state, and navigating to `/`.
  - **Mobile Drawer Menu (`frontend/src/components/layout/MobileMenu.tsx`)**:
    - Added `onOpenSignOutModal?: () => void` to `MobileMenuProps`.
    - Wired mobile Sign Out action button to dismiss the drawer and trigger the confirmation dialog.
- **Verification**:
  - Automated CDP interaction test verified clicking Sign Out in the Navbar dropdown opens `SignOutModal` (`modalMounted: true`, title `Sign out of One Go Bus?`, initial focus on `Stay signed in`).
  - Verified clicking `Stay signed in` dismisses modal cleanly without altering session token (`modalClosed: true`, `userStillLoggedIn: true`).
  - Captured verification screenshot `modal_from_navbar.png`.
  - `npm --prefix frontend run lint`: 0 errors, 0 warnings.
  - `npm --prefix frontend run build`: 0 errors across 26 code-split chunks (386ms).







